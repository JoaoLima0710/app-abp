import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Supabase is optional — app works fully offline without it
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// ── Anonymous user ID (persisted in localStorage) ──
const USER_ID_KEY = 'psiq_user_id';

export function getUserId(): string {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
}

/**
 * Set a specific userId (for syncing with another device).
 * After calling this, reload the app to pull data from the cloud.
 */
export function setUserId(newId: string): void {
    localStorage.setItem(USER_ID_KEY, newId);
}
