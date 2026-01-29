import { create } from 'zustand';
import { Question, Simulation, SimulationQuestion, SimulationStats, AnswerOption, PsychiatryTheme } from '../types';
import { getRandomQuestions, getQuestionById, saveSimulation } from '../db/database';

interface SimulationState {
    // Current simulation
    simulation: Simulation | null;
    questions: Question[];
    currentIndex: number;
    isLoading: boolean;
    isCompleted: boolean;
    showExplanation: boolean;
    startTime: number | null;
    questionStartTime: number | null;

    // Actions
    startSimulation: (count: number, theme?: PsychiatryTheme) => Promise<void>;
    answerQuestion: (answer: AnswerOption) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    goToQuestion: (index: number) => void;
    toggleExplanation: () => void;
    finishSimulation: () => Promise<void>;
    resetSimulation: () => void;

    // Getters
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
    showExplanation: false,
    startTime: null,
    questionStartTime: null,

    startSimulation: async (count: number, theme?: PsychiatryTheme) => {
        set({ isLoading: true });

        const questions = await getRandomQuestions(count, theme);

        const simulation: Simulation = {
            id: `sim_${Date.now()}`,
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

        set({
            simulation,
            questions,
            currentIndex: 0,
            isLoading: false,
            isCompleted: false,
            showExplanation: false,
            startTime: Date.now(),
            questionStartTime: Date.now(),
        });
    },

    answerQuestion: (answer: AnswerOption) => {
        const { simulation, questions, currentIndex, questionStartTime } = get();
        if (!simulation) return;

        const question = questions[currentIndex];
        const isCorrect = answer === question.correctAnswer;
        const timeSpent = questionStartTime ? (Date.now() - questionStartTime) / 1000 : 0;

        const updatedQuestions = [...simulation.questions];
        updatedQuestions[currentIndex] = {
            ...updatedQuestions[currentIndex],
            userAnswer: answer,
            isCorrect,
            timeSpentSeconds: timeSpent,
            answeredAt: new Date(),
        };

        // Update stats
        const answered = updatedQuestions.filter(q => q.userAnswer).length;
        const correct = updatedQuestions.filter(q => q.isCorrect).length;
        const incorrect = answered - correct;
        const totalTime = updatedQuestions.reduce((sum, q) => sum + (q.timeSpentSeconds || 0), 0);

        const updatedSimulation: Simulation = {
            ...simulation,
            questions: updatedQuestions,
            stats: {
                ...simulation.stats,
                answered,
                correct,
                incorrect,
                accuracy: answered > 0 ? (correct / answered) * 100 : 0,
                avgTimePerQuestion: answered > 0 ? totalTime / answered : 0,
            },
        };

        set({
            simulation: updatedSimulation,
            showExplanation: true,
        });
    },

    nextQuestion: () => {
        const { currentIndex, questions } = get();
        if (currentIndex < questions.length - 1) {
            set({
                currentIndex: currentIndex + 1,
                showExplanation: false,
                questionStartTime: Date.now(),
            });
        }
    },

    previousQuestion: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) {
            set({
                currentIndex: currentIndex - 1,
                showExplanation: false,
                questionStartTime: Date.now(),
            });
        }
    },

    goToQuestion: (index: number) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
            set({
                currentIndex: index,
                showExplanation: false,
                questionStartTime: Date.now(),
            });
        }
    },

    toggleExplanation: () => {
        set(state => ({ showExplanation: !state.showExplanation }));
    },

    finishSimulation: async () => {
        const { simulation, questions } = get();
        if (!simulation) return;

        // Calculate theme stats
        const byTheme: Record<string, { total: number; correct: number; accuracy: number }> = {};

        for (let i = 0; i < simulation.questions.length; i++) {
            const sq = simulation.questions[i];
            const q = questions[i];

            if (!byTheme[q.theme]) {
                byTheme[q.theme] = { total: 0, correct: 0, accuracy: 0 };
            }

            byTheme[q.theme].total++;
            if (sq.isCorrect) {
                byTheme[q.theme].correct++;
            }
        }

        // Calculate accuracy per theme
        for (const theme of Object.keys(byTheme)) {
            byTheme[theme].accuracy = (byTheme[theme].correct / byTheme[theme].total) * 100;
        }

        const completedSimulation: Simulation = {
            ...simulation,
            completedAt: new Date(),
            stats: {
                ...simulation.stats,
                byTheme: byTheme as Partial<Record<PsychiatryTheme, { total: number; correct: number; accuracy: number }>>,
            },
        };

        await saveSimulation(completedSimulation);

        set({
            simulation: completedSimulation,
            isCompleted: true,
        });
    },

    resetSimulation: () => {
        set({
            simulation: null,
            questions: [],
            currentIndex: 0,
            isLoading: false,
            isCompleted: false,
            showExplanation: false,
            startTime: null,
            questionStartTime: null,
        });
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
        const { simulation } = get();
        if (!simulation) return { answered: 0, total: 0, percentage: 0 };

        const answered = simulation.questions.filter(q => q.userAnswer).length;
        return {
            answered,
            total: simulation.questionCount,
            percentage: (answered / simulation.questionCount) * 100,
        };
    },
}));
