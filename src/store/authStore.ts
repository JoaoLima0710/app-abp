import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { setAuthUserId, getAnonymousUserId } from '../lib/supabaseClient';
import { fullSync } from '../db/cloudSync';
import { toast } from 'sonner';
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
        if (!supabase) {
            toast.error('Erro de Configuração', {
                description: 'As variáveis de ambiente do Supabase não foram encontradas. Verifique se foram configuradas corretamente na Vercel e se o deploy teve sucesso.',
                duration: 5000,
            });
            return;
        }
        set({ isLoading: true });

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`,
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
        // We must push local Dexie data to Supabase under the NEW authUserId,
        // because the anonymous data might never have reached Supabase due to RLS 406 errors.

        // Lazy import Dexie database
        const { db } = await import('../db/database');

        // 1. Migrate Simulations
        const localSims = await db.simulations.toArray();
        if (localSims.length > 0) {
            const upserts = localSims.map(sim => ({
                id: sim.id,
                user_id: authUserId,
                data: JSON.parse(JSON.stringify(sim)), // Serialize dates
                updated_at: new Date().toISOString(),
            }));
            await supabase.from('simulations').upsert(upserts, { onConflict: 'id' });
        }

        // 2. Migrate User Progress
        const localProgress = await db.userProgress.get('main');
        if (localProgress) {
            await supabase.from('user_progress').upsert({
                user_id: authUserId,
                data: JSON.parse(JSON.stringify(localProgress)),
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
        }

        // 3. Migrate Seen Questions
        const SEEN_KEY = 'psiq_seen_question_ids';
        let localSeen: string[] = [];
        try {
            const raw = localStorage.getItem(SEEN_KEY);
            if (raw) localSeen = JSON.parse(raw);
        } catch { /* ignore */ }

        if (localSeen.length > 0) {
            await supabase.from('seen_questions').upsert({
                user_id: authUserId,
                question_ids: localSeen,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
        }

        // 4. Migrate Flashcard Progress
        const localFlashcards = await db.flashcardProgress.toArray();
        if (localFlashcards.length > 0) {
            const upserts = localFlashcards.map(fc => ({
                user_id: authUserId,
                question_id: fc.questionId,
                data: JSON.parse(JSON.stringify(fc)),
                updated_at: new Date().toISOString(),
            }));
            await supabase.from('flashcard_progress').upsert(upserts, { onConflict: 'user_id,question_id' });
        }

        localStorage.setItem(migrationKey, 'true');
        console.log('[Auth] Migration complete. Data pushed to auth user.');
    } catch (err) {
        console.error('[Auth] Migration failed:', err);
    }
}
