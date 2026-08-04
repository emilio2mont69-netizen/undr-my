/**
 * @fileoverview UNDR Push Notifications Module
 * 
 * Manages:
 * 1. Service Worker registration (sw.js)
 * 2. Web Push subscription (VAPID protocol)
 * 3. Storing push subscription endpoint in Supabase
 * 4. Requesting notification permission from user
 * 5. In-app notification via SW message when chat tab is open
 * 
 * Flow:
 *   User logs in → requestPushPermission() → subscribeWebPush() →
 *   save subscription to Supabase push_subscriptions table →
 *   Supabase Edge Function (trigger on messages INSERT) sends push →
 *   sw.js receives push → shows notification →
 *   User clicks → navigates to chat
 */

import { supabase, isSupabaseConfigured } from './supabase-config.js';

// ─── VAPID Public Key ─────────────────────────────────────────────────────────
// This is the public key from the VAPID pair.
// The private key is stored ONLY in Supabase Edge Function secrets.
// To generate a new pair: https://vapidkeys.com/ or run:
//   npx web-push generate-vapid-keys
// Then set VAPID_PRIVATE_KEY as a Supabase Edge Function secret.
// Replace this with your actual public key after generating:
const VAPID_PUBLIC_KEY = 'BNQUapaSXjD1RPPMmHFfbGo9JW-WezSa5gXrxWfkh3i7GEeMsVRCiKVFzfn5hJP5jPRlMXi6oH0DJDJqX6y2fX8';

// ─── State ─────────────────────────────────────────────────────────────────────
let swRegistration = null;
let pushSubscription = null;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function isPushSupported() {
    return (
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window
    );
}

// ─── Service Worker Registration ─────────────────────────────────────────────

/**
 * Register the UNDR Service Worker.
 * Must be called from a top-level page context (not from a module loaded via importmap).
 */
export async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.warn('[UNDR Push] Service Workers not supported in this browser.');
        return null;
    }

    try {
        swRegistration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
        });

        console.log('%c✅ UNDR Service Worker registered', 'color: #10b981; font-weight: bold;');

        // Listen for messages from SW (e.g., navigate to chat)
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data?.type === 'NAVIGATE_CHAT') {
                const convId = event.data.conversationId;
                // Navigate to chat section
                if (window.showSection) window.showSection('chat');
                if (convId && window.initRealtimeChatFor) {
                    // The bridge will handle loading the right conversation
                }
            }
        });

        return swRegistration;
    } catch (err) {
        console.warn('[UNDR Push] Service Worker registration failed:', err.message);
        return null;
    }
}

// ─── Push Permission ─────────────────────────────────────────────────────────

/**
 * Request notification permission from the user.
 * Returns 'granted', 'denied', or 'default'.
 */
export async function requestNotificationPermission() {
    if (!('Notification' in window)) return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';

    const permission = await Notification.requestPermission();
    return permission;
}

// ─── Web Push Subscription ────────────────────────────────────────────────────

/**
 * Subscribe to Web Push notifications.
 * Saves the subscription to Supabase for server-side push delivery.
 * 
 * @param {string} userId - Supabase user ID
 */
export async function subscribeWebPush(userId) {
    if (!isPushSupported()) {
        console.warn('[UNDR Push] Push not supported.');
        return null;
    }

    if (!swRegistration) {
        swRegistration = await registerServiceWorker();
        if (!swRegistration) return null;
    }

    // Check/request permission
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
        console.warn('[UNDR Push] Notification permission denied.');
        return null;
    }

    try {
        // Check if already subscribed
        let subscription = await swRegistration.pushManager.getSubscription();

        if (!subscription) {
            // Subscribe
            subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
        }

        pushSubscription = subscription;

        // Save to Supabase
        if (isSupabaseConfigured() && supabase && userId) {
            await savePushSubscriptionToSupabase(userId, subscription);
        }

        console.log('%c🔔 UNDR Push: Subscribed to Web Push', 'color: #10b981; font-weight: bold;');
        return subscription;
    } catch (err) {
        console.warn('[UNDR Push] Push subscription failed:', err.message);
        return null;
    }
}

/**
 * Save push subscription endpoint to Supabase so Edge Function can send pushes.
 */
