/**
 * @fileoverview UNDR Realtime Chat Engine
 * 
 * Powered by Supabase Realtime (WebSockets over PostgreSQL LISTEN/NOTIFY).
 * Handles:
 *  - Real-time message delivery (instant, no polling)
 *  - Presence: online/offline status per conversation
 *  - Typing indicators ("escribiendo..." / "typing...")
 *  - Read receipts (✓ sent / ✓✓ read)
 *  - PPV media: upload to Supabase Storage, signed URLs, payment unlock
 *  - Content moderation (spam/abuse detection)
 *  - Automatic localStorage fallback when Supabase is unavailable
 */

import { supabase, isSupabaseConfigured } from './supabase-config.js';

// ─── State ────────────────────────────────────────────────────────────────────
let activeConversationId = null;
let activeChannel = null;
let presenceChannel = null;
let typingTimeout = null;
let isTyping = false;
const TYPING_DEBOUNCE_MS = 2500;

// Callbacks registered by app.js
const callbacks = {
    onMessage: null,      // (message) => void
    onTyping: null,       // (userId, isTyping) => void
    onPresence: null,     // (onlineUsers) => void
    onRead: null,         // (userId, conversationId) => void
    onError: null,        // (error) => void
};

// ─── Content Moderation ──────────────────────────────────────────────────────
const SPAM_PATTERNS = [
    /\b(click here|free money|whatsapp me|telegram me|onlyfans\.com|only fans)\b/gi,
    /\b(venmo|cashapp|paypal|zelle)\s*me\b/gi,
    /(?:https?:\/\/(?!undr-my\.vercel\.app)[^\s]+)/gi, // External URLs
];

function moderateMessage(text) {
    if (!text || typeof text !== 'string') return { safe: true, text };
    const trimmed = text.trim();
    if (trimmed.length > 2000) {
        return { safe: false, reason: 'Message too long (max 2000 characters)' };
    }
    for (const pattern of SPAM_PATTERNS) {
        if (pattern.test(trimmed)) {
            return { safe: false, reason: 'Message contains prohibited content or external links' };
        }
    }
    return { safe: true, text: trimmed };
}

// ─── Conversation Management ─────────────────────────────────────────────────

/**
 * Get or create a conversation between buyer and creator.
 * Falls back to localStorage key if Supabase unavailable.
 */
export async function getOrCreateConversation(buyerId, creatorId) {
    if (!isSupabaseConfigured() || !supabase) {
        // localStorage fallback: use creatorName as key
        return { id: `local_${creatorId}`, isLocal: true };
    }

    try {
        // Check if conversation already exists
        const { data: existing, error: fetchErr } = await supabase
            .from('conversations')
            .select('id, buyer_id, creator_id, last_message_preview, last_message_at')
            .eq('buyer_id', buyerId)
            .eq('creator_id', creatorId)
            .single();

        if (existing && !fetchErr) return { id: existing.id, isLocal: false, data: existing };

        // Create new conversation
        const { data: created, error: createErr } = await supabase
            .from('conversations')
            .insert({ buyer_id: buyerId, creator_id: creatorId })
            .select('id')
            .single();

        if (createErr) throw createErr;
        return { id: created.id, isLocal: false, data: created };
    } catch (err) {
        console.warn('[UNDR Chat] getOrCreateConversation error:', err.message);
        return { id: `local_${creatorId}`, isLocal: true };
    }
}

/**
 * Fetch all conversations for the current user (as buyer or creator).
 */
export async function getUserConversations(userId, role) {
    if (!isSupabaseConfigured() || !supabase) return null; // app.js falls back to localStorage

    const column = role === 'creator' ? 'creator_id' : 'buyer_id';
    const otherColumn = role === 'creator' ? 'buyer_id' : 'creator_id';

    try {
        const { data, error } = await supabase
            .from('conversations')
            .select(`
                id,
                last_message_preview,
                last_message_at,
                ${otherColumn}:profiles!${otherColumn}(id, username, handle, avatar_url, role)
            `)
            .eq(column, userId)
            .order('last_message_at', { ascending: false, nullsFirst: false });

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.warn('[UNDR Chat] getUserConversations error:', err.message);
        return null;
    }
}

