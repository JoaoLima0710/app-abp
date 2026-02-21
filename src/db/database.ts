import Dexie, { Table } from 'dexie';
import { Question, Simulation, UserProgress } from '../types';
import { syncSimulations, syncUserProgress } from './cloudSync';

// ── Fisher-Yates (Knuth) shuffle — O(n), uniformly random ──
function fisherYatesShuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ── Seen-questions cycling (localStorage) ──
const SEEN_KEY = 'psiq_seen_question_ids';

function getSeenQuestionIds(): Set<string> {
    try {
        const raw = localStorage.getItem(SEEN_KEY);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
}

function markQuestionsSeen(ids: string[]): void {
    const seen = getSeenQuestionIds();
    for (const id of ids) seen.add(id);
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
}

export function resetSeenQuestions(): void {
    localStorage.removeItem(SEEN_KEY);
}

export interface FlashcardProgressRecord {
    questionId: string;
    interval: number;
    repetition: number;
    easeFactor: number;
    dueDate: number;
    lastReviewed?: number;
    history: { date: number; grade: number }[];
}

export class PsiqTituloDB extends Dexie {
    questions!: Table<Question>;
    simulations!: Table<Simulation>;
    userProgress!: Table<UserProgress>;
    flashcardProgress!: Table<FlashcardProgressRecord>;

    constructor() {
        super('PsiqTituloDB');
        this.version(1).stores({
            questions: 'id, theme, difficulty, *tags',
            simulations: 'id, createdAt, completedAt, focusTheme',
            userProgress: 'id',
        });
        this.version(2).stores({
            questions: 'id, theme, difficulty, *tags',
            simulations: 'id, createdAt, completedAt, focusTheme',
            userProgress: 'id',
            flashcardProgress: 'questionId, dueDate',
        });
    }
}

export const db = new PsiqTituloDB();

export async function initializeDatabase() {
    const { questionsOriginais } = await import('./questions_originais');
    const { questionsTreaty } = await import('./questions_treaty');

    const count = await db.questions.count();
    if (count === 0) {
        await db.questions.bulkAdd([...questionsOriginais, ...questionsTreaty]);
    }

    const progress = await db.userProgress.get('main');
    if (!progress) {
        const initialProgress: UserProgress & { id: string } = {
            id: 'main',
            totalSimulations: 0,
            totalQuestionsAnswered: 0,
            overallAccuracy: 0,
            byTheme: {},
            trends: {
                overallTrend: 'stable',
                strongThemes: [],
                weakThemes: [],
                recommendations: []
            },
            streak: 0,
            lastActivityDate: new Date(),
            lastUpdated: new Date(),
        };
        await db.userProgress.add(initialProgress);
    }

    // Rank 8: Migrate flashcard progress from localStorage to Dexie
    const FC_STORAGE_KEY = 'psiq_flashcard_progress_v1';
    const storedFc = localStorage.getItem(FC_STORAGE_KEY);
    if (storedFc) {
        const fcCount = await db.flashcardProgress.count();
        if (fcCount === 0) {
            try {
                const parsed = JSON.parse(storedFc);
                const records: FlashcardProgressRecord[] = Object.values(parsed);
                if (records.length > 0) {
                    await db.flashcardProgress.bulkAdd(records);
                }
                localStorage.removeItem(FC_STORAGE_KEY);
            } catch {
                // If migration fails, keep localStorage data
            }
        }
    }
}

export interface QuestionFilter {
    theme?: string;
    difficulty?: 1 | 2 | 3;
    tier?: 1 | 2 | 3 | 4;
    excludeIds?: string[];
    adaptive?: boolean;
}

export async function getRandomQuestions(count: number, themeOrFilter?: string | QuestionFilter): Promise<Question[]> {
    // Backwards-compatible: accept string (theme) or QuestionFilter object
    const filter: QuestionFilter = typeof themeOrFilter === 'string'
        ? { theme: themeOrFilter }
        : themeOrFilter || {};

    let questions: Question[];

    if (filter.theme) {
        questions = await db.questions.where('theme').equals(filter.theme).toArray();
    } else {
        questions = await db.questions.toArray();
    }

    // Apply additional filters
    if (filter.difficulty) {
        questions = questions.filter(q => q.difficulty === filter.difficulty);
    }
    if (filter.tier) {
        questions = questions.filter(q => q.taxonomy?.tier === filter.tier);
    }
    if (filter.excludeIds && filter.excludeIds.length > 0) {
        const excludeSet = new Set(filter.excludeIds);
        questions = questions.filter(q => !excludeSet.has(q.id));
    }

    // ── Question cycling: exclude already-seen questions ──
    const seen = getSeenQuestionIds();
    let unseen = questions.filter(q => !seen.has(q.id));

    // If not enough unseen questions remain, reset the cycle
    if (unseen.length < count) {
        resetSeenQuestions();
        unseen = questions; // all available again
    }

    // Fisher-Yates shuffle (uniform randomness)
    const shuffled = fisherYatesShuffle(unseen);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    // Mark the selected questions as seen
    markQuestionsSeen(selected.map(q => q.id));

    return selected;
}

export async function getQuestionById(id: string): Promise<Question | undefined> {
    return db.questions.get(id);
}

/**
 * Rank 7: Adaptive question selection based on user progress.
 * 40% weak themes, 30% never-answered, 20% medium, 10% strong.
 */
export async function getAdaptiveQuestions(count: number, progress: UserProgress | null): Promise<Question[]> {
    const allQuestions = await db.questions.toArray();

    if (!progress || Object.keys(progress.byTheme).length === 0) {
        // No data yet — fall back to random (with cycling)
        return getRandomQuestions(count);
    }

    // ── Question cycling: exclude already-seen questions ──
    const seen = getSeenQuestionIds();
    let pool = allQuestions.filter(q => !seen.has(q.id));
    if (pool.length < count) {
        resetSeenQuestions();
        pool = allQuestions;
    }

    // Categorize answered question IDs
    const answeredIds = new Set<string>();
    const sims = await db.simulations.toArray();
    for (const sim of sims) {
        for (const sq of sim.questions) {
            if (sq.userAnswer) answeredIds.add(sq.questionId);
        }
    }

    const weakThemes = new Set(progress.trends.weakThemes);
    const strongThemes = new Set(progress.trends.strongThemes);

    const weakPool = pool.filter(q => weakThemes.has(q.theme));
    const neverAnswered = pool.filter(q => !answeredIds.has(q.id));
    const strongPool = pool.filter(q => strongThemes.has(q.theme));
    const middlePool = pool.filter(q => !weakThemes.has(q.theme) && !strongThemes.has(q.theme));

    const weakCount = Math.round(count * 0.4);
    const newCount = Math.round(count * 0.3);
    const midCount = Math.round(count * 0.2);
    const strongCount = count - weakCount - newCount - midCount;

    const selected: Question[] = [
        ...fisherYatesShuffle(weakPool).slice(0, weakCount),
        ...fisherYatesShuffle(neverAnswered).slice(0, newCount),
        ...fisherYatesShuffle(middlePool).slice(0, midCount),
        ...fisherYatesShuffle(strongPool).slice(0, strongCount),
    ];

    // Deduplicate and fill remaining from pool if needed
    const usedIds = new Set(selected.map(q => q.id));
    const remaining = fisherYatesShuffle(pool.filter(q => !usedIds.has(q.id)));
    while (selected.length < count && remaining.length > 0) {
        selected.push(remaining.pop()!);
    }

    // Mark the selected questions as seen
    markQuestionsSeen(selected.map(q => q.id));

    // Final shuffle to mix categories
    return fisherYatesShuffle(selected).slice(0, count);
}

export async function saveSimulation(simulation: Simulation): Promise<void> {
    await db.simulations.put(simulation);
    // Background cloud sync (non-blocking)
    syncSimulations().catch(() => { });
}

export async function getSimulation(id: string): Promise<Simulation | undefined> {
    return db.simulations.get(id);
}

export async function getAllSimulations(): Promise<Simulation[]> {
    return db.simulations.orderBy('createdAt').reverse().toArray();
}

export async function getRecentSimulations(limit = 10): Promise<Simulation[]> {
    return db.simulations.orderBy('createdAt').reverse().limit(limit).toArray();
}

export async function getUserProgress(): Promise<UserProgress | undefined> {
    return db.userProgress.get('main');
}

export async function updateUserProgress(progress: Partial<UserProgress>): Promise<void> {
    await db.userProgress.update('main', { ...progress, lastUpdated: new Date() });
    // Background cloud sync (non-blocking)
    syncUserProgress().catch(() => { });
}
