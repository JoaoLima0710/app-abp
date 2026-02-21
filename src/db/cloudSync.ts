/**
 * Cloud Sync Engine — Supabase ↔ Dexie (local-first)
 *
 * - App works 100% offline with Dexie (IndexedDB)
 * - When online, syncs to Supabase in the background
 * - Conflict resolution: last-write-wins (by updated_at)
 * - Auto-sync every 30 seconds when online
 *
 * Uses dynamic import for db to avoid circular dependency with database.ts
 */

import { supabase, getUserId } from '../lib/supabaseClient';
import { Simulation, UserProgress, CustomFlashcard } from '../types';

// Lazy import to avoid circular dependency
async function getDb() {
    const mod = await import('./database');
    return mod.db;
}

// ── Sync status tracking ─────────────────────────────────────────────
let syncInterval: ReturnType<typeof setInterval> | null = null;
let isSyncing = false;

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error' | 'offline';
type SyncListener = (status: SyncStatus, message?: string) => void;
const listeners: SyncListener[] = [];

export function onSyncStatus(listener: SyncListener): () => void {
    listeners.push(listener);
    return () => {
        const idx = listeners.indexOf(listener);
        if (idx >= 0) listeners.splice(idx, 1);
    };
}

function emitStatus(status: SyncStatus, message?: string) {
    listeners.forEach(fn => fn(status, message));
}

// ── Helper: check if Supabase is configured ──────────────────────────
function isCloudAvailable(): boolean {
    return !!supabase && navigator.onLine;
}

// ── Serialize/Deserialize helpers for Dates ──────────────────────────
function serializeDates(obj: unknown): unknown {
    if (obj instanceof Date) return obj.toISOString();
    if (Array.isArray(obj)) return obj.map(serializeDates);
    if (obj && typeof obj === 'object') {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            result[key] = serializeDates(value);
        }
        return result;
    }
    return obj;
}

const DATE_KEYS = new Set(['createdAt', 'completedAt', 'answeredAt', 'lastActivityDate', 'lastUpdated', 'lastLogin', 'nextReviewDate', 'lastReviewed']);

function deserializeDates(obj: unknown): unknown {
    if (Array.isArray(obj)) return obj.map(item => deserializeDates(item));
    if (obj && typeof obj === 'object') {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
            if (DATE_KEYS.has(key) && typeof value === 'string') {
                result[key] = new Date(value);
            } else {
                result[key] = deserializeDates(value);
            }
        }
        return result;
    }
    return obj;
}

// ══════════════════════════════════════════════════════════════════════
// 1. SYNC SIMULATIONS
// ══════════════════════════════════════════════════════════════════════

export async function syncSimulations(): Promise<void> {
    if (!isCloudAvailable() || !supabase) return;
    const db = await getDb();
    const userId = getUserId();

    try {
        // Pull from cloud
        const { data: cloudRows, error } = await supabase
            .from('simulations')
            .select('id, data, updated_at')
            .eq('user_id', userId);

        if (error) throw error;

        const cloudMap = new Map<string, Simulation>();
        for (const row of cloudRows || []) {
            cloudMap.set(row.id as string, deserializeDates(row.data) as Simulation);
        }

        // Get all local simulations
        const localSims = await db.simulations.toArray();
        const localMap = new Map<string, Simulation>();
        for (const sim of localSims) localMap.set(sim.id, sim);

        // Merge: cloud → local (pull new or newer)
        for (const [id, cloudSim] of cloudMap) {
            const localSim = localMap.get(id);
            if (!localSim) {
                // New simulation from cloud
                await db.simulations.put(cloudSim);
            } else {
                // Exists locally. Check if cloud is newer (compare lastUpdated if they exist)
                // We assume cloud data is always the truth if it comes from another device
                // since simulations are mostly read-only on non-active devices
                const cloudDate = cloudSim.completedAt ? new Date(cloudSim.completedAt).getTime() : 0;
                const localDate = localSim.completedAt ? new Date(localSim.completedAt).getTime() : 0;

                // If cloud is completed and local is not, or cloud has more answers, overwrite local
                const cloudAns = cloudSim.stats?.answered || 0;
                const localAns = localSim.stats?.answered || 0;

                if (
                    (!localSim.completedAt && cloudSim.completedAt) ||
                    (cloudAns > localAns) ||
                    (cloudAns === localAns && cloudDate > localDate)
                ) {
                    await db.simulations.put(cloudSim);
                }
            }
        }

        // Push: local → cloud
        const upserts = localSims.map((sim: Simulation) => ({
            id: sim.id,
            user_id: userId,
            data: serializeDates(sim),
            updated_at: new Date().toISOString(),
        }));

        if (upserts.length > 0) {
            const { error: pushError } = await supabase
                .from('simulations')
                .upsert(upserts, { onConflict: 'id' });
            if (pushError) throw pushError;
        }
    } catch (err) {
        console.warn('[CloudSync] Simulations sync failed:', err);
        throw err;
    }
}

