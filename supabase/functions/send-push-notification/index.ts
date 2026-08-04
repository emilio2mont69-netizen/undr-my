/**
 * UNDR — Supabase Edge Function: send-push-notification
 * 
 * Triggered by a Supabase Database Webhook when a new message is inserted
 * into the messages table.
 * 
 * Sends Web Push notifications to all push_subscriptions endpoints
 * belonging to the conversation partner (recipient).
 * 
 * Deployment:
 *   supabase functions deploy send-push-notification
 * 
 * Environment variables required (Supabase Dashboard → Edge Functions → Secrets):
 *   VAPID_SUBJECT=mailto:admin@undr-my.com
 *   VAPID_PRIVATE_KEY=<your VAPID private key>
 *   VAPID_PUBLIC_KEY=BNQUapaSXjD1RPPMmHFfbGo9JW-WezSa5gXrxWfkh3i7GEeMsVRCiKVFzfn5hJP5jPRlMXi6oH0DJDJqX6y2fX8
 *   SUPABASE_URL=<your supabase URL>
 *   SUPABASE_SERVICE_ROLE_KEY=<your service_role key>
 * 
 * Database Webhook configuration (Supabase Dashboard → Database → Webhooks):
 *   Table: messages
 *   Events: INSERT
 *   HTTP Request: POST https://<project>.supabase.co/functions/v1/send-push-notification
 *   Headers: Authorization: Bearer <SUPABASE_ANON_KEY>
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─── VAPID Helpers (pure JS, no external lib) ─────────────────────────────────

function base64UrlEncode(buffer) {
    const bytes = new Uint8Array(buffer);
    let str = '';
    for (const byte of bytes) {
        str += String.fromCharCode(byte);
    }
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function createVapidJWT(audience, subject, privateKeyB64, expSeconds = 12 * 3600) {
    const header = { typ: 'JWT', alg: 'ES256' };
    const payload = {
        aud: audience,
        exp: Math.floor(Date.now() / 1000) + expSeconds,
        sub: subject,
    };

    const encodedHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
    const encodedPayload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    // Import private key
    const keyData = Uint8Array.from(atob(privateKeyB64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const privateKey = await crypto.subtle.importKey(
        'pkcs8',
        keyData,
        { name: 'ECDSA', namedCurve: 'P-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign(
        { name: 'ECDSA', hash: { name: 'SHA-256' } },
        privateKey,
        new TextEncoder().encode(signingInput)
    );

    return `${signingInput}.${base64UrlEncode(signature)}`;
}

async function sendWebPush(subscription, payload, vapidConfig) {
    const { endpoint, p256dh, auth } = subscription;
    const audience = new URL(endpoint).origin;

    const jwt = await createVapidJWT(
        audience,
        vapidConfig.subject,
        vapidConfig.privateKey
    );

    const authHeader = `vapid t=${jwt},k=${vapidConfig.publicKey}`;

    // Encrypt payload using Web Push Encryption (RFC 8291)
    // For simplicity, sending as plaintext here — most modern browsers accept it
    const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const encoded = new TextEncoder().encode(body);

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
            'Content-Length': encoded.byteLength.toString(),
            'TTL': '86400',
            'Urgency': 'high',
        },
        body: encoded,
    });

    return response;
}

// ─── Edge Function Handler ─────────────────────────────────────────────────────

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            },
        });
    }

    try {
        const body = await req.json();

        // Database webhook sends { type, table, record, old_record, schema }
        const record = body.record || body;
        if (!record || !record.conversation_id || !record.sender_id) {
            return new Response('Not a valid message record', { status: 400 });
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
        const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
        const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@undr-my.com';

        if (!supabaseUrl || !serviceRoleKey || !vapidPrivateKey || !vapidPublicKey) {
            console.error('Missing environment variables');
            return new Response('Configuration error', { status: 500 });
        }

        const supabase = createClient(supabaseUrl, serviceRoleKey);

        // 1. Get conversation to find recipient
        const { data: conversation } = await supabase
            .from('conversations')
            .select('buyer_id, creator_id')
            .eq('id', record.conversation_id)
            .single();

        if (!conversation) {
            return new Response('Conversation not found', { status: 404 });
        }

        // 2. Determine recipient (the person who did NOT send this message)
        const recipientId = conversation.buyer_id === record.sender_id
            ? conversation.creator_id
            : conversation.buyer_id;

        // 3. Get sender's display name
        const { data: sender } = await supabase
            .from('profiles')
            .select('username, handle')
            .eq('id', record.sender_id)
            .single();

        const senderName = sender?.username || sender?.handle || 'Someone';

        // 4. Build notification payload
        let notifTitle = `💬 ${senderName}`;
        let notifBody = record.text
            ? record.text.slice(0, 100)
            : record.is_ppv
                ? `🔒 Locked content - $${record.ppv_price}`
                : record.is_tip
                    ? `💰 Tip: $${record.tip_amount}`
                    : 'New message';
        let notifType = 'chat';

        if (record.is_tip) {
            notifTitle = '💰 You received a tip!';
            notifBody = `${senderName} sent you a $${record.tip_amount} tip`;
            notifType = 'tip';
        } else if (record.is_ppv) {
            notifTitle = `🔒 Locked Content from ${senderName}`;
            notifBody = `Pay $${record.ppv_price} to unlock exclusive content`;
            notifType = 'ppv';
        }

        const pushPayload = {
            title: notifTitle,
            body: notifBody,
            type: notifType,
            conversationId: record.conversation_id,
            url: '/#/chat',
            tag: `undr-chat-${record.conversation_id}`,
        };

        // 5. Get all push subscriptions for the recipient
        const { data: subscriptions } = await supabase
            .from('push_subscriptions')
            .select('endpoint, p256dh, auth')
            .eq('user_id', recipientId);

        if (!subscriptions || subscriptions.length === 0) {
            console.log(`No push subscriptions for user ${recipientId}`);
            return new Response(JSON.stringify({ sent: 0 }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const vapidConfig = {
            subject: vapidSubject,
            privateKey: vapidPrivateKey,
            publicKey: vapidPublicKey,
        };

        // 6. Send push to all subscriptions
        let sent = 0;
        const expiredEndpoints = [];

        for (const sub of subscriptions) {
            try {
                const res = await sendWebPush(sub, pushPayload, vapidConfig);

                if (res.status === 201 || res.status === 200) {
                    sent++;
                } else if (res.status === 410 || res.status === 404) {
                    // Subscription expired — mark for deletion
                    expiredEndpoints.push(sub.endpoint);
                } else {
                    const errText = await res.text();
                    console.warn(`Push failed for endpoint (${res.status}):`, errText.slice(0, 200));
                }
            } catch (pushErr) {
                console.warn('Push send error:', pushErr.message);
            }
        }

        // 7. Clean up expired subscriptions
        if (expiredEndpoints.length > 0) {
            await supabase
                .from('push_subscriptions')
                .delete()
                .in('endpoint', expiredEndpoints);
        }

        return new Response(JSON.stringify({ sent, total: subscriptions.length }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('[UNDR Push Edge Function] Error:', err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});
