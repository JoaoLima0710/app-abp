import Dexie, { Table } from 'dexie';
import { Question, Simulation, UserProgress } from '../types';
import { seedQuestions } from './questions';

export class PsiqTituloDB extends Dexie {
    questions!: Table<Question>;
    simulations!: Table<Simulation>;
    userProgress!: Table<UserProgress>;

    constructor() {
        super('PsiqTituloDB');
        this.version(1).stores({
            questions: 'id, theme, difficulty, *tags',
            simulations: 'id, createdAt, completedAt, focusTheme',
            userProgress: 'id',
        });
    }
}

export const db = new PsiqTituloDB();

export async function initializeDatabase() {
    const count = await db.questions.count();
    if (count === 0) {
        await db.questions.bulkAdd(seedQuestions);
    }
    const progress = await db.userProgress.get('main');
    if (!progress) {
        await db.userProgress.add({
            totalSimulations: 0,
            totalQuestionsAnswered: 0,
            overallAccuracy: 0,
            byTheme: {},
            trends: { overallTrend: 'stable', strongThemes: [], weakThemes: [], recommendations: [] },
            lastUpdated: new Date(),
        } as UserProgress & { id: string });
    }
}

export async function getRandomQuestions(count: number, theme?: string): Promise<Question[]> {
    let questions: Question[];
    if (theme) {
        questions = await db.questions.where('theme').equals(theme).toArray();
    } else {
        questions = await db.questions.toArray();
    }
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

export async function getQuestionById(id: string): Promise<Question | undefined> {
    return db.questions.get(id);
}

export async function saveSimulation(simulation: Simulation): Promise<void> {
    await db.simulations.put(simulation);
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
}
