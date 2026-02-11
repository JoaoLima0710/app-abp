import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulationStore } from '../store/simulationStore';
import { AnswerOption } from '../types';
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, Flag, CheckCircle2 } from 'lucide-react';

const TOTAL_QUESTIONS = 100;
const EXAM_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours

export default function TimedExamPage() {
    const navigate = useNavigate();
    const { simulation, questions, startSimulation, submitAnswer, finishSimulation } = useSimulationStore();
    const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION_MS);
    const [isStarted, setIsStarted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
    const [currentQ, setCurrentQ] = useState(0);
    const startTimeRef = useRef<number>(0);
    const timerRef = useRef<ReturnType<typeof setInterval>>();

    const handleStart = useCallback(async () => {
        await startSimulation(TOTAL_QUESTIONS);
        startTimeRef.current = Date.now();
        setIsStarted(true);
    }, [startSimulation]);

    useEffect(() => {
        if (!isStarted) return;
        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, EXAM_DURATION_MS - elapsed);
            setTimeRemaining(remaining);
            if (remaining === 0) {
                clearInterval(timerRef.current);
                finishSimulation();
                navigate('/simulado/resultado');
            }
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [isStarted, finishSimulation, navigate]);

    const formatTime = (ms: number) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
    };

    const handleAnswer = (answer: AnswerOption) => {
        setSelectedAnswer(answer);
        submitAnswer(answer);
    };

    const goToQ = (idx: number) => {
        if (idx >= 0 && idx < questions.length) {
            setCurrentQ(idx);
            setSelectedAnswer(null);
        }
    };

    const handleFinish = async () => {
        if (confirm('Deseja finalizar a prova? Não será possível voltar.')) {
            clearInterval(timerRef.current);
            await finishSimulation();
            navigate('/simulado/resultado');
        }
    };

    // Pre-exam screen
    if (!isStarted) {
        return (
            <div className="page animate-fade-in" style={{ maxWidth: 600, margin: '0 auto', paddingTop: 'var(--spacing-8)' }}>
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-8)' }}>
                    <AlertTriangle size={48} color="var(--warning-500)" style={{ margin: '0 auto var(--spacing-4)' }} />
                    <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--spacing-3)' }}>
                        Simulação de Prova Completa
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)', lineHeight: 1.6 }}>
                        Esta simulação reproduz as condições da prova real de Título ABP:
                    </p>
                    <div style={{
                        display: 'grid', gap: 'var(--spacing-3)', textAlign: 'left',
                        padding: 'var(--spacing-4)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-lg)',
                        marginBottom: 'var(--spacing-6)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                            <CheckCircle2 size={18} color="var(--primary-500)" />
                            <span><strong>100 questões</strong> selecionadas aleatoriamente</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                            <Clock size={18} color="var(--primary-500)" />
                            <span><strong>5 horas</strong> de tempo máximo</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                            <AlertTriangle size={18} color="var(--warning-500)" />
                            <span><strong>Sem explicações</strong> durante a prova</span>
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg w-full" onClick={handleStart}
                        style={{ fontSize: 'var(--font-size-lg)' }}>
                        Iniciar Prova
                    </button>
                    <button className="btn btn-secondary mt-4" onClick={() => navigate('/')}
                        style={{ width: '100%' }}>
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    const question = questions[currentQ];
    if (!question) return null;
    const simQ = simulation?.questions[currentQ];

    return (
        <div className="page" style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* Timer bar */}
            <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                background: 'var(--bg-primary)', padding: 'var(--spacing-3) var(--spacing-4)',
                borderBottom: '1px solid var(--border-primary)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Clock size={20} color={timeRemaining < 1800000 ? 'var(--error-500)' : 'var(--primary-500)'} />
                    <span style={{
                        fontWeight: 700, fontFamily: 'monospace', fontSize: 'var(--font-size-lg)',
                        color: timeRemaining < 1800000 ? 'var(--error-500)' : 'var(--text-primary)',
                    }}>
                        {formatTime(timeRemaining)}
                    </span>
                </div>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    {currentQ + 1} / {questions.length}
                </span>
                <button className="btn btn-secondary" onClick={handleFinish}
                    style={{ fontSize: 'var(--font-size-sm)', padding: 'var(--spacing-2) var(--spacing-3)' }}>
                    <Flag size={16} />
                    Finalizar
                </button>
            </div>

            {/* Question */}
            <div className="card" style={{ marginTop: 'var(--spacing-4)' }}>
                <p style={{ fontWeight: 600, marginBottom: 'var(--spacing-4)', lineHeight: 1.6 }}>
                    {question.statement}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    {(Object.entries(question.options) as [AnswerOption, string][]).map(([letter, text]) => {
                        const isSelected = simQ?.userAnswer === letter || selectedAnswer === letter;
                        return (
                            <button
                                key={letter}
                                className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => handleAnswer(letter)}
                                style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                            >
                                <span style={{ fontWeight: 700, marginRight: 'var(--spacing-2)' }}>{letter})</span>
                                {text}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-4)' }}>
                <button className="btn btn-secondary" onClick={() => goToQ(currentQ - 1)} disabled={currentQ === 0}>
                    <ChevronLeft size={20} /> Anterior
                </button>
                <button className="btn btn-secondary" onClick={() => goToQ(currentQ + 1)} disabled={currentQ >= questions.length - 1}>
                    Próxima <ChevronRight size={20} />
                </button>
            </div>

            {/* Question map */}
            <div className="card" style={{ marginTop: 'var(--spacing-4)' }}>
                <h4 style={{ marginBottom: 'var(--spacing-3)', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    Mapa de Questões
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
                    {questions.map((_, idx) => {
                        const sq = simulation?.questions[idx];
                        const answered = !!sq?.userAnswer;
                        const isCurrent = idx === currentQ;
                        return (
                            <button
                                key={idx}
                                onClick={() => goToQ(idx)}
                                style={{
                                    width: '100%', aspectRatio: '1',
                                    borderRadius: 'var(--radius-sm)',
                                    border: isCurrent ? '2px solid var(--primary-500)' : '1px solid var(--border-primary)',
                                    background: answered ? 'var(--primary-100)' : 'var(--bg-secondary)',
                                    cursor: 'pointer',
                                    fontSize: 'var(--font-size-xs)',
                                    fontWeight: isCurrent ? 700 : 400,
                                    color: isCurrent ? 'var(--primary-600)' : 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
