/**
 * @fileoverview UNDR Chat Bridge — Supabase Realtime Integration Layer
 * 
 * This module patches the existing localStorage-based chat system in app.js
 * to use Supabase Realtime (WebSockets) when available, with automatic
 * localStorage fallback for offline/unauthenticated scenarios.
 * 
 * It is loaded AFTER app.js and patches global functions in place.
 */

import {
    getOrCreateConversation,
    getUserConversations,
    loadMessages,
    sendMessage,
    sendTipMessage,
    sendPPVMessage,
    getPPVSignedUrl,
    unlockPPVMessage,
    markMessagesAsRead,
    broadcastTyping,
    subscribeToConversation,
    unsubscribeFromConversation,
    createMessageNotification,
} from './realtime-chat.js';

import { supabase, isSupabaseConfigured } from './supabase-config.js';

// ─── State ─────────────────────────────────────────────────────────────────────
let currentConversationId = null;
let currentSupabaseUserId = null;
let currentSupabaseUserRole = null;
let realtimeMessages = []; // buffer for realtime messages
let onlineUsersInConversation = new Set();
let partnerIsTyping = false;
let typingIndicatorTimeout = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getCurrentSupabaseUser() {
    if (!isSupabaseConfigured() || !supabase) return null;
    const session = supabase.auth.session ? supabase.auth.session() : null;
    return session?.user || null;
}

function getLocalUser() {
    try {
        return JSON.parse(localStorage.getItem('undr_current_user'));
    } catch {
        return null;
    }
}

function isOnline(userId) {
    return onlineUsersInConversation.has(userId);
}

// ─── Typing Indicator UI ──────────────────────────────────────────────────────

function showTypingIndicator(show) {
    const indicator = document.getElementById('chat-typing-indicator');
    if (!indicator) return;
    indicator.style.display = show ? 'flex' : 'none';
    if (show) {
        clearTimeout(typingIndicatorTimeout);
        typingIndicatorTimeout = setTimeout(() => {
            indicator.style.display = 'none';
            partnerIsTyping = false;
        }, 3000);
    }
}

// ─── Online Status UI ──────────────────────────────────────────────────────────

function updateOnlineStatus(onlineUsers) {
    onlineUsersInConversation = new Set(onlineUsers);

    // Update online dot in chat header
    const onlineDot = document.getElementById('chat-online-dot');
    const statusText = document.getElementById('chat-status-text');
    if (onlineDot && statusText) {
        const partnerOnline = onlineUsers.length > 1; // more than just self
        onlineDot.style.display = partnerOnline ? 'inline-block' : 'none';
        statusText.textContent = partnerOnline
            ? (window.currentLang === 'es' ? '● En línea' : '● Online')
            : (window.currentLang === 'es' ? 'Última vez hoy' : 'Active today');
    }
}

// ─── Read Receipt UI ───────────────────────────────────────────────────────────

function refreshReadReceipts(conversationId) {
    // Update existing message bubbles with ✓✓ read marks
    const sentBubbles = document.querySelectorAll('.message-bubble.sent');
    sentBubbles.forEach(bubble => {
        const tick = bubble.querySelector('.read-tick');
        if (tick) {
            tick.textContent = '✓✓';
            tick.style.color = 'var(--accent-color)';
        }
    });
}

// ─── Message Normalization ─────────────────────────────────────────────────────
// Converts a Supabase message row → app.js expected format