// ─── Message History ─────────────────────────────────────────────────────────

/**
 * Load message history for a conversation (paginated, newest first).
 */
export async function loadMessages(conversationId, limit = 50, before = null) {
    if (!isSupabaseConfigured() || !supabase) return null;

    try {
        let query = supabase
            .from('messages')
            .select(`
                id,
                conversation_id,
                sender_id,
                text,
                is_ppv,
                ppv_price,
                ppv_media_url,
                is_unlocked,
                is_proposal,
                proposal_style,
                proposal_wear,
                proposal_notes,
                proposal_price,
                proposal_status,
                is_tip,
                tip_amount,
                read_by,
                created_at,
                sender:profiles!sender_id(id, username, handle, avatar_url)
            `)
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true })
            .limit(limit);

        if (before) query = query.lt('created_at', before);

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.warn('[UNDR Chat] loadMessages error:', err.message);
        return null;
    }
}

// ─── Send Message ─────────────────────────────────────────────────────────────

/**
 * Send a text message to a conversation.
 * Persists to Supabase DB + updates last_message_preview on conversation.
 */
export async function sendMessage(conversationId, senderId, text, extras = {}) {
    // Moderate content
    const mod = moderateMessage(text);
    if (!mod.safe) {
        throw new Error(mod.reason);
    }

    const payload = {
        conversation_id: conversationId,
        sender_id: senderId,
        text: mod.text,
        is_ppv: false,
        is_proposal: false,
        is_tip: false,
        ...extras,
    };

    if (!isSupabaseConfigured() || !supabase) {
        // localStorage fallback
        return saveMessageLocal(conversationId, payload);
    }

    try {
        const { data, error } = await supabase
            .from('messages')
            .insert(payload)
            .select('*')
            .single();

        if (error) throw error;

        // Update conversation's last_message_preview
        await supabase
            .from('conversations')
            .update({
                last_message_preview: text.slice(0, 120),
                last_message_at: new Date().toISOString(),
            })
            .eq('id', conversationId);

        return { data, isLocal: false };
    } catch (err) {
        console.warn('[UNDR Chat] sendMessage error:', err.message);
        // Fallback to localStorage
        return saveMessageLocal(conversationId, payload);
    }
}

/**
 * Send a tip message (already paid via gateway).
 */
export async function sendTipMessage(conversationId, senderId, tipAmount, text) {
    return sendMessage(conversationId, senderId, text || '❤️', {
        is_tip: true,
        tip_amount: tipAmount,
    });
}

/**
 * Send a PPV (Pay-Per-View) locked message with image from Supabase Storage.
 */
