import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Supabase is optional — app works fully offline without it
let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// ── User ID resolution ──
// Priority: Supabase Auth user → anonymous UUID fallback
const ANON_USER_ID_KEY = 'psiq_user_id';

/**
 * Returns the current user ID for cloud sync.
 * Uses Supabase Auth user.id when logged in, falls back to anonymous UUID.
 */
export function getUserId(): string {
    // If we have a cached auth user ID, use it
    const authUserId = sessionStorage.getItem('psiq_auth_user_id');
    if (authUserId) return authUserId;

    // Fallback to anonymous UUID
    let userId = localStorage.getItem(ANON_USER_ID_KEY);
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem(ANON_USER_ID_KEY, userId);
    }
    return userId;
}

/**
 * Cache the authenticated user's ID for fast access.
 * Called by authStore when auth state changes.
 */
export function setAuthUserId(userId: string | null): void {
    if (userId) {
        sessionStorage.setItem('psiq_auth_user_id', userId);
    } else {
        sessionStorage.removeItem('psiq_auth_user_id');
    }
}

/**
 * Get the anonymous user ID (for data migration on first login).
 */
export function getAnonymousUserId(): string | null {
    return localStorage.getItem(ANON_USER_ID_KEY);
}