async function normalizeSupabaseMessage(msg, currentUserId) {
    const isSent = msg.sender_id === currentUserId;
    const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const base = {
        id: msg.id,
        sender: isSent ? (currentSupabaseUserRole === 'creator' ? 'creator' : 'user') : (currentSupabaseUserRole === 'creator' ? 'user' : 'creator'),
        text: msg.text || '',
        time,
        read_by: msg.read_by || [],
        created_at: msg.created_at,
    };

    if (msg.is_ppv) {
        let mediaUrl = msg.ppv_media_url || '';
        if (!msg.is_unlocked) {
            // Get blurred preview
            if (mediaUrl && !mediaUrl.startsWith('blob:') && !mediaUrl.startsWith('http')) {
                mediaUrl = await getPPVSignedUrl(mediaUrl);
            }
        } else {
            if (mediaUrl && !mediaUrl.startsWith('blob:') && !mediaUrl.startsWith('http')) {
                mediaUrl = await getPPVSignedUrl(mediaUrl);
            }
        }
        return {
            ...base,
            isPpv: true,
            isUnlocked: msg.is_unlocked,
            ppvPrice: msg.ppv_price,
            mediaUrl,
            _messageId: msg.id,
        };
    }

    if (msg.is_tip) {
        return { ...base, isTip: true, tipAmount: msg.tip_amount };
    }

    if (msg.is_proposal) {
        return {
            ...base,
            isProposal: true,
            style: msg.proposal_style,
            wear: msg.proposal_wear,
            notes: msg.proposal_notes,
            price: msg.proposal_price,
            status: msg.proposal_status,
        };
    }

    return base;
}

// ─── Chat Initialization ──────────────────────────────────────────────────────

/**
 * Initialize Supabase Realtime for a given conversation.
 * Called when the chat section is opened or when activeChatCreator changes.
 */
window.initRealtimeChatFor = async function(conversationId, userId, role) {
    if (!isSupabaseConfigured() || !supabase) return;
    if (currentConversationId === conversationId) return; // already subscribed

    currentConversationId = conversationId;
    currentSupabaseUserId = userId;
    currentSupabaseUserRole = role;

    await subscribeToConversation(conversationId, userId, {
        onMessage: async (msg, type) => {
            const normalized = await normalizeSupabaseMessage(msg, userId);
            if (type === 'update') {
                // Update existing message in the DOM
                appendOrUpdateRealtimeMessage(normalized, true);
            } else {
                // New message received
                appendOrUpdateRealtimeMessage(normalized, false);
                // Mark as read if chat is open
                markMessagesAsRead(conversationId, userId);
                // Notification badge update
                updateUnreadBadge();

                // Show browser notification if message is from partner (not self)
                // and the tab is not currently focused
                if (msg.sender_id !== userId) {
                    const senderName = msg.sender?.username || msg.sender?.handle || 'Message';
                    const preview = msg.is_ppv
                        ? `🔒 Locked content - $${msg.ppv_price}`
                        : msg.is_tip
                            ? `💰 Tip: $${msg.tip_amount}`
                            : (msg.text || '').slice(0, 80);

                    if (!document.hasFocus() && window.undrPush?.showBrowserNotification) {
                        window.undrPush.showBrowserNotification(`💬 ${senderName}`, {
                            body: preview,
                            tag: `undr-msg-${conversationId}`,
                            onClick: () => window.showSection && window.showSection('chat'),
                        });
                    }
                }
            }
        },

        onTyping: (remoteUserId, isTyping) => {
            if (isTyping) {
                partnerIsTyping = true;
                showTypingIndicator(true);
            } else {
                partnerIsTyping = false;
                showTypingIndicator(false);
            }
        },
        onPresence: (onlineUsers) => {
            updateOnlineStatus(onlineUsers);
        },
        onRead: (remoteUserId, convId) => {
            refreshReadReceipts(convId);
        },
    });

    // Mark current messages as read
    markMessagesAsRead(conversationId, userId);
};

// ─── Append Realtime Message to DOM ──────────────────────────────────────────

function appendOrUpdateRealtimeMessage(msg, isUpdate) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    if (isUpdate) {
        // Find and replace message bubble by data-id
        const existing = container.querySelector(`[data-msg-id="${msg.id}"]`);
        if (existing) {
            existing.remove();
            // Re-render this single message
            renderSingleMessageBubble(msg, container, false);
        }
        return;
    }

    // Check if already rendered (avoid duplicates)
    if (container.querySelector(`[data-msg-id="${msg.id}"]`)) return;

    // Append new message
    renderSingleMessageBubble(msg, container, true);
}

function renderSingleMessageBubble(msg, container, scrollToBottom) {
    const el = createMessageBubbleElement(msg);
    if (!el) return;
    container.appendChild(el);
    if (scrollToBottom) {
        container.scrollTop = container.scrollHeight;
    }
}

