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

// ─── Expose API globally for legacy app.js ───
window.undrAPI = api;

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
            if (event === 'SIGNED_IN' && session?.user) {
                // Fetch full profile from DB
                const { data: profile } = await api.users.getProfile(session.user.id);
                if (profile) {
                    // Sync to localStorage for legacy app.js compatibility
                    localStorage.setItem('undr_current_user', JSON.stringify(profile));
                    // Dispatch custom event so app.js can react
                    window.dispatchEvent(new CustomEvent('undr:auth:changed', {
                        detail: { event, user: profile }
                    }));
                }
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
        } else {
            console.warn(`  ⚠️ Database connection issue: ${health.error}`);
        }
    } else {
        console.log(
            '%c💾 UNDR Backend: localStorage mode (demo)',
            'color: #f59e0b; font-weight: bold; font-size: 14px;'
        );
        console.log(
            '  ℹ️ To connect a real database, configure js/supabase-config.js'
        );
    }

    // Signal that API is ready
    window.undrAPIReady = true;
    window.dispatchEvent(new Event('undr:api:ready'));
})();
