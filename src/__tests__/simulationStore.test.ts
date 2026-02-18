import { describe, it, expect, beforeEach } from 'vitest';
import { useSimulationStore } from '../store/simulationStore';
import { AnswerOption, Simulation, SimulationQuestion } from '../types';

// Helper to create a simulation directly in the store
function setSimulation(questions: any[], simQuestions: SimulationQuestion[]) {
    const sim: Simulation = {
        id: 'test-sim-1',
        createdAt: new Date(),
        questionCount: questions.length,
        questions: simQuestions,
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

    useSimulationStore.setState({
        simulation: sim,
        questions,
        currentIndex: 0,
        isLoading: false,
        isCompleted: false,
        showExplanation: false,
    });
}

const mockQuestions = [
    {
        id: 'q1',
        theme: 'psicofarmacologia' as const,
        difficulty: 2 as const,
        statement: 'Qual ISRS tem maior meia-vida?',
        options: { A: 'Fluoxetina', B: 'Sertralina', C: 'Paroxetina', D: 'Citalopram', E: 'Fluvoxamina' },
        correctAnswer: 'A' as AnswerOption,
        explanation: { correct: 'Fluoxetina', keyConcepts: ['ISRS'] },
        tags: [],
    },
    {
        id: 'q2',
        theme: 'transtornos_humor' as const,
        difficulty: 1 as const,
        statement: 'Critério para depressão maior?',
        options: { A: '1 semana', B: '2 semanas', C: '1 mês', D: '3 meses', E: '6 meses' },
        correctAnswer: 'B' as AnswerOption,
        explanation: { correct: '2 semanas', keyConcepts: ['DSM-5'] },
        tags: [],
    },
];

describe('SimulationStore', () => {
    beforeEach(() => {
        useSimulationStore.setState({
            simulation: null,
            questions: [],
            currentIndex: 0,
            isLoading: false,
            isCompleted: false,
            showExplanation: false,
        });
    });

    it('estado inicial deve ser nulo/vazio', () => {
        const state = useSimulationStore.getState();
        expect(state.simulation).toBeNull();
        expect(state.questions).toEqual([]);
        expect(state.currentIndex).toBe(0);
        expect(state.isCompleted).toBe(false);
    });

    it('submitAnswer atualiza resposta corretamente', () => {
        setSimulation(mockQuestions, [
            { questionId: 'q1' },
            { questionId: 'q2' },
        ]);

        const { submitAnswer } = useSimulationStore.getState();
        submitAnswer('A'); // Correct answer for q1

        const state = useSimulationStore.getState();
        expect(state.simulation!.questions[0].userAnswer).toBe('A');
        expect(state.simulation!.questions[0].isCorrect).toBe(true);
        expect(state.simulation!.stats.correct).toBe(1);
        expect(state.simulation!.stats.accuracy).toBe(100);
    });

    it('submitAnswer marca resposta incorreta', () => {
        setSimulation(mockQuestions, [
            { questionId: 'q1' },
            { questionId: 'q2' },
        ]);

        const { submitAnswer } = useSimulationStore.getState();
        submitAnswer('C'); // Wrong answer for q1

        const state = useSimulationStore.getState();
        expect(state.simulation!.questions[0].isCorrect).toBe(false);
        expect(state.simulation!.stats.incorrect).toBe(1);
    });

    it('nextQuestion avança o índice', () => {
        setSimulation(mockQuestions, [
            { questionId: 'q1' },
            { questionId: 'q2' },
        ]);

        const { nextQuestion } = useSimulationStore.getState();
        nextQuestion();

        expect(useSimulationStore.getState().currentIndex).toBe(1);
    });

    it('nextQuestion não avança além do último', () => {
        setSimulation(mockQuestions, [
            { questionId: 'q1' },
            { questionId: 'q2' },
        ]);

        useSimulationStore.setState({ currentIndex: 1 });
        const { nextQuestion } = useSimulationStore.getState();
        nextQuestion();

        expect(useSimulationStore.getState().currentIndex).toBe(1);
    });

    it('previousQuestion volta ao anterior', () => {
        setSimulation(mockQuestions, [
            { questionId: 'q1' },
            { questionId: 'q2' },
        ]);

        useSimulationStore.setState({ currentIndex: 1 });
        const { previousQuestion } = useSimulationStore.getState();
        previousQuestion();

        expect(useSimulationStore.getState().currentIndex).toBe(0);
    });

    it('previousQuestion não vai abaixo de 0', () => {
        setSimulation(mockQuestions, [
            { questionId: 'q1' },
            { questionId: 'q2' },
        ]);

        const { previousQuestion } = useSimulationStore.getState();
        previousQuestion();

        expect(useSimulationStore.getState().currentIndex).toBe(0);
    });

    it('goToQuestion com índice válido navega corretamente', () => {
        setSimulation(mockQuestions, [
            { questionId: 'q1' },
            { questionId: 'q2' },
        ]);

        const { goToQuestion } = useSimulationStore.getState();
        goToQuestion(1);

        expect(useSimulationStore.getState().currentIndex).toBe(1);
    });

    it('goToQuestion com índice inválido não altera', () => {
        setSimulation(mockQuestions, [
            { questionId: 'q1' },
            { questionId: 'q2' },
        ]);

        const { goToQuestion } = useSimulationStore.getState();
        goToQuestion(99);

        expect(useSimulationStore.getState().currentIndex).toBe(0);
    });

    it('getProgress calcula porcentagem corretamente', () => {
        setSimulation(mockQuestions, [
            { questionId: 'q1', userAnswer: 'A' as AnswerOption },
            { questionId: 'q2' },
        ]);

        const { getProgress } = useSimulationStore.getState();
        const progress = getProgress();

        expect(progress.answered).toBe(1);
        expect(progress.total).toBe(2);
        expect(progress.percentage).toBe(50);
    });

    it('resetSimulation limpa todo o estado', () => {
        setSimulation(mockQuestions, [
            { questionId: 'q1' },
            { questionId: 'q2' },
        ]);

        const { resetSimulation } = useSimulationStore.getState();
        resetSimulation();

        const state = useSimulationStore.getState();
        expect(state.simulation).toBeNull();
        expect(state.questions).toEqual([]);
        expect(state.currentIndex).toBe(0);
        expect(state.isCompleted).toBe(false);
    });

    it('toggleExplanation alterna showExplanation', () => {
        const { toggleExplanation } = useSimulationStore.getState();
        expect(useSimulationStore.getState().showExplanation).toBe(false);

        toggleExplanation();
        expect(useSimulationStore.getState().showExplanation).toBe(true);

        toggleExplanation();
        expect(useSimulationStore.getState().showExplanation).toBe(false);
    });

    it('getCurrentQuestion retorna questão pelo índice atual', () => {
        setSimulation(mockQuestions, [
            { questionId: 'q1' },
            { questionId: 'q2' },
        ]);

        const q = useSimulationStore.getState().getCurrentQuestion();
        expect(q).not.toBeNull();
        expect(q!.id).toBe('q1');
    });

    it('getCurrentQuestion retorna null sem simulação', () => {
        const q = useSimulationStore.getState().getCurrentQuestion();
        expect(q).toBeNull();
    });
});
