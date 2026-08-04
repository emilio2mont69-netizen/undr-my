import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://swwlphueayxryooqlwhe.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3d2xwaHVlYXl4cnlvb3Fsd2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MDAwMjcsImV4cCI6MjEwMTI3NjAyN30.K4qnNFyn_0jSOAUMS-btlzpvxkn5AcTAbzc7z1G1pZA';

export const isSupabaseConfigured = () => {
    return (
        SUPABASE_URL &&
        SUPABASE_ANON_KEY &&
        SUPABASE_URL.startsWith('https://') &&
        SUPABASE_ANON_KEY.startsWith('eyJ')
    );
};

let supabaseInstance = null;

try {
    if (isSupabaseConfigured()) {
        supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.undrSupabaseClient = supabaseInstance;
    }
} catch (err) {
    console.warn('Supabase initialization fallback:', err);
}

export const supabase = supabaseInstance;
export default supabaseInstance;