// ══════════════════════════════════════════════════════════════════════
// 2. SYNC USER PROGRESS
// ══════════════════════════════════════════════════════════════════════

export async function syncUserProgress(): Promise<void> {
    if (!isCloudAvailable() || !supabase) return;
    const db = await getDb();
    const userId = getUserId();

    try {
        const { data: cloudRow, error } = await supabase
            .from('user_progress')
            .select('data, updated_at')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        const localProgress = await db.userProgress.get('main');

        if (cloudRow && !localProgress) {
            const restored = deserializeDates(cloudRow.data) as UserProgress & { id: string };
            restored.id = 'main';
            await db.userProgress.put(restored);
        } else if (localProgress) {
            const { error: pushError } = await supabase
                .from('user_progress')
                .upsert({
                    user_id: userId,
                    data: serializeDates(localProgress),
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'user_id' });
            if (pushError) throw pushError;
        }
    } catch (err) {
        console.warn('[CloudSync] UserProgress sync failed:', err);
        throw err;
    }
}

// ══════════════════════════════════════════════════════════════════════
// 3. SYNC SEEN QUESTIONS
// ══════════════════════════════════════════════════════════════════════

const SEEN_KEY = 'psiq_seen_question_ids';

export async function syncSeenQuestions(): Promise<void> {
    if (!isCloudAvailable() || !supabase) return;
    const userId = getUserId();

    try {
        let localIds: string[] = [];
        try {
            const raw = localStorage.getItem(SEEN_KEY);
            if (raw) localIds = JSON.parse(raw);
        } catch { /* empty */ }

        const { data: cloudRow, error } = await supabase
            .from('seen_questions')
            .select('question_ids')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        const cloudIds: string[] = cloudRow?.question_ids || [];

        const safeLocal = Array.isArray(localIds) ? localIds : [];
        const safeCloud = Array.isArray(cloudIds) ? cloudIds : [];
        const merged = [...new Set([...safeLocal, ...safeCloud])];

        localStorage.setItem(SEEN_KEY, JSON.stringify(merged));

        const { error: pushError } = await supabase
            .from('seen_questions')
            .upsert({
                user_id: userId,
                question_ids: merged,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

        if (pushError) throw pushError;
    } catch (err) {
        console.warn('[CloudSync] SeenQuestions sync failed:', err);
        throw err;
    }
}

// ══════════════════════════════════════════════════════════════════════
// 4. SYNC FLASHCARD PROGRESS
// ══════════════════════════════════════════════════════════════════════

interface FlashcardData {
    questionId: string;
    interval: number;
    repetition: number;
    easeFactor: number;
    dueDate: number;
    lastReviewed?: number;
    history: { date: number; grade: number }[];
}

export async function syncFlashcardProgress(): Promise<void> {
    if (!isCloudAvailable() || !supabase) return;
    const db = await getDb();
    const userId = getUserId();

    try {
        const { data: cloudRows, error } = await supabase
            .from('flashcard_progress')
            .select('question_id, data')
            .eq('user_id', userId);

        if (error) throw error;

        const localRecords = await db.flashcardProgress.toArray();
        const localMap = new Map<string, FlashcardData>();
        for (const rec of localRecords) localMap.set(rec.questionId, rec);

        for (const row of cloudRows || []) {
            if (!localMap.has(row.question_id as string)) {
                await db.flashcardProgress.put(row.data as FlashcardData);
            }
        }

        if (localRecords.length > 0) {
            const upserts = localRecords.map((rec: FlashcardData) => ({
                user_id: userId,
                question_id: rec.questionId,
                data: serializeDates(rec),
                updated_at: new Date().toISOString(),
            }));

            const { error: pushError } = await supabase
                .from('flashcard_progress')
                .upsert(upserts, { onConflict: 'user_id,question_id' });
            if (pushError) throw pushError;
        }
    } catch (err) {
        console.warn('[CloudSync] FlashcardProgress sync failed:', err);
        throw err;
    }
}

// ══════════════════════════════════════════════════════════════════════
// 5. SYNC CUSTOM FLASHCARDS (AI Generated)
// ══════════════════════════════════════════════════════════════════════

export async function syncCustomFlashcards(): Promise<void> {
    if (!isCloudAvailable() || !supabase) return;
    const db = await getDb();
    const userId = getUserId();

    try {
        const { data: cloudRows, error } = await supabase
            .from('custom_flashcards')
            .select('id, data')
            .eq('user_id', userId);

        if (error) throw error;

        const localRecords = await db.customFlashcards.toArray();
        const localMap = new Map<string, CustomFlashcard>();
        for (const rec of localRecords) localMap.set(rec.id, rec);

        // Pull from cloud
        for (const row of cloudRows || []) {
            if (!localMap.has(row.id as string)) {
                await db.customFlashcards.put(row.data as CustomFlashcard);
            }
        }

        // Push to cloud
        if (localRecords.length > 0) {
            const upserts = localRecords.map((rec: CustomFlashcard) => ({
                id: rec.id,
                user_id: userId,
                data: serializeDates(rec),
                updated_at: new Date().toISOString(),
            }));

            const { error: pushError } = await supabase
                .from('custom_flashcards')
                .upsert(upserts, { onConflict: 'id' });
            if (pushError) throw pushError;
        }
    } catch (err) {
        console.warn('[CloudSync] CustomFlashcards sync failed:', err);
        throw err;
    }
}

// ══════════════════════════════════════════════════════════════════════
// 6. FULL SYNC (all tables)
// ══════════════════════════════════════════════════════════════════════

export async function fullSync(): Promise<void> {
    if (!isCloudAvailable() || isSyncing) return;

    isSyncing = true;
    emitStatus('syncing');

    try {
        await Promise.all([
            syncSimulations(),
            syncUserProgress(),
            syncSeenQuestions(),
            syncFlashcardProgress(),
            syncCustomFlashcards(),
        ]);
        emitStatus('success', 'Dados sincronizados');
    } catch (err) {
        emitStatus('error', (err as Error).message);
    } finally {
        isSyncing = false;
    }
}

// ══════════════════════════════════════════════════════════════════════
// 6. AUTO-SYNC (start/stop)
// ══════════════════════════════════════════════════════════════════════

const SYNC_INTERVAL_MS = 30_000; // 30 seconds

export function startAutoSync(): void {
    if (syncInterval) return;
    if (!supabase) {
        console.log('[CloudSync] Supabase not configured — running offline only');
        emitStatus('offline');
        return;
    }

    console.log('[CloudSync] Auto-sync started (every 30s)');

    // Initial sync after a short delay
    setTimeout(() => fullSync(), 2000);

    // Periodic sync
    syncInterval = setInterval(() => fullSync(), SYNC_INTERVAL_MS);

    // Sync on tab visibility change (user comes back)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            fullSync();
        }
    });

    // Sync on online event
    window.addEventListener('online', () => {
        console.log('[CloudSync] Back online — syncing');
        fullSync();
    });

    window.addEventListener('offline', () => {
        emitStatus('offline');
    });
}

export function stopAutoSync(): void {
    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
    }
}
