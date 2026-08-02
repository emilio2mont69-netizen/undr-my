/**
 * @fileoverview Supabase client configuration and initialization.
 * 
 * IMPORTANT: Replace the placeholder values below with your real Supabase
 * project credentials to enable the real backend. If left as placeholders,
 * the app will continue to work using localStorage (demo mode).
 * 
 * You can find your credentials in the Supabase dashboard:
 * Settings > API > Project URL and Project API Key (anon public)
 */

// Configuration placeholders - Replace these with actual Supabase project credentials
export const SUPABASE_URL = 'YOUR_SUPABASE_URL';
export const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

/**
 * Checks if Supabase has been configured with real credentials.
 * @returns {boolean} True if configured, false otherwise.
 */
export const isSupabaseConfigured = () => {
    return (
        SUPABASE_URL &&
        SUPABASE_ANON_KEY &&
        SUPABASE_URL !== 'YOUR_SUPABASE_URL' &&
        SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY' &&
        SUPABASE_URL.startsWith('https://')
    );
};

/**
 * Supabase client instance.
 * Only initialized with a real client if credentials are configured.
 * Otherwise, provides a null placeholder (all operations fall back to localStorage).
 */
let supabase = null;

// Only attempt to load the Supabase library if credentials are configured
if (isSupabaseConfigured()) {
    try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
        console.warn('⚠️ Failed to load Supabase client:', err.message);
        supabase = null;
    }
}

export { supabase };