function createMessageBubbleElement(msg) {
    const currentUser = getLocalUser();
    if (!currentUser) return null;
    const lang = window.currentLang || 'en';
    const isSent = msg.sender === 'user' 
        ? currentUser.role === 'buyer'
        : currentUser.role === 'creator';

    const div = document.createElement('div');
    div.setAttribute('data-msg-id', msg.id || `local_${Date.now()}`);

    if (msg.isPpv) {
        const isUnlocked = msg.isUnlocked;
        div.className = 'ppv-lock-card';
        div.innerHTML = `
            <div class="ppv-image-wrapper">
                <img src="${msg.mediaUrl}" alt="PPV Media" class="${isUnlocked ? '' : 'blurred'}">
                ${!isUnlocked ? `
                    <div class="ppv-overlay-lock">
                        <i class="fa-solid fa-lock ppv-lock-icon"></i>
                        <span class="ppv-lock-price">$${(msg.ppvPrice || 0).toFixed(2)} USD</span>
                    </div>
                ` : ''}
            </div>
            <div class="ppv-card-footer">
                <span class="ppv-card-title">${lang === 'es' ? 'Pack Exclusivo' : 'Exclusive Photoset'}</span>
                <span class="ppv-card-desc">${msg.text}</span>
                ${!isUnlocked && currentUser.role === 'buyer' ? `
                    <button class="btn btn-register btn-block" style="padding: 8px 14px; font-size: 0.8rem;" 
                        onclick="window.unlockPpvMessageById('${msg._messageId || msg.id}', ${msg.ppvPrice})">
                        <i class="fa-solid fa-unlock"></i> ${lang === 'es' ? 'Desbloquear Contenido' : 'Unlock Content'}
                    </button>
                ` : isUnlocked ? `
                    <span style="font-size:0.75rem; color:#0bb08b; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Unlocked</span>
                ` : `
                    <span style="font-size:0.72rem; color:var(--text-muted);"><i class="fa-solid fa-lock"></i> Locked PPV sent to buyer</span>
                `}
            </div>
        `;
        return div;
    }

    if (msg.isTip) {
        div.className = `message-bubble ${isSent ? 'sent' : 'received'}`;
        div.style.cssText = `
            background: ${isSent ? 'linear-gradient(135deg, #ff4d6d, #ff758c)' : 'var(--secondary-bg)'};
            color: ${isSent ? '#fff' : 'var(--text-color)'};
            border: 1px solid #ff4d6d;
        `;
        div.innerHTML = `
            <div style="font-weight:700; font-size:0.85rem; margin-bottom:4px;">
                <i class="fa-solid fa-heart" style="color:${isSent ? '#fff' : '#ff4d6d'};"></i>
                ${lang === 'es' ? 'Propina Enviada' : 'Tip Sent'}: $${(msg.tipAmount || 0).toFixed(2)} USD
            </div>
            <div style="font-size:0.8rem; font-style:italic;">"${msg.text}"</div>
            <span class="message-time" style="color:${isSent ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)'};">${msg.time}</span>
        `;
        return div;
    }

    // Standard text message
    div.className = `message-bubble ${isSent ? 'sent' : 'received'}`;
    const readTick = isSent ? '<span class="read-tick" style="font-size:0.65rem; opacity:0.7; margin-left:4px;">✓</span>' : '';
    div.innerHTML = `
        ${msg.text}
        <span class="message-time">${msg.time}${readTick}</span>
    `;
    return div;
}

// ─── Patch: unlockPpvMessageById (Supabase version) ─────────────────────────

window.unlockPpvMessageById = async function(messageId, price) {
    const currentUser = getLocalUser();
    if (!currentUser || currentUser.role !== 'buyer') return;

    if (!isSupabaseConfigured() || !supabase) {
        // Fallback: use the old index-based unlock
        window.unlockPpvMessage && window.unlockPpvMessage(window.activeChatCreator, 0);
        return;
    }

    // Check balance first
    if (currentUser.balance < price) {
        // Open payment gateway
        const gatewayModal = document.getElementById('gateway-modal');
        const gatewayTotalAmount = document.getElementById('gateway-total-amount');
        if (gatewayModal && gatewayTotalAmount) {
            gatewayTotalAmount.textContent = `$${price.toFixed(2)} USD`;
            window.ccbillPaymentCallback = async () => {
                await doUnlockPPV(messageId, price);
            };
            gatewayModal.style.display = 'flex';
        }
        return;
    }

    await doUnlockPPV(messageId, price);
};

