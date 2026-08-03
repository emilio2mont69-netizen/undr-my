/**
 * @fileoverview Supabase client configuration and initialization.
 * 
 * Configured with active project credentials.
 */

// Supabase project credentials
export const SUPABASE_URL = 'https://swwlphueayxryooqlwhe.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3d2xwaHVlYXl4cnlvb3Fsd2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MDAwMjcsImV4cCI6MjEwMTI3NjAyN30.K4qnNFyn_0jSOAUMS-btlzpvxkn5AcTAbzc7z1G1pZA';

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
        SUPABASE_URL.startsWith('https://') &&
        SUPABASE_ANON_KEY.startsWith('eyJ')
    );
};

/**
 * Supabase client instance.
 * Initialized with official createClient using standard JWT anon key.
 */
let supabase = null;

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
