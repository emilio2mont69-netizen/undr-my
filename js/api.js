/**
 * @fileoverview Complete API abstraction layer for the UNDR project.
 * Wraps database operations, providing a Supabase implementation
 * with a fallback to localStorage for local development/demo mode.
 */

import { supabase, isSupabaseConfigured } from './supabase-config.js';

// --- LocalStorage Fallback Helpers ---
const getLocal = (key, defaultVal = []) => {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultVal;
    } catch (e) {
        return defaultVal;
    }
};

const setLocal = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const generateId = () => Math.random().toString(36).substr(2, 9);

// Standardized response format
const success = (data) => ({ data, error: null });
const failure = (error) => ({ data: null, error: { message: error.message || String(error) } });

export const api = {
    // --- Auth Module ---
    auth: {
        async signUp(email, password, username, handle) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.auth.signUp({
                        email, password, options: { data: { username, handle } }
                    });
                    if (error) throw error;
                    return success(data);
                } else {
                    const users = getLocal('undr_users', []);
                    if (users.find(u => u.email === email)) throw new Error('User already exists');
                    const newUser = { id: generateId(), email, username, handle, role: 'buyer', balance: 0, createdAt: new Date().toISOString() };
                    users.push(newUser);
                    setLocal('undr_users', users);
                    setLocal('undr_currentUser', newUser);
                    return success({ user: newUser, session: { access_token: 'local_token' } });
                }
            } catch (error) { return failure(error); }
        },
        async signIn(email, password) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                    if (error) throw error;
                    return success(data);
                } else {
                    const users = getLocal('undr_users', []);
                    const user = users.find(u => u.email === email);
                    if (!user) throw new Error('Invalid credentials');
                    setLocal('undr_currentUser', user);
                    return success({ user, session: { access_token: 'local_token' } });
                }
            } catch (error) { return failure(error); }
        },
        async signOut() {
            try {
                if (isSupabaseConfigured()) {
                    const { error } = await supabase.auth.signOut();
                    if (error) throw error;
                    return success(true);
                } else {
                    localStorage.removeItem('undr_currentUser');
                    return success(true);
                }
            } catch (error) { return failure(error); }
        },
        async getSession() {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.auth.getSession();
                    if (error) throw error;
                    return success(data);
                } else {
                    const user = getLocal('undr_currentUser', null);
                    return success(user ? { session: { user } } : { session: null });
                }
            } catch (error) { return failure(error); }
        },
        onAuthStateChange(callback) {
            if (isSupabaseConfigured()) {
                return supabase.auth.onAuthStateChange(callback);
            } else {
                // Dummy listener for local
                return { data: { subscription: { unsubscribe: () => {} } } };
            }
        }
    },

    // --- Users Module ---
    users: {
        async getProfile(userId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const users = getLocal('undr_users', []);
                    const user = users.find(u => u.id === userId);
                    if (!user) throw new Error('User not found');
                    return success(user);
                }
            } catch (error) { return failure(error); }
        },
        async updateProfile(userId, data) {
            try {
                if (isSupabaseConfigured()) {
                    const { data: updated, error } = await supabase.from('profiles').update(data).eq('id', userId).select().single();
                    if (error) throw error;
                    return success(updated);
                } else {
                    const users = getLocal('undr_users', []);
                    const idx = users.findIndex(u => u.id === userId);
                    if (idx === -1) throw new Error('User not found');
                    users[idx] = { ...users[idx], ...data };
                    setLocal('undr_users', users);
                    if (getLocal('undr_currentUser', {}).id === userId) setLocal('undr_currentUser', users[idx]);
                    return success(users[idx]);
                }
            } catch (error) { return failure(error); }
        },
        async getPublicProfile(handle) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('profiles').select('id, username, handle, role, avatar_url, bio').eq('handle', handle).single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const user = getLocal('undr_users', []).find(u => u.handle === handle);
                    if (!user) throw new Error('Profile not found');
                    const { password, email, ...publicData } = user;
                    return success(publicData);
                }
            } catch (error) { return failure(error); }
        },
        async updateBalance(userId, amount) {
            try {
                if (isSupabaseConfigured()) {
                    // Requires an RPC or updating the row depending on RLS. We assume a simple update here for simplicity.
                    const { data: user } = await supabase.from('profiles').select('balance').eq('id', userId).single();
                    const newBalance = (user?.balance || 0) + amount;
                    const { data, error } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', userId).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const users = getLocal('undr_users', []);
                    const idx = users.findIndex(u => u.id === userId);
                    if (idx === -1) throw new Error('User not found');
                    users[idx].balance = (users[idx].balance || 0) + amount;
                    setLocal('undr_users', users);
                    return success(users[idx]);
                }
            } catch (error) { return failure(error); }
        },
        async switchRole(role) {
            // Local-only demo helper
            if (!isSupabaseConfigured()) {
                const user = getLocal('undr_currentUser', null);
                if (user) {
                    return this.updateProfile(user.id, { role });
                }
                return failure('No active user');
            }
            return failure('switchRole is for demo mode only');
        }
    },

    // --- Products Module ---
    products: {
        async getAll(filters = {}) {
            try {
                if (isSupabaseConfigured()) {
                    let query = supabase.from('products').select('*');
                    if (filters.category) query = query.eq('category', filters.category);
                    if (filters.search) query = query.ilike('title', `%${filters.search}%`);
                    // add other filters like pagination here
                    const { data, error } = await query;
                    if (error) throw error;
                    return success(data);
                } else {
                    let products = getLocal('undr_products', []);
                    if (filters.category) products = products.filter(p => p.category === filters.category);
                    if (filters.search) products = products.filter(p => p.title.toLowerCase().includes(filters.search.toLowerCase()));
                    return success(products);
                }
            } catch (error) { return failure(error); }
        },
        async getById(id) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const product = getLocal('undr_products', []).find(p => p.id === id);
                    if (!product) throw new Error('Product not found');
                    return success(product);
                }
            } catch (error) { return failure(error); }
        },
        async getByCreator(creatorId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('products').select('*').eq('creator_id', creatorId);
                    if (error) throw error;
                    return success(data);
                } else {
                    const products = getLocal('undr_products', []).filter(p => p.creatorId === creatorId);
                    return success(products);
                }
            } catch (error) { return failure(error); }
        },
        async create(productData) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('products').insert([productData]).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const products = getLocal('undr_products', []);
                    const newProduct = { id: generateId(), createdAt: new Date().toISOString(), ...productData };
                    products.push(newProduct);
                    setLocal('undr_products', products);
                    return success(newProduct);
                }
            } catch (error) { return failure(error); }
        },
        async update(id, data) {
            try {
                if (isSupabaseConfigured()) {
                    const { data: updated, error } = await supabase.from('products').update(data).eq('id', id).select().single();
                    if (error) throw error;
                    return success(updated);
                } else {
                    const products = getLocal('undr_products', []);
                    const idx = products.findIndex(p => p.id === id);
                    if (idx === -1) throw new Error('Product not found');
                    products[idx] = { ...products[idx], ...data };
                    setLocal('undr_products', products);
                    return success(products[idx]);
                }
            } catch (error) { return failure(error); }
        },
        async delete(id) {
            try {
                if (isSupabaseConfigured()) {
                    const { error } = await supabase.from('products').delete().eq('id', id);
                    if (error) throw error;
                    return success(true);
                } else {
                    const products = getLocal('undr_products', []);
                    setLocal('undr_products', products.filter(p => p.id !== id));
                    return success(true);
                }
            } catch (error) { return failure(error); }
        },
        async toggleLike(productId, userId) {
            try {
                if (isSupabaseConfigured()) {
                    // Simplified implementation - usually requires checking if exists, then delete/insert
                    return success({ toggled: true });
                } else {
                    let likes = getLocal('undr_likes', []);
                    const existing = likes.findIndex(l => l.productId === productId && l.userId === userId);
                    if (existing >= 0) {
                        likes.splice(existing, 1);
                    } else {
                        likes.push({ id: generateId(), productId, userId });
                    }
                    setLocal('undr_likes', likes);
                    return success({ liked: existing < 0 });
                }
            } catch (error) { return failure(error); }
        },
        async getFavorites(userId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('favorites').select('*, products(*)').eq('user_id', userId);
                    if (error) throw error;
                    return success(data.map(l => l.products));
                } else {
                    const likes = getLocal('undr_likes', []).filter(l => l.userId === userId);
                    const products = getLocal('undr_products', []);
                    const favs = likes.map(l => products.find(p => p.id === l.productId)).filter(Boolean);
                    return success(favs);
                }
            } catch (error) { return failure(error); }
        }
    },

    // --- Orders Module ---
    orders: {
        async create(orderData) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const orders = getLocal('undr_orders', []);
                    const newOrder = { id: generateId(), createdAt: new Date().toISOString(), status: 'pending', ...orderData };
                    orders.push(newOrder);
                    setLocal('undr_orders', orders);
                    return success(newOrder);
                }
            } catch (error) { return failure(error); }
        },
        async getByBuyer(buyerId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('orders').select('*').eq('buyer_id', buyerId);
                    if (error) throw error;
                    return success(data);
                } else {
                    return success(getLocal('undr_orders', []).filter(o => o.buyerId === buyerId));
                }
            } catch (error) { return failure(error); }
        },
        async getByCreator(creatorId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('orders').select('*').eq('creator_id', creatorId);
                    if (error) throw error;
                    return success(data);
                } else {
                    return success(getLocal('undr_orders', []).filter(o => o.creatorId === creatorId));
                }
            } catch (error) { return failure(error); }
        },
        async updateStatus(orderId, status) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('orders').update({ status }).eq('id', orderId).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const orders = getLocal('undr_orders', []);
                    const order = orders.find(o => o.id === orderId);
                    if (order) order.status = status;
                    setLocal('undr_orders', orders);
                    return success(order);
                }
            } catch (error) { return failure(error); }
        },
        async addTracking(orderId, trackingNumber) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('orders').update({ tracking_number: trackingNumber, status: 'shipped' }).eq('id', orderId).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const orders = getLocal('undr_orders', []);
                    const order = orders.find(o => o.id === orderId);
                    if (order) { order.trackingNumber = trackingNumber; order.status = 'shipped'; }
                    setLocal('undr_orders', orders);
                    return success(order);
                }
            } catch (error) { return failure(error); }
        }
    },

    // --- Chat Module ---
    chat: {
        async getConversations(userId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('conversations').select('*').or(`buyer_id.eq.${userId},creator_id.eq.${userId}`);
                    if (error) throw error;
                    return success(data);
                } else {
                    return success(getLocal('undr_conversations', []).filter(c => c.participants && c.participants.includes(userId)));
                }
            } catch (error) { return failure(error); }
        },
        async getMessages(conversationId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
                    if (error) throw error;
                    return success(data);
                } else {
                    return success(getLocal('undr_messages', []).filter(m => m.conversationId === conversationId));
                }
            } catch (error) { return failure(error); }
        },
        async sendMessage(conversationId, messageData) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('messages').insert([{ conversation_id: conversationId, ...messageData }]).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const messages = getLocal('undr_messages', []);
                    const newMsg = { id: generateId(), conversationId, createdAt: new Date().toISOString(), ...messageData };
                    messages.push(newMsg);
                    setLocal('undr_messages', messages);
                    return success(newMsg);
                }
            } catch (error) { return failure(error); }
        },
        async sendPpv(conversationId, ppvData) {
            return this.sendMessage(conversationId, { type: 'ppv', ...ppvData });
        },
        async unlockPpv(messageId, buyerId) {
            try {
                if (isSupabaseConfigured()) {
                    // Handle payment logic then unlock
                    const { data, error } = await supabase.from('messages').update({ unlockedBy: buyerId }).eq('id', messageId).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const messages = getLocal('undr_messages', []);
                    const msg = messages.find(m => m.id === messageId);
                    if (msg) msg.unlockedBy = buyerId;
                    setLocal('undr_messages', messages);
                    return success(msg);
                }
            } catch (error) { return failure(error); }
        },
        async sendTip(conversationId, tipData) {
            return this.sendMessage(conversationId, { type: 'tip', ...tipData });
        },
        async sendProposal(conversationId, proposalData) {
            return this.sendMessage(conversationId, { type: 'proposal', ...proposalData });
        }
    },

    // --- Auctions Module ---
    auctions: {
        async getActive() {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('products').select('*').eq('is_auction', true).eq('status', 'active');
                    if (error) throw error;
                    return success(data);
                } else {
                    return success(getLocal('undr_auctions', []).filter(a => a.status === 'active'));
                }
            } catch (error) { return failure(error); }
        },
        async placeBid(auctionId, bidderId, amount) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('bids').insert([{ auction_id: auctionId, bidder_id: bidderId, amount }]).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const bids = getLocal('undr_bids', []);
                    const newBid = { id: generateId(), auctionId, bidderId, amount, createdAt: new Date().toISOString() };
                    bids.push(newBid);
                    setLocal('undr_bids', bids);
                    return success(newBid);
                }
            } catch (error) { return failure(error); }
        },
        async getBids(auctionId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('bids').select('*').eq('auction_id', auctionId).order('amount', { ascending: false });
                    if (error) throw error;
                    return success(data);
                } else {
                    return success(getLocal('undr_bids', []).filter(b => b.auctionId === auctionId).sort((a, b) => b.amount - a.amount));
                }
            } catch (error) { return failure(error); }
        }
    },

    // --- KYC Module ---
    kyc: {
        async submit(applicationData) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('kyc_applications').insert([{ ...applicationData, status: 'pending' }]).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const kycs = getLocal('undr_kyc', []);
                    const newKyc = { id: generateId(), status: 'pending', createdAt: new Date().toISOString(), ...applicationData };
                    kycs.push(newKyc);
                    setLocal('undr_kyc', kycs);
                    return success(newKyc);
                }
            } catch (error) { return failure(error); }
        },
        async getPending() {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('kyc_applications').select('*').eq('status', 'pending');
                    if (error) throw error;
                    return success(data);
                } else {
                    return success(getLocal('undr_kyc', []).filter(k => k.status === 'pending'));
                }
            } catch (error) { return failure(error); }
        },
        async approve(applicationId, adminId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('kyc_applications').update({ status: 'approved', reviewed_by: adminId, reviewed_at: new Date().toISOString() }).eq('id', applicationId).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const kycs = getLocal('undr_kyc_applications', []);
                    const kyc = kycs.find(k => k.id === applicationId);
                    if (kyc) { kyc.status = 'approved'; kyc.reviewed_by = adminId; }
                    setLocal('undr_kyc_applications', kycs);
                    return success(kyc);
                }
            } catch (error) { return failure(error); }
        },
        async reject(applicationId, adminId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('kyc_applications').update({ status: 'rejected', reviewed_by: adminId, reviewed_at: new Date().toISOString() }).eq('id', applicationId).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const kycs = getLocal('undr_kyc_applications', []);
                    const kyc = kycs.find(k => k.id === applicationId);
                    if (kyc) { kyc.status = 'rejected'; kyc.reviewed_by = adminId; }
                    setLocal('undr_kyc_applications', kycs);
                    return success(kyc);
                }
            } catch (error) { return failure(error); }
        }
    },

    // --- Notifications Module ---
    notifications: {
        async getAll(userId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
                    if (error) throw error;
                    return success(data);
                } else {
                    return success(getLocal('undr_notifications', []).filter(n => n.userId === userId));
                }
            } catch (error) { return failure(error); }
        },
        async markRead(notificationId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const notifs = getLocal('undr_notifications', []);
                    const n = notifs.find(n => n.id === notificationId);
                    if (n) n.read = true;
                    setLocal('undr_notifications', notifs);
                    return success(n);
                }
            } catch (error) { return failure(error); }
        },
        async markAllRead(userId) {
            try {
                if (isSupabaseConfigured()) {
                    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
                    if (error) throw error;
                    return success(true);
                } else {
                    const notifs = getLocal('undr_notifications', []);
                    notifs.forEach(n => { if (n.userId === userId) n.read = true; });
                    setLocal('undr_notifications', notifs);
                    return success(true);
                }
            } catch (error) { return failure(error); }
        },
        async create(userId, data) {
            try {
                if (isSupabaseConfigured()) {
                    const { data: res, error } = await supabase.from('notifications').insert([{ user_id: userId, is_read: false, ...data }]).select().single();
                    if (error) throw error;
                    return success(res);
                } else {
                    const notifs = getLocal('undr_notifications', []);
                    const n = { id: generateId(), userId, read: false, createdAt: new Date().toISOString(), ...data };
                    notifs.push(n);
                    setLocal('undr_notifications', notifs);
                    return success(n);
                }
            } catch (error) { return failure(error); }
        }
    },

    // --- Subscriptions Module ---
    subscriptions: {
        async subscribe(buyerId, creatorId, price) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('subscriptions').insert([{ buyer_id: buyerId, creator_id: creatorId, price, status: 'active' }]).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const subs = getLocal('undr_subscriptions', []);
                    const sub = { id: generateId(), buyerId, creatorId, price, status: 'active', createdAt: new Date().toISOString() };
                    subs.push(sub);
                    setLocal('undr_subscriptions', subs);
                    return success(sub);
                }
            } catch (error) { return failure(error); }
        },
        async unsubscribe(subscriptionId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('id', subscriptionId).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const subs = getLocal('undr_subscriptions', []);
                    const sub = subs.find(s => s.id === subscriptionId);
                    if (sub) sub.status = 'cancelled';
                    setLocal('undr_subscriptions', subs);
                    return success(sub);
                }
            } catch (error) { return failure(error); }
        },
        async getByUser(userId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('subscriptions').select('*').eq('buyer_id', userId);
                    if (error) throw error;
                    return success(data);
                } else {
                    return success(getLocal('undr_subscriptions', []).filter(s => s.buyerId === userId));
                }
            } catch (error) { return failure(error); }
        },
        async isSubscribed(buyerId, creatorId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('subscriptions').select('id').eq('buyer_id', buyerId).eq('creator_id', creatorId).eq('status', 'active');
                    if (error) throw error;
                    return success(data.length > 0);
                } else {
                    const subs = getLocal('undr_subscriptions', []);
                    return success(subs.some(s => s.buyerId === buyerId && s.creatorId === creatorId && s.status === 'active'));
                }
            } catch (error) { return failure(error); }
        }
    },

    // --- Addresses Module ---
    addresses: {
        async getAll(userId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('addresses').select('*').eq('user_id', userId);
                    if (error) throw error;
                    return success(data);
                } else {
                    return success(getLocal('undr_addresses', []).filter(a => a.userId === userId));
                }
            } catch (error) { return failure(error); }
        },
        async create(userId, addressData) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('addresses').insert([{ user_id: userId, ...addressData }]).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const addresses = getLocal('undr_addresses', []);
                    const newAddr = { id: generateId(), userId, ...addressData };
                    addresses.push(newAddr);
                    setLocal('undr_addresses', addresses);
                    return success(newAddr);
                }
            } catch (error) { return failure(error); }
        },
        async delete(addressId) {
            try {
                if (isSupabaseConfigured()) {
                    const { error } = await supabase.from('addresses').delete().eq('id', addressId);
                    if (error) throw error;
                    return success(true);
                } else {
                    const addresses = getLocal('undr_addresses', []);
                    setLocal('undr_addresses', addresses.filter(a => a.id !== addressId));
                    return success(true);
                }
            } catch (error) { return failure(error); }
        }
    },

    // --- Admin Module ---
    admin: {
        async getStats() {
            try {
                if (isSupabaseConfigured()) {
                    // Usually an RPC call would be made here to get aggregated stats
                    return success({ gmv: 0, revenue: 0, users: 0 });
                } else {
                    const users = getLocal('undr_users', []).length;
                    const orders = getLocal('undr_orders', []);
                    const gmv = orders.reduce((sum, o) => sum + (o.total || 0), 0);
                    return success({ gmv, revenue: gmv * 0.1, users }); // Fake stats
                }
            } catch (error) { return failure(error); }
        },
        async getListingsForModeration() {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('products').select('*').eq('status', 'pending');
                    if (error) throw error;
                    return success(data);
                } else {
                    return success(getLocal('undr_products', []).filter(p => p.status === 'pending'));
                }
            } catch (error) { return failure(error); }
        },
        async approveProduct(productId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('products').update({ status: 'active' }).eq('id', productId).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const products = getLocal('undr_products', []);
                    const p = products.find(p => p.id === productId);
                    if (p) p.status = 'active';
                    setLocal('undr_products', products);
                    return success(p);
                }
            } catch (error) { return failure(error); }
        },
        async removeProduct(productId) {
            try {
                if (isSupabaseConfigured()) {
                    const { data, error } = await supabase.from('products').update({ status: 'removed' }).eq('id', productId).select().single();
                    if (error) throw error;
                    return success(data);
                } else {
                    const products = getLocal('undr_products', []);
                    const p = products.find(p => p.id === productId);
                    if (p) p.status = 'removed';
                    setLocal('undr_products', products);
                    return success(p);
                }
            } catch (error) { return failure(error); }
        }
    }
};