async function doUnlockPPV(messageId, price) {
    try {
        // Call Supabase RPC for atomic unlock
        const { data, error } = await supabase.rpc('unlock_ppv_message', {
            p_message_id: messageId,
            p_buyer_id: currentSupabaseUserId,
        });

        if (error) throw error;

        if (data?.success) {
            // Get signed URL
            const signedUrl = await getPPVSignedUrl(data.ppv_media_url);
            // Update DOM
            const card = document.querySelector(`[data-msg-id="${messageId}"]`);
            if (card) {
                const img = card.querySelector('img');
                if (img) { img.src = signedUrl; img.classList.remove('blurred'); }
                const overlay = card.querySelector('.ppv-overlay-lock');
                if (overlay) overlay.remove();
                const unlockBtn = card.querySelector('.btn-register');
                if (unlockBtn) unlockBtn.outerHTML = `<span style="font-size:0.75rem;color:#0bb08b;font-weight:700;"><i class="fa-solid fa-circle-check"></i> Unlocked</span>`;
            }
            window.showToast && window.showToast('PPV Content Unlocked! 🔓');
            window.syncUserSessionUI && window.syncUserSessionUI();
        } else {
            alert(data?.error || 'Could not unlock. Please try again.');
        }
    } catch (err) {
        console.error('[UNDR Chat] doUnlockPPV error:', err);
        // Fallback to localStorage version
        window.unlockPpvMessage && window.unlockPpvMessage(window.activeChatCreator, 0);
    }
}

// ─── Patch: sendTextMessageFromBar (Supabase version) ────────────────────────

const _originalSendTextMsg = window.sendTextMessageFromBar;

window.sendTextMessageFromBar = async function() {
    const chatTextInput = document.getElementById('chat-text-input');
    const textVal = chatTextInput?.value?.trim();
    if (!textVal) return;

    if (isSupabaseConfigured() && supabase && currentConversationId && currentSupabaseUserId) {
        try {
            chatTextInput.value = '';
            const { data, error } = await sendMessage(currentConversationId, currentSupabaseUserId, textVal);
            if (error) throw error;
            // Message will arrive via Realtime subscription
            // Also update local UI immediately (optimistic update)
            const msg = {
                id: data?.id || `opt_${Date.now()}`,
                sender: currentSupabaseUserRole === 'creator' ? 'creator' : 'user',
                text: textVal,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                created_at: new Date().toISOString(),
            };
            appendOrUpdateRealtimeMessage(msg, false);
            return;
        } catch (err) {
            console.warn('[UNDR Chat] Supabase send failed, falling back to localStorage:', err.message);
            chatTextInput.value = textVal; // restore
        }
    }

    // localStorage fallback
    if (typeof _originalSendTextMsg === 'function') {
        _originalSendTextMsg();
    }
};

// ─── Patch: Typing broadcast on input ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    const chatTextInput = document.getElementById('chat-text-input');
    if (chatTextInput) {
        chatTextInput.addEventListener('input', () => {
            if (currentConversationId && currentSupabaseUserId) {
                broadcastTyping(currentConversationId, currentSupabaseUserId);
            }
        });
    }
});

// ─── Patch: PPV Send (Supabase Storage version) ──────────────────────────────

window.sendPPVWithSupabase = async function(file, price, caption) {
    if (!isSupabaseConfigured() || !supabase || !currentConversationId || !currentSupabaseUserId) {
        window.showToast && window.showToast('PPV feature requires Supabase connection.');
        return;
    }

    try {
        await sendPPVMessage(currentConversationId, currentSupabaseUserId, file, price, caption);
        window.showToast && window.showToast(
            window.currentLang === 'es'
                ? `Foto PPV de $${price.toFixed(2)} USD enviada al chat.`
                : `Locked PPV photo ($${price.toFixed(2)} USD) sent to chat.`
        );
    } catch (err) {
        console.error('[UNDR Chat] sendPPVWithSupabase error:', err);
        window.showToast && window.showToast('Failed to upload PPV. Using local fallback.');
    }
};