async function savePushSubscriptionToSupabase(userId, subscription) {
    if (!isSupabaseConfigured() || !supabase) return;

    try {
        const subscriptionJSON = subscription.toJSON();

        await supabase
            .from('push_subscriptions')
            .upsert({
                user_id: userId,
                endpoint: subscriptionJSON.endpoint,
                p256dh: subscriptionJSON.keys?.p256dh,
                auth: subscriptionJSON.keys?.auth,
                user_agent: navigator.userAgent.slice(0, 200),
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id,endpoint' });

        console.log('[UNDR Push] Subscription saved to Supabase.');
    } catch (err) {
        console.warn('[UNDR Push] Could not save subscription:', err.message);
    }
}

/**
 * Unsubscribe from Web Push (when user logs out).
 */
export async function unsubscribeWebPush(userId) {
    if (!pushSubscription) return;

    try {
        await pushSubscription.unsubscribe();
        pushSubscription = null;

        if (isSupabaseConfigured() && supabase && userId) {
            await supabase
                .from('push_subscriptions')
                .delete()
                .eq('user_id', userId);
        }

        console.log('[UNDR Push] Unsubscribed from Web Push.');
    } catch (err) {
        console.warn('[UNDR Push] Unsubscribe failed:', err.message);
    }
}

// ─── In-App Browser Notification ─────────────────────────────────────────────

/**
 * Show a browser notification from within the app (when tab is in foreground
 * or background but service worker is active).
 * Falls back to the in-app toast when Notification API is unavailable.
 * 
 * @param {string} title - Notification title
 * @param {object} options - Notification options
 */
export function showBrowserNotification(title, options = {}) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        // Fallback: use in-app toast
        if (window.showToast) window.showToast(`${title}: ${options.body || ''}`);
        return;
    }

    try {
        const notification = new Notification(title, {
            body: options.body || '',
            icon: '/logofase.PNG',
            badge: '/logofase.PNG',
            tag: options.tag || 'undr-notif',
            silent: options.silent || false,
            ...options,
        });

        notification.onclick = () => {
            window.focus();
            if (options.onClick) options.onClick();
            notification.close();
        };

        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);
    } catch (err) {
        // Fallback to toast
        if (window.showToast) window.showToast(`${title}: ${options.body || ''}`);
    }
}

// ─── Soft Prompt UI ──────────────────────────────────────────────────────────

/**
 * Show a non-blocking "Enable Notifications?" prompt banner.
 * Respects user choice — doesn't ask again if denied.
 */
export function showNotificationPrompt(userId) {
    // Don't show if already granted or denied
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return;
    if (localStorage.getItem('undr_push_dismissed') === 'true') return;
    if (!isPushSupported()) return;

    const banner = document.createElement('div');
    banner.id = 'push-notif-banner';
    banner.style.cssText = `
        position: fixed;
        bottom: 90px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 99999;
        background: var(--secondary-bg, #1a1a2e);
        border: 1px solid var(--accent-color, #9b59b6);
        border-radius: 16px;
        padding: 14px 20px;
        display: flex;
        align-items: center;
        gap: 14px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        max-width: 380px;
        width: calc(100vw - 32px);
        animation: slideUpFade 0.4s ease;
    `;
    banner.innerHTML = `
        <i class="fa-solid fa-bell" style="color: var(--accent-color, #9b59b6); font-size: 1.3rem; flex-shrink:0;"></i>
        <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 700; font-size: 0.88rem; margin-bottom: 2px;">
                Enable Notifications
            </div>
            <div style="font-size: 0.76rem; color: var(--text-muted, #aaa);">
                Get notified when you receive a message or tip
            </div>
        </div>
        <div style="display: flex; gap: 8px; flex-shrink: 0;">
            <button id="push-enable-btn" style="
                background: var(--accent-color, #9b59b6);
                color: #fff;
                border: none;
                border-radius: 8px;
                padding: 7px 14px;
                font-size: 0.78rem;
                font-weight: 700;
                cursor: pointer;
                font-family: inherit;
            ">Enable</button>
            <button id="push-dismiss-btn" style="
                background: transparent;
                color: var(--text-muted, #aaa);
                border: 1px solid var(--border-color, #333);
                border-radius: 8px;
                padding: 7px 10px;
                font-size: 0.78rem;
                cursor: pointer;
                font-family: inherit;
            ">✕</button>
        </div>
    `;

    document.body.appendChild(banner);

    const enableBtn = document.getElementById('push-enable-btn');
    if (enableBtn) {
        enableBtn.addEventListener('click', async () => {
            banner.remove();
            await subscribeWebPush(userId);
        });
    }

    const dismissBtn = document.getElementById('push-dismiss-btn');
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            localStorage.setItem('undr_push_dismissed', 'true');
            banner.remove();
        });
    }

    // Auto-remove after 12 seconds
    setTimeout(() => {
        if (banner.parentNode) banner.remove();
    }, 12000);
}

// ─── Initialization ──────────────────────────────────────────────────────────

/**
 * Initialize push notifications system.
 * Call once after user is authenticated.
 */
export async function initPushNotifications(userId) {
    // Register SW on page load regardless of auth
    if (!swRegistration) {
        await registerServiceWorker();
    }

    if (!userId) return;

    // If already granted, subscribe silently
    if (Notification.permission === 'granted') {
        await subscribeWebPush(userId);
    } else {
        // Show soft prompt after 3 seconds
        setTimeout(() => showNotificationPrompt(userId), 3000);
    }
}

// ─── Expose globally ──────────────────────────────────────────────────────────

window.undrPush = {
    registerServiceWorker,
    requestNotificationPermission,
    subscribeWebPush,
    unsubscribeWebPush,
    showBrowserNotification,
    showNotificationPrompt,
    initPushNotifications,
    isPushSupported,
};

// Auto-register SW immediately (doesn't require auth)
registerServiceWorker();

console.log('%c🔔 UNDR Push Notifications module loaded', 'color: #9b59b6; font-weight: bold; font-size: 13px;');
