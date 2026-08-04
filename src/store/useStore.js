/**
 * @fileoverview UNDR Zustand Global State Management Store
 */

import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../../js/supabase-config.js';

export const useStore = create((set, get) => ({
    // ─── Language & Localization State ──────────────────────────────────────────
    lang: localStorage.getItem('undr_lang') || 'en',
    toggleLang: () => {
        const newLang = get().lang === 'en' ? 'es' : 'en';
        localStorage.setItem('undr_lang', newLang);
        set({ lang: newLang });
    },

    // ─── User Auth Session State ───────────────────────────────────────────────
    user: JSON.parse(localStorage.getItem('undr_current_user')) || {
        username: 'Guest Buyer',
        handle: '@guest',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
        role: 'buyer',
        balance: 250.00,
        kycStatus: 'unverified'
    },
    setUser: (user) => {
        localStorage.setItem('undr_current_user', JSON.stringify(user));
        set({ user });
    },
    logout: () => {
        localStorage.setItem('undr_current_user', 'null');
        set({
            user: { username: 'Guest', handle: '@guest', role: 'guest', balance: 0 },
            cart: []
        });
    },

    // ─── Shopping Cart & Addons State ──────────────────────────────────────────
    cart: JSON.parse(localStorage.getItem('undr_cart')) || [],
    cartAddonsCost: 0,
    setCartAddonsCost: (cost) => set({ cartAddonsCost: cost }),
    addToCart: (product) => {
        const currentCart = get().cart;
        const existingIdx = currentCart.findIndex(i => i.id === product.id);
        let updatedCart;
        if (existingIdx !== -1) {
            updatedCart = [...currentCart];
            updatedCart[existingIdx].quantity = (updatedCart[existingIdx].quantity || 1) + 1;
        } else {
            updatedCart = [...currentCart, { ...product, quantity: 1 }];
        }
        localStorage.setItem('undr_cart', JSON.stringify(updatedCart));
        set({ cart: updatedCart });
    },
    removeFromCart: (productId) => {
        const updatedCart = get().cart.filter(i => i.id !== productId);
        localStorage.setItem('undr_cart', JSON.stringify(updatedCart));
        set({ cart: updatedCart });
    },
    clearCart: () => {
        localStorage.removeItem('undr_cart');
        set({ cart: [] });
    },

    // ─── Realtime Chat & Media State ───────────────────────────────────────────
    activeChatHandle: '@lunadiamond',
    messages: [],
    typingUsers: new Set(),
    onlineUsers: new Set(),
    setActiveChatHandle: (handle) => set({ activeChatHandle: handle }),
    setMessages: (messages) => set({ messages }),
    addMessage: (msg) => set(state => ({ messages: [...state.messages, msg] })),

    // ─── Auctions & Server-Side Timers State ──────────────────────────────────
    auctions: [],
    setAuctions: (auctions) => set({ auctions }),
    updateAuction: (updatedAuction) => set(state => ({
        auctions: state.auctions.map(a => a.id === updatedAuction.id ? updatedAuction : a)
    })),

    // ─── Notification Preferences State ──────────────────────────────────────
    notificationPreferences: JSON.parse(localStorage.getItem('undr_notif_prefs')) || {
        email_orders: true,
        email_chat: true,
        push_dms: true,
        push_auctions: true
    },
    setNotificationPreferences: (prefs) => {
        localStorage.setItem('undr_notif_prefs', JSON.stringify(prefs));
        set({ notificationPreferences: prefs });
    }
}));