// ─── Patch: loadChatSection — Supabase conversation init ─────────────────────

const _originalShowSection = window.showSection;
if (typeof _originalShowSection === 'function') {
    window.showSection = async function(sectionName, element, updateHash) {
        _originalShowSection(sectionName, element, updateHash);

        if (sectionName === 'chat') {
            await initSupabaseChatSession();
        }
    };
}

// ─── Supabase Chat Session Initialization ─────────────────────────────────────

async function initSupabaseChatSession() {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
        // Get current authenticated user from Supabase
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return;

        currentSupabaseUserId = user.id;

        // Get profile to determine role
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, role, handle, username')
            .eq('id', user.id)
            .single();

        if (!profile) return;
        currentSupabaseUserRole = profile.role;

        // Load conversations from Supabase and render sidebar
        const supabaseConvs = await getUserConversations(user.id, profile.role);
        if (supabaseConvs && supabaseConvs.length > 0) {
            await renderSupabaseChatSidebar(supabaseConvs, profile, user.id);
        }
    } catch (err) {
        console.warn('[UNDR Chat] initSupabaseChatSession error:', err.message);
    }
}

async function renderSupabaseChatSidebar(conversations, selfProfile, selfId) {
    const chatUsersList = document.getElementById('chat-users-list');
    if (!chatUsersList) return;

    // Only replace if we have Supabase conversations to show
    if (conversations.length === 0) return;

    chatUsersList.innerHTML = '';

    for (const conv of conversations) {
        const partner = selfProfile.role === 'creator' ? conv.buyer_id : conv.creator_id;
        const partnerName = partner?.username || 'Unknown';
        const partnerHandle = partner?.handle || '@unknown';
        const partnerAvatar = partner?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100';
        const lastMsg = conv.last_message_preview || '';
        const isActive = conv.id === currentConversationId;

        const item = document.createElement('div');
        item.className = `chat-user-item ${isActive ? 'active' : ''}`;
        item.setAttribute('data-conv-id', conv.id);
        item.innerHTML = `
            <div class="chat-avatar-wrapper" style="position:relative;">
                <img src="${partnerAvatar}" alt="${partnerName}" class="chat-user-avatar">
                <span class="online-dot" id="online-dot-${partner?.id}" style="display:none; position:absolute; bottom:1px; right:1px; width:10px; height:10px; border-radius:50%; background:#22c55e; border:2px solid var(--primary-bg);"></span>
            </div>
            <div class="chat-user-details" style="flex: 1; display: flex; flex-direction: column;">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px;">
                    <span class="chat-user-name" style="font-weight: 700;">${partnerName}</span>
                    <span style="font-size: 0.76rem; color: var(--accent-hover); font-weight: 600;">${partnerHandle}</span>
                </div>
                <span class="chat-user-lastmsg">${lastMsg}</span>
            </div>
        `;

        item.addEventListener('click', async () => {
            // Highlight active
            chatUsersList.querySelectorAll('.chat-user-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            // Set active conversation
            window.activeChatCreator = partnerName;
            currentConversationId = conv.id;

            // Load and render messages
            await loadAndRenderSupabaseMessages(conv.id, selfId, selfProfile.role, {
                name: partnerName,
                handle: partnerHandle,
                avatar: partnerAvatar,
                partnerId: partner?.id,
            });

            // Subscribe to realtime
            await window.initRealtimeChatFor(conv.id, selfId, selfProfile.role);

            // Mobile: switch to chat window
            const chatContainer = document.querySelector('.chat-container');
            if (chatContainer) chatContainer.classList.add('mobile-active-chat');
        });

        chatUsersList.appendChild(item);
    }

    // Auto-load first conversation
    if (conversations.length > 0 && !currentConversationId) {
        const first = conversations[0];
        const partner = selfProfile.role === 'creator' ? first.buyer_id : first.creator_id;
        currentConversationId = first.id;
        window.activeChatCreator = partner?.username;
        await loadAndRenderSupabaseMessages(first.id, selfId, selfProfile.role, {
            name: partner?.username,
            handle: partner?.handle,
            avatar: partner?.avatar_url,
            partnerId: partner?.id,
        });
        await window.initRealtimeChatFor(first.id, selfId, selfProfile.role);
    }
}

async function loadAndRenderSupabaseMessages(conversationId, selfId, role, partner) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    // Update chat header
    const chatActiveName = document.getElementById('chat-active-name');
    const chatActiveHandle = document.getElementById('chat-active-handle');
    const chatActiveAvatar = document.getElementById('chat-active-avatar');
    if (chatActiveName) chatActiveName.textContent = partner.name || '';
    if (chatActiveHandle) chatActiveHandle.textContent = partner.handle || '';
    if (chatActiveAvatar) chatActiveAvatar.src = partner.avatar || '';

    container.innerHTML = `
        <div style="text-align:center; padding:20px; color:var(--text-muted); font-size:0.8rem;">
            <i class="fa-solid fa-spinner fa-spin"></i> Loading messages...
        </div>
    `;

    const messages = await loadMessages(conversationId);
    if (!messages) {
        // Supabase failed — fall back to localStorage render
        window.renderChatMessages && window.renderChatMessages(window.activeChatCreator);
        return;
    }

    container.innerHTML = '';
    realtimeMessages = [];

    for (const msg of messages) {
        const normalized = await normalizeSupabaseMessage(msg, selfId);
        realtimeMessages.push(normalized);
        renderSingleMessageBubble(normalized, container, false);
    }

    container.scrollTop = container.scrollHeight;
}