export async function sendPPVMessage(conversationId, senderId, file, price, caption) {
    if (!isSupabaseConfigured() || !supabase) {
        // localStorage fallback with blob URL
        const localUrl = URL.createObjectURL(file);
        return saveMessageLocal(conversationId, {
            conversation_id: conversationId,
            sender_id: senderId,
            text: caption || 'Exclusive Content',
            is_ppv: true,
            ppv_price: price,
            ppv_media_url: localUrl,
            is_unlocked: false,
        });
    }

    try {
        // Upload to Supabase Storage (private bucket)
        const fileName = `ppv/${conversationId}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
            .from('ppv-media')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadErr) throw uploadErr;

        // Store the path (not the full URL — will be signed on demand)
        const storagePath = uploadData.path;

        const { data, error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: senderId,
                text: caption || 'Exclusive Content',
                is_ppv: true,
                ppv_price: price,
                ppv_media_url: storagePath, // stored as path, not public URL
                is_unlocked: false,
            })
            .select('*')
            .single();

        if (error) throw error;

        await supabase
            .from('conversations')
            .update({
                last_message_preview: `🔒 Locked PPV - $${price.toFixed(2)}`,
                last_message_at: new Date().toISOString(),
            })
            .eq('id', conversationId);

        return { data, isLocal: false };
    } catch (err) {
        console.warn('[UNDR Chat] sendPPVMessage error:', err.message);
        throw err;
    }
}

/**
 * Generate a signed URL for a PPV image (valid 15 minutes).
 */
export async function getPPVSignedUrl(storagePath) {
    if (!isSupabaseConfigured() || !supabase) return storagePath;
    if (storagePath.startsWith('blob:') || storagePath.startsWith('http')) return storagePath;

    try {
        const { data, error } = await supabase.storage
            .from('ppv-media')
            .createSignedUrl(storagePath, 900); // 15 min
        if (error) throw error;
        return data.signedUrl;
    } catch (err) {
        console.warn('[UNDR Chat] getPPVSignedUrl error:', err.message);
        return storagePath;
    }
}

/**
 * Unlock a PPV message after payment is confirmed.
 */
export async function unlockPPVMessage(messageId) {
    if (!isSupabaseConfigured() || !supabase) {
        // localStorage fallback handled in app.js
        return { isLocal: true };
    }

    try {
        const { data, error } = await supabase
            .from('messages')
            .update({ is_unlocked: true })
            .eq('id', messageId)
            .select('*')
            .single();

        if (error) throw error;
        return { data, isLocal: false };
    } catch (err) {
        console.warn('[UNDR Chat] unlockPPVMessage error:', err.message);
        return { isLocal: true };
    }
}

// ─── Read Receipts ────────────────────────────────────────────────────────────

/**
 * Mark all messages in a conversation as read by a user.
 * Uses a read_by JSONB array column on messages.
 */
export async function markMessagesAsRead(conversationId, userId) {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
        // Get unread messages not sent by this user
        const { data: unread } = await supabase
            .from('messages')
            .select('id, read_by')
            .eq('conversation_id', conversationId)
            .neq('sender_id', userId);

        if (!unread || unread.length === 0) return;

        // Update each message to add userId to read_by array
        const updates = unread
            .filter(msg => !msg.read_by?.includes(userId))
            .map(msg => ({
                id: msg.id,
                read_by: [...(msg.read_by || []), userId],
            }));

        if (updates.length === 0) return;

        for (const update of updates) {
            await supabase
                .from('messages')
                .update({ read_by: update.read_by })
                .eq('id', update.id);
        }

        // Broadcast read event via channel
        if (activeChannel) {
            activeChannel.send({
                type: 'broadcast',
                event: 'message_read',
                payload: { userId, conversationId },
            });
        }
    } catch (err) {
        console.warn('[UNDR Chat] markMessagesAsRead error:', err.message);
    }
}

// ─── Typing Indicators ────────────────────────────────────────────────────────

/**
 * Broadcast typing status to the conversation channel.
 * Automatically stops after TYPING_DEBOUNCE_MS of inactivity.
 */
export function broadcastTyping(conversationId, userId) {
    if (!activeChannel || !isTyping) {
        isTyping = true;
        if (activeChannel) {
            activeChannel.send({
                type: 'broadcast',
                event: 'typing',
                payload: { userId, isTyping: true },
            });
        }
    }

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        isTyping = false;
        if (activeChannel) {
            activeChannel.send({
                type: 'broadcast',
                event: 'typing',
                payload: { userId, isTyping: false },
            });
        }
    }, TYPING_DEBOUNCE_MS);
}

// ─── Realtime Subscription ────────────────────────────────────────────────────

/**
 * Subscribe to real-time events for a conversation.
 * @param {string} conversationId - UUID of the conversation
 * @param {string} currentUserId - UUID of the logged-in user
 * @param {object} cbs - Callback functions { onMessage, onTyping, onPresence, onRead }
 */
export async function subscribeToConversation(conversationId, currentUserId, cbs = {}) {
    if (!isSupabaseConfigured() || !supabase) {
        console.warn('[UNDR Chat] Supabase not available — using localStorage mode');
        return null;
    }

    // Store callbacks
    Object.assign(callbacks, cbs);
    activeConversationId = conversationId;

    // Unsubscribe from previous channel if any
    await unsubscribeFromConversation();

    const channelName = `chat:${conversationId}`;

    // Create channel with Postgres changes + Broadcast + Presence
    activeChannel = supabase.channel(channelName, {
        config: {
            broadcast: { self: false },
            presence: { key: currentUserId },
        },
    });

    // 1. Listen for new messages in the DB (Postgres Changes)
    activeChannel.on(
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
            const msg = payload.new;
            // Get signed URL for PPV images
            if (msg.is_ppv && msg.ppv_media_url && !msg.is_unlocked) {
                msg._blurred_url = await getPPVSignedUrl(msg.ppv_media_url);
            } else if (msg.is_ppv && msg.ppv_media_url && msg.is_unlocked) {
                msg._signed_url = await getPPVSignedUrl(msg.ppv_media_url);
            }
            if (callbacks.onMessage) callbacks.onMessage(msg);
        }
    );

    // 2. Listen for message updates (e.g., PPV unlocked, read receipts)
    activeChannel.on(
        'postgres_changes',
        {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
            const msg = payload.new;
            if (msg.is_ppv && msg.is_unlocked && msg.ppv_media_url) {
                msg._signed_url = await getPPVSignedUrl(msg.ppv_media_url);
            }
            if (callbacks.onMessage) callbacks.onMessage(msg, 'update');
        }
    );

    // 3. Typing indicators (Broadcast)
    activeChannel.on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== currentUserId && callbacks.onTyping) {
            callbacks.onTyping(payload.userId, payload.isTyping);
        }
    });

    // 4. Read receipts (Broadcast)
    activeChannel.on('broadcast', { event: 'message_read' }, ({ payload }) => {
        if (payload.userId !== currentUserId && callbacks.onRead) {
            callbacks.onRead(payload.userId, payload.conversationId);
        }
    });

    // 5. Presence (online/offline)
    activeChannel.on('presence', { event: 'sync' }, () => {
        const state = activeChannel.presenceState();
        const onlineUsers = Object.keys(state);
        if (callbacks.onPresence) callbacks.onPresence(onlineUsers);
    });

    activeChannel.on('presence', { event: 'join' }, ({ key }) => {
        if (callbacks.onPresence) {
            const state = activeChannel.presenceState();
            callbacks.onPresence(Object.keys(state));
        }
    });

    activeChannel.on('presence', { event: 'leave' }, ({ key }) => {
        if (callbacks.onPresence) {
            const state = activeChannel.presenceState();
            callbacks.onPresence(Object.keys(state));
        }
    });

    // Subscribe and track presence
    await activeChannel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
            await activeChannel.track({
                userId: currentUserId,
                online_at: new Date().toISOString(),
            });
        }
    });

    return activeChannel;
}

/**
 * Unsubscribe from the current conversation channel.
 */
export async function unsubscribeFromConversation() {
    if (activeChannel && supabase) {
        try {
            await supabase.removeChannel(activeChannel);
        } catch (e) {}
        activeChannel = null;
    }
    activeConversationId = null;
    isTyping = false;
    clearTimeout(typingTimeout);
}

// ─── localStorage Fallback ────────────────────────────────────────────────────

function saveMessageLocal(conversationId, payload) {
    const chats = JSON.parse(localStorage.getItem('undr_chats') || '[]');
    const msgId = `local_${Date.now()}`;
    const msg = {
        id: msgId,
        conversation_id: conversationId,
        ...payload,
        created_at: new Date().toISOString(),
    };

    // Find or create chat conversation
    let chat = chats.find(c => c.id === conversationId || c.creatorName === conversationId.replace('local_', ''));
    if (chat) {
        chat.messages = chat.messages || [];
        chat.messages.push(msg);
    } else {
        chats.push({ id: conversationId, messages: [msg] });
    }

    localStorage.setItem('undr_chats', JSON.stringify(chats));
    return { data: msg, isLocal: true };
}

// ─── Notifications ────────────────────────────────────────────────────────────

/**
 * Create a notification in Supabase for a new message.
 */
export async function createMessageNotification(recipientId, senderName, preview, conversationId) {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
        await supabase.from('notifications').insert({
            user_id: recipientId,
            text: `💬 New message from ${senderName}: "${preview.slice(0, 60)}"`,
            type: 'chat',
            reference_id: conversationId,
            is_read: false,
        });
    } catch (err) {
        console.warn('[UNDR Chat] createMessageNotification error:', err.message);
    }
}

// ─── Expose globally for legacy app.js ────────────────────────────────────────
window.undrChat = {
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
    moderateMessage,
};

console.log('%c💬 UNDR Realtime Chat Engine loaded', 'color: #9b59b6; font-weight: bold; font-size: 13px;');
