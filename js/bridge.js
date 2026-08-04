/**
 * @fileoverview UNDR API Bridge
 * 
 * This module bridges the gap between the legacy app.js (classic script)
 * and the new ES module-based API layer (js/api.js).
 * 
 * It loads the API and exposes it as `window.undrAPI` so legacy code
 * can call `undrAPI.products.getAll()` etc. without needing ES module imports.
 * 
 * It also provides initialization, health-check, and backend status utilities.
 */

import { api } from './api.js';
import { isSupabaseConfigured, SUPABASE_URL } from './supabase-config.js';
import { paymentsAPI } from './payments.js';

// ─── Expose API globally for legacy app.js ───
window.undrAPI = api;
window.undrPayments = paymentsAPI;

// ─── Backend Status ───
window.undrBackend = {
    /** @returns {boolean} True if Supabase is configured with real credentials */
    isConnected: () => isSupabaseConfigured(),

    /** @returns {string} 'supabase' or 'localStorage' */
    getMode: () => isSupabaseConfigured() ? 'supabase' : 'localStorage',

    /** @returns {string|null} The Supabase project URL if configured */
    getUrl: () => isSupabaseConfigured() ? SUPABASE_URL : null,

    /**
     * Run a health check against the backend.
     * Tests database connectivity by fetching a single profile.
     * @returns {Promise<{ok: boolean, mode: string, latencyMs: number, error: string|null}>}
     */
    async healthCheck() {
        const start = performance.now();
        const mode = this.getMode();

        if (mode === 'localStorage') {
            return {
                ok: true,
                mode: 'localStorage',
                latencyMs: Math.round(performance.now() - start),
                error: null
            };
        }

        try {
            const { data, error } = await api.products.getAll({ limit: 1 });
            if (error) throw error;
            return {
                ok: true,
                mode: 'supabase',
                latencyMs: Math.round(performance.now() - start),
                error: null
            };
        } catch (err) {
            return {
                ok: false,
                mode: 'supabase',
                latencyMs: Math.round(performance.now() - start),
                error: err.message || String(err)
            };
        }
    }
};

// ─── Auto-initialization ───
(async function initBridge() {
    const mode = window.undrBackend.getMode();
    
    if (mode === 'supabase') {
        console.log(
            '%c🔌 UNDR Backend: Connected to Supabase',
            'color: #10b981; font-weight: bold; font-size: 14px;'
        );

        // Listen for auth state changes and sync to legacy app
        api.auth.onAuthStateChange(async (event, session) => {
            if ((event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') && session?.user) {
                // Fetch full profile from DB
                let { data: profile } = await api.users.getProfile(session.user.id);
                if (!profile) {
                    // Profile doesn't exist yet in public.profiles table (e.g. fresh OAuth sign in)
                    const meta = session.user.user_metadata || {};
                    const googleName = meta.username || meta.full_name || meta.name || session.user.email?.split('@')[0] || 'User';
                    const googleAvatar = meta.avatar_url || meta.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100';
                    const userRole = meta.role || 'buyer';
                    const rawHandle = meta.handle || `@${googleName.toLowerCase().replace(/[^a-z0-9_]/g, '')}`;
                    
                    profile = {
                        id: session.user.id,
                        username: googleName,
                        handle: rawHandle,
                        email: session.user.email,
                        avatar: googleAvatar,
                        role: userRole,
                        balance: userRole === 'buyer' ? 300.00 : 0.00,
                        kycStatus: 'not_applied'
                    };
                    
                    try {
                        await api.users.upsertProfile(profile);
                    } catch (e) {
                        console.warn('Could not upsert profile directly:', e);
                    }
                }
                
                // Sync to localStorage for legacy app.js compatibility
                localStorage.setItem('undr_current_user', JSON.stringify(profile));
                
                // Sync to undr_users list in localStorage
                try {
                    const users = JSON.parse(localStorage.getItem('undr_users') || '[]');
                    const existingIdx = users.findIndex(u => u.email === profile.email || u.id === profile.id || u.handle === profile.handle);
                    if (existingIdx !== -1) {
                        users[existingIdx] = profile;
                    } else {
                        users.push(profile);
                    }
                    localStorage.setItem('undr_users', JSON.stringify(users));
                } catch (e) {}

                // Close all auth modals if open
                const loginModal = document.getElementById('login-modal');
                const registerModal = document.getElementById('register-modal');
                if (loginModal) loginModal.style.display = 'none';
                if (registerModal) registerModal.style.display = 'none';

                // Clean URL hash/code params
                if (window.location.hash || window.location.search.includes('code=')) {
                    window.history.replaceState(null, '', window.location.pathname);
                }

                // Trigger UI update in app.js
                if (window.syncUserSessionUI) window.syncUserSessionUI();

                // Dispatch custom event so app.js can react
                window.dispatchEvent(new CustomEvent('undr:auth:changed', {
                    detail: { event, user: profile }
                }));
            } else if (event === 'SIGNED_OUT') {
                localStorage.setItem('undr_current_user', 'null');
                window.dispatchEvent(new CustomEvent('undr:auth:changed', {
                    detail: { event, user: null }
                }));
            }
        });

        // Run initial health check
        const health = await window.undrBackend.healthCheck();
        if (health.ok) {
            console.log(`  ✅ Database responsive (${health.latencyMs}ms)`);
            renderBackendBadge(true, `Supabase Conectado (${health.latencyMs}ms)`);
        } else {
            console.warn(`  ⚠️ Database connection issue: ${health.error}`);
            renderBackendBadge(false, `Supabase Error: ${health.error}`);
        }
    } else {
        console.log(
            '%c💾 UNDR Backend: localStorage mode (demo)',
            'color: #f59e0b; font-weight: bold; font-size: 14px;'
        );
        renderBackendBadge(false, 'Modo Demo (localStorage)');
    }

    // Signal that API is ready
    window.undrAPIReady = true;
    window.dispatchEvent(new Event('undr:api:ready'));
})();

function renderBackendBadge(isConnected, text) {
    // Disabled status badge overlay to prevent blocking header buttons on mobile/desktop
    return;
}
