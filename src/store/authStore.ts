import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { setAuthUserId, getAnonymousUserId } from '../lib/supabaseClient';
import { fullSync } from '../db/cloudSync';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isInitialized: boolean;

    initialize: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    session: null,
    isLoading: false,
    isInitialized: false,

    initialize: async () => {
        if (get().isInitialized) return;

        if (!supabase) {
            set({ isInitialized: true });
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setAuthUserId(session.user.id);
            }

            set({
                user: session?.user ?? null,
                session,
                isInitialized: true,
            });

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (_event, session) => {
                const user = session?.user ?? null;
                setAuthUserId(user?.id ?? null);

                set({ user, session });

                // When user logs in, migrate anonymous data and sync
                if (user && _event === 'SIGNED_IN') {
                    await migrateAnonymousData(user.id);
                    fullSync().catch(() => { });
                }
            });
        } catch (err) {
            console.error('[Auth] Initialization failed:', err);
            set({ isInitialized: true });
        }
    },

    signInWithGoogle: async () => {
        if (!supabase) return;
        set({ isLoading: true });

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
        } catch (err) {
            console.error('[Auth] Google sign-in failed:', err);
            set({ isLoading: false });
        }
    },

    signOut: async () => {
        if (!supabase) return;
        set({ isLoading: true });

        try {
            await supabase.auth.signOut();
            setAuthUserId(null);
            set({ user: null, session: null, isLoading: false });
        } catch (err) {
            console.error('[Auth] Sign-out failed:', err);
            set({ isLoading: false });
        }
    },
}));

/**
 * Migrate data from anonymous UUID to authenticated user ID.
 * This runs once on first Google login — copies any cloud data
 * stored under the old anonymous ID to the new auth user ID.
 */
async function migrateAnonymousData(authUserId: string): Promise<void> {
    if (!supabase) return;

    const anonUserId = getAnonymousUserId();
    if (!anonUserId || anonUserId === authUserId) return;

    // Check if migration was already done
    const migrationKey = `psiq_migrated_${anonUserId}_to_${authUserId}`;
    if (localStorage.getItem(migrationKey)) return;

    console.log('[Auth] Migrating data from anonymous', anonUserId, '→ auth', authUserId);

    try {
        // Migrate simulations
        const { data: anonSims } = await supabase
            .from('simulations')
            .select('*')
            .eq('user_id', anonUserId);

        if (anonSims && anonSims.length > 0) {
            const migrated = anonSims.map(row => ({
                ...row,
                user_id: authUserId,
            }));
            await supabase.from('simulations').upsert(migrated, { onConflict: 'id' });
        }

        // Migrate user progress
        const { data: anonProgress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', anonUserId)
            .single();

        if (anonProgress) {
            await supabase.from('user_progress').upsert({
                ...anonProgress,
                user_id: authUserId,
            }, { onConflict: 'user_id' });
        }

        // Migrate seen questions
        const { data: anonSeen } = await supabase
            .from('seen_questions')
            .select('*')
            .eq('user_id', anonUserId)
            .single();

        if (anonSeen) {
            await supabase.from('seen_questions').upsert({
                ...anonSeen,
                user_id: authUserId,
            }, { onConflict: 'user_id' });
        }

        // Migrate flashcard progress
        const { data: anonFlash } = await supabase
            .from('flashcard_progress')
            .select('*')
            .eq('user_id', anonUserId);

        if (anonFlash && anonFlash.length > 0) {
            const migrated = anonFlash.map(row => ({
                ...row,
                user_id: authUserId,
            }));
            await supabase.from('flashcard_progress').upsert(migrated, { onConflict: 'user_id,question_id' });
        }

        localStorage.setItem(migrationKey, 'true');
        console.log('[Auth] Migration complete');
    } catch (err) {
        console.warn('[Auth] Migration failed (non-critical):', err);
    }
}