// ─── Unread Messages Badge ────────────────────────────────────────────────────

async function updateUnreadBadge() {
    if (!isSupabaseConfigured() || !supabase || !currentSupabaseUserId) return;

    try {
        // Count unread notifications of type 'chat'
        const { count } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', currentSupabaseUserId)
            .eq('is_read', false)
            .eq('type', 'chat');

        const badge = document.getElementById('nav-messages-badge');
        if (badge) {
            if (count > 0) {
                badge.textContent = count > 9 ? '9+' : count;
                badge.style.display = 'inline-flex';
            } else {
                badge.style.display = 'none';
            }
        }
    } catch (err) {
        // Silent fail
    }
}

// ─── Subscribe to global notifications via Supabase Realtime ─────────────────

async function subscribeToGlobalNotifications(userId) {
    if (!isSupabaseConfigured() || !supabase || !userId) return;

    const notifChannel = supabase.channel(`notifications:${userId}`);
    notifChannel
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
        }, (payload) => {
            const notif = payload.new;
            // Show toast for chat notifications
            if (notif.type === 'chat') {
                window.showToast && window.showToast(`💬 ${notif.text}`);
                updateUnreadBadge();
            }
        })
        .subscribe();
}

// ─── Main Init ────────────────────────────────────────────────────────────────

async function initChatBridge() {
    if (!isSupabaseConfigured() || !supabase) {
        console.log('%c💬 UNDR Chat Bridge: localStorage mode (Supabase unavailable)', 'color: #f59e0b; font-weight: bold;');
        return;
    }

    // Subscribe to auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            currentSupabaseUserId = session.user.id;
            await subscribeToGlobalNotifications(session.user.id);
            await updateUnreadBadge();
            // Initialize push notifications for this user
            if (window.undrPush?.initPushNotifications) {
                await window.undrPush.initPushNotifications(session.user.id);
            }
        } else if (event === 'SIGNED_OUT') {
            // Unsubscribe from push
            if (window.undrPush?.unsubscribeWebPush && currentSupabaseUserId) {
                await window.undrPush.unsubscribeWebPush(currentSupabaseUserId);
            }
            currentSupabaseUserId = null;
            currentConversationId = null;
            await unsubscribeFromConversation();
        }
    });

    // Check if already signed in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        currentSupabaseUserId = user.id;
        await subscribeToGlobalNotifications(user.id);
        await updateUnreadBadge();
        // Init push for already-logged-in user
        if (window.undrPush?.initPushNotifications) {
            await window.undrPush.initPushNotifications(user.id);
        }
    }

    console.log('%c💬 UNDR Chat Bridge: Supabase Realtime mode active', 'color: #22c55e; font-weight: bold; font-size: 13px;');
}

initChatBridge();
