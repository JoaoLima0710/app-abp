import { create } from 'zustand';
import { Question, Simulation, SimulationQuestion, AnswerOption, PsychiatryTheme } from '../types';
import { getRandomQuestions, saveSimulation, QuestionFilter, getAdaptiveQuestions, getUserProgress } from '../db/database';

interface SimulationState {
    // Current simulation
    simulation: Simulation | null;
    questions: Question[];
    currentIndex: number;
    isLoading: boolean;
    isCompleted: boolean;
    focusTheme?: PsychiatryTheme;
    showExplanation: boolean;

    // Actions
    startSimulation: (count: number, themeOrFilter?: PsychiatryTheme | QuestionFilter) => Promise<void>;
    submitAnswer: (answer: AnswerOption) => void;
    answerQuestion: (answer: AnswerOption) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    goToQuestion: (index: number) => void;
    toggleExplanation: () => void;
    finishSimulation: () => Promise<void>;
    resetSimulation: () => void;
    getCurrentQuestion: () => Question | null;
    getCurrentSimulationQuestion: () => SimulationQuestion | null;
    getProgress: () => { answered: number; total: number; percentage: number };
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
    simulation: null,
    questions: [],
    currentIndex: 0,
    isLoading: false,
    isCompleted: false,
    focusTheme: undefined,
    showExplanation: false,

    startSimulation: async (count: number, themeOrFilter?: PsychiatryTheme | QuestionFilter) => {
        const filter: QuestionFilter = typeof themeOrFilter === 'string'
            ? { theme: themeOrFilter }
            : themeOrFilter || {};
        const theme = filter.theme as PsychiatryTheme | undefined;

        set({ isLoading: true, isCompleted: false, currentIndex: 0, focusTheme: theme });

        try {
            let questions: Question[];
            if (filter.adaptive) {
                const progress = await getUserProgress();
                questions = await getAdaptiveQuestions(count, progress || null);
            } else {
                questions = await getRandomQuestions(count, filter);
            }

            const newSimulation: Simulation = {
                id: crypto.randomUUID(),
                createdAt: new Date(),
                questionCount: questions.length,
                focusTheme: theme,
                questions: questions.map(q => ({
                    questionId: q.id,
                })),
                stats: {
                    totalQuestions: questions.length,
                    answered: 0,
                    correct: 0,
                    incorrect: 0,
                    accuracy: 0,
                    avgTimePerQuestion: 0,
                    byTheme: {},
                },
            };

            set({ simulation: newSimulation, questions, isLoading: false });
        } catch (error) {
            console.error('Error starting simulation:', error);
            set({ isLoading: false });
        }
    },

    submitAnswer: (answer: AnswerOption) => {
        const { simulation, questions, currentIndex } = get();
        if (!simulation || !questions[currentIndex]) return;

        const currentQuestion = questions[currentIndex];
        const isCorrect = answer === currentQuestion.correctAnswer;

        const updatedQuestions = [...simulation.questions];
        updatedQuestions[currentIndex] = {
            ...updatedQuestions[currentIndex],
            userAnswer: answer,
            isCorrect,
            answeredAt: new Date(),
        };

        const answeredCount = updatedQuestions.filter(q => q.userAnswer).length;
        const correctCount = updatedQuestions.filter(q => q.isCorrect).length;

        // Build byTheme stats from all answered questions
        const byTheme: Record<string, { correct: number; total: number; accuracy: number }> = {};
        for (let i = 0; i < updatedQuestions.length; i++) {
            const sq = updatedQuestions[i];
            if (!sq.userAnswer) continue;
            const theme = questions[i]?.theme;
            if (!theme) continue;
            if (!byTheme[theme]) byTheme[theme] = { correct: 0, total: 0, accuracy: 0 };
            byTheme[theme].total += 1;
            if (sq.isCorrect) byTheme[theme].correct += 1;
            byTheme[theme].accuracy = (byTheme[theme].correct / byTheme[theme].total) * 100;
        }

        const updatedSimulation: Simulation = {
            ...simulation,
            questions: updatedQuestions,
            stats: {
                ...simulation.stats,
                answered: answeredCount,
                correct: correctCount,
                incorrect: answeredCount - correctCount,
                accuracy: answeredCount > 0 ? (correctCount / answeredCount) * 100 : 0,
                byTheme,
            },
        };

        set({ simulation: updatedSimulation });

        // Auto-save to IndexedDB to prevent data loss on tab close
        saveSimulation(updatedSimulation).catch(err =>
            console.error('Auto-save failed:', err)
        );
    },

    nextQuestion: () => {
        const { currentIndex, questions } = get();
        if (currentIndex < questions.length - 1) {
            set({ currentIndex: currentIndex + 1 });
        }
    },

    previousQuestion: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) {
            set({ currentIndex: currentIndex - 1 });
        }
    },

    finishSimulation: async () => {
        const { simulation } = get();
        if (!simulation) return;

        const completedSimulation: Simulation = {
            ...simulation,
            completedAt: new Date(),
        };

        await saveSimulation(completedSimulation);
        set({ simulation: completedSimulation, isCompleted: true });
    },

    resetSimulation: () => {
        set({
            simulation: null,
            questions: [],
            currentIndex: 0,
            isCompleted: false,
            focusTheme: undefined,
            showExplanation: false,
        });
    },

    answerQuestion: (answer: AnswerOption) => {
        get().submitAnswer(answer);
    },

    goToQuestion: (index: number) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
            set({ currentIndex: index, showExplanation: false });
        }
    },

    toggleExplanation: () => {
        set({ showExplanation: !get().showExplanation });
    },

    getCurrentQuestion: () => {
        const { questions, currentIndex } = get();
        return questions[currentIndex] || null;
    },

    getCurrentSimulationQuestion: () => {
        const { simulation, currentIndex } = get();
        return simulation?.questions[currentIndex] || null;
    },

    getProgress: () => {
        const { simulation, questions } = get();
        const answered = simulation?.questions.filter(q => q.userAnswer).length || 0;
        const total = questions.length;
        return {
            answered,
            total,
            percentage: total > 0 ? (answered / total) * 100 : 0,
        };
    },
}));
