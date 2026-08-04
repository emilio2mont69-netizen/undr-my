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

const CACHE_NAME = 'undr-v3';
const OFFLINE_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/js/storage.js',
    '/js/kyc-engine.js',
    '/js/auctions-realtime.js',
    '/js/shipping-engine.js',
    '/js/notifications-engine.js',
    '/js/search-engine.js',
    '/js/admin-analytics.js',
    '/js/legal-compliance.js',
    '/js/bridge.js',
    '/js/chat-bridge.js',
    '/js/push-notifications.js',
    '/logofase.PNG',
];

// ─── Install: Cache Core Assets ───────────────────────────────────────────────
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(OFFLINE_ASSETS).catch((err) => {
                console.warn('[UNDR SW] Cache install partial failure:', err);
            });
        })
    );
});

// ─── Activate: Clean old caches ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Take control immediately
});

// ─── Fetch: Serve from cache with network fallback ───────────────────────────
self.addEventListener('fetch', (event) => {
    // Only handle GET requests for same-origin
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;
    // Don't cache Supabase API calls
    if (event.request.url.includes('supabase.co')) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request).catch(() => caches.match('/index.html'));
        })
    );
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
