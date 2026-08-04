/**
 * UNDR Service Worker — Push Notifications + Offline Cache
 * 
 * Handles:
 * 1. Web Push API: shows browser notifications when new messages arrive
 *    (even if the tab is closed or in background)
 * 2. Notification click: focuses/opens the tab and navigates to chat
 * 3. Offline fallback cache for core assets
 * 
 * Registration: js/push-notifications.js calls navigator.serviceWorker.register('/sw.js')
 */

const CACHE_NAME = 'undr-v5-cache-purge';
const OFFLINE_ASSETS = [
    '/',
    '/index.html',
    '/logofase.PNG',
];

// ─── Install: Skip waiting immediately ─────────────────────────────────────────
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// ─── Activate: Purge ALL old caches immediately ────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// ─── Fetch: Network-first, never return HTML for CSS/JS assets ───────────────
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;
    if (event.request.url.includes('supabase.co')) return;

    const url = new URL(event.request.url);
    const isStaticAsset = url.pathname.endsWith('.css') || 
                          url.pathname.endsWith('.js') || 
                          url.pathname.endsWith('.png') || 
                          url.pathname.endsWith('.jpg') || 
                          url.pathname.endsWith('.svg') ||
                          url.pathname.includes('/assets/');

    if (isStaticAsset) {
        // Direct network fetch for static assets - NEVER fallback to /index.html HTML
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    // For HTML navigation requests, network first with /index.html fallback
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/index.html'))
        );
    }
});

// ─── Push: Receive push notification from server ─────────────────────────────
self.addEventListener('push', (event) => {
    if (!event.data) return;

    let payload;
    try {
        payload = event.data.json();
    } catch {
        payload = {
            title: 'UNDR',
            body: event.data.text(),
            type: 'chat',
        };
    }

    const title = payload.title || '💬 UNDR — New Message';
    const options = {
        body: payload.body || 'You have a new message',
        icon: '/logofase.PNG',
        badge: '/logofase.PNG',
        tag: payload.tag || `undr-${payload.type || 'msg'}-${Date.now()}`,
        data: {
            url: payload.url || '/#/chat',
            conversationId: payload.conversationId,
            type: payload.type,
        },
        requireInteraction: false,
        silent: false,
        vibrate: [100, 50, 100],
        actions: [
            { action: 'open', title: '💬 Open Chat' },
            { action: 'dismiss', title: 'Dismiss' },
        ],
    };

    // Customize by notification type
    if (payload.type === 'tip') {
        options.tag = `undr-tip-${Date.now()}`;
        options.body = payload.body || '💰 You received a tip!';
        options.requireInteraction = true;
    } else if (payload.type === 'ppv_unlocked') {
        options.tag = `undr-ppv-${Date.now()}`;
        options.body = payload.body || '🔓 A buyer unlocked your PPV content!';
        options.requireInteraction = true;
    } else if (payload.type === 'subscription') {
        options.tag = `undr-sub-${Date.now()}`;
        options.body = payload.body || '⭐ You have a new subscriber!';
    }

    event.waitUntil(self.registration.showNotification(title, options));
});

// ─── Notification Click: Open or focus the app ────────────────────────────────
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const action = event.action;
    const notifData = event.notification.data || {};
    const targetUrl = notifData.url || '/';

    if (action === 'dismiss') return;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Find an existing UNDR tab
            const undrClient = clientList.find((c) =>
                c.url.includes(self.location.origin) && 'focus' in c
            );

            if (undrClient) {
                // Focus existing tab and send navigation command
                undrClient.focus();
                undrClient.postMessage({
                    type: 'NAVIGATE_CHAT',
                    conversationId: notifData.conversationId,
                });
                return;
            }

            // Open new tab
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

// ─── Message from client: subscribe to notifications ─────────────────────────
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[UNDR SW] Service Worker loaded v1');
