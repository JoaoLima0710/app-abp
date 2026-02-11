import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulationStore } from '../store/simulationStore';
import { AnswerOption, THEME_LABELS, THEME_COLORS } from '../types';
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Clock,
    CheckCircle2,
    XCircle,
    Flag,
    BookOpen,
    Lightbulb,
    AlertTriangle,
    List
} from 'lucide-react';

export default function SimulationPage() {
    const navigate = useNavigate();
    const {
        simulation,
        questions,
        currentIndex,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        goToQuestion,
        finishSimulation,
        getCurrentQuestion,
        getCurrentSimulationQuestion,
        getProgress,
    } = useSimulationStore();

    const [elapsedTime, setElapsedTime] = useState(0);
    const [showItemAnalysis, setShowItemAnalysis] = useState(false);

    // Redirect if no simulation
    useEffect(() => {
        if (!simulation) {
            navigate('/simulado/novo');
        }
    }, [simulation, navigate]);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!simulation) return null;

    const question = getCurrentQuestion();
    const simQuestion = getCurrentSimulationQuestion();
    const progress = getProgress();

    if (!question) return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (answer: AnswerOption) => {
        if (simQuestion?.userAnswer) return; // Already answered
        answerQuestion(answer);
    };

    const handleFinish = async () => {
        await finishSimulation();
        navigate(`/simulado/${simulation.id}/resultado`);
    };

    const getOptionClass = (option: AnswerOption) => {
        if (!simQuestion?.userAnswer) return 'answer-option';

        if (option === question.correctAnswer) {
            return 'answer-option answer-option--correct answer-option--disabled';
        }
        if (option === simQuestion.userAnswer && !simQuestion.isCorrect) {
            return 'answer-option answer-option--incorrect answer-option--disabled';
        }
        return 'answer-option answer-option--disabled';
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Header */}
            <header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    background: 'var(--bg-secondary)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: 'var(--spacing-3) var(--spacing-6)',
                }}
            >
                <div className="flex items-center justify-between" style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div className="flex items-center gap-4">
                        <span
                            className="theme-tag"
                            style={{
                                borderLeft: `3px solid ${THEME_COLORS[question.theme]}`,
                                paddingLeft: 'var(--spacing-3)',
                            }}
                        >
                            {THEME_LABELS[question.theme]}
                        </span>
                        <span style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--text-secondary)',
                        }}>
                            Questão {currentIndex + 1} de {questions.length}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="timer">
                            <Clock size={18} />
                            {formatTime(elapsedTime)}
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={handleFinish}
                            disabled={progress.answered === 0}
                        >
                            <Flag size={18} />
                            Finalizar
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div
                    className="progress-bar"
                    style={{
                        marginTop: 'var(--spacing-3)',
                        maxWidth: 1200,
                        margin: 'var(--spacing-3) auto 0',
                    }}
                >
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress.percentage}%` }}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main style={{
                maxWidth: 900,
                margin: '0 auto',
                padding: 'var(--spacing-8) var(--spacing-4)',
            }}>
                {/* Question */}
                <div className="card animate-fade-in" style={{ marginBottom: 'var(--spacing-6)' }}>
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`badge badge-${question.difficulty === 1 ? 'success' : question.difficulty === 2 ? 'warning' : 'error'}`}>
                            {question.difficulty === 1 ? 'Fácil' : question.difficulty === 2 ? 'Médio' : 'Difícil'}
                        </span>
                    </div>

                    <p style={{
                        fontSize: 'var(--font-size-lg)',
                        lineHeight: 1.7,
                        color: 'var(--text-primary)',
                        marginBottom: 'var(--spacing-6)',
                    }}>
                        {question.statement}
                    </p>

                    {/* Options */}
                    <div className="flex flex-col gap-3">
                        {(['A', 'B', 'C', 'D', 'E'] as AnswerOption[]).map((option) => (
                            <button
                                key={option}
                                className={getOptionClass(option)}
                                onClick={() => handleAnswer(option)}
                                disabled={!!simQuestion?.userAnswer}
                            >
                                <span className="answer-letter">{option}</span>
                                <span className="answer-text">{question.options[option]}</span>
                                {simQuestion?.userAnswer && option === question.correctAnswer && (
                                    <CheckCircle2 size={24} color="var(--success-500)" style={{ flexShrink: 0 }} />
                                )}
                                {simQuestion?.userAnswer && option === simQuestion.userAnswer && !simQuestion.isCorrect && (
                                    <XCircle size={24} color="var(--error-500)" style={{ flexShrink: 0 }} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Explanation */}
                {simQuestion?.userAnswer && (
                    <div className="card animate-slide-in" style={{
                        background: simQuestion.isCorrect
                            ? 'linear-gradient(135deg, var(--success-50), var(--bg-secondary))'
                            : 'linear-gradient(135deg, var(--error-50), var(--bg-secondary))',
                    }}>
                        <div className="flex items-center gap-3 mb-4">
                            {simQuestion.isCorrect ? (
                                <CheckCircle2 size={28} color="var(--success-500)" />
                            ) : (
                                <XCircle size={28} color="var(--error-500)" />
                            )}
                            <h3 style={{ margin: 0, fontSize: 'var(--font-size-xl)' }}>
                                {simQuestion.isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta'}
                            </h3>
                        </div>

                        {/* Correct answer explanation */}
                        <div style={{
                            padding: 'var(--spacing-4)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: 'var(--spacing-4)',
                            borderLeft: '4px solid var(--success-500)',
                        }}>
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen size={18} color="var(--success-600)" />
                                <strong style={{ color: 'var(--success-700)' }}>
                                    Alternativa Correta: {question.correctAnswer}
                                </strong>
                            </div>
                            <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                                {question.explanation.correct}
                            </p>
                        </div>

                        {/* Wrong answer explanation (if incorrect) */}
                        {!simQuestion.isCorrect && simQuestion.userAnswer && (
                            <div style={{
                                padding: 'var(--spacing-4)',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--spacing-4)',
                                borderLeft: '4px solid var(--error-500)',
                            }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle size={18} color="var(--error-600)" />
                                    <strong style={{ color: 'var(--error-700)' }}>
                                        Por que {simQuestion.userAnswer} está incorreta:
                                    </strong>
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                                    {question.explanation[`wrong${simQuestion.userAnswer}` as keyof typeof question.explanation] ||
                                        'Esta alternativa não corresponde aos critérios diagnósticos ou conceitos corretos.'}
                                </p>
                            </div>
                        )}

                        {/* Key concepts */}
                        {question.explanation.keyConcepts.length > 0 && (
                            <div style={{ marginBottom: 'var(--spacing-4)' }}>
                                <strong style={{
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--text-secondary)',
                                    display: 'block',
                                    marginBottom: 'var(--spacing-2)',
                                }}>
                                    Conceitos-chave:
                                </strong>
                                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                    {question.explanation.keyConcepts.map((concept, idx) => (
                                        <span key={idx} className="badge badge-primary">
                                            {concept}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Exam tip */}
                        {question.explanation.examTip && (
                            <div style={{
                                padding: 'var(--spacing-4)',
                                background: 'linear-gradient(135deg, var(--warning-50), var(--bg-tertiary))',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--spacing-3)',
                            }}>
                                <Lightbulb size={20} color="var(--warning-600)" style={{ flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <strong style={{
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--warning-700)',
                                        display: 'block',
                                        marginBottom: 'var(--spacing-1)',
                                    }}>
                                        Dica de Prova
                                    </strong>
                                    <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                                        {question.explanation.examTip}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Item Analysis (per-option analysis) */}
                        {question.itemAnalysis && (
                            <div style={{ marginTop: 'var(--spacing-4)' }}>
                                <button
                                    onClick={() => setShowItemAnalysis(prev => !prev)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-2)',
                                        padding: 'var(--spacing-3)',
                                        background: 'var(--bg-tertiary)',
                                        border: '1px solid var(--border-primary)',
                                        borderRadius: 'var(--radius-lg)',
                                        cursor: 'pointer',
                                        color: 'var(--text-primary)',
                                        fontWeight: 600,
                                        fontSize: 'var(--font-size-sm)',
                                    }}
                                >
                                    <List size={18} color="var(--primary-500)" />
                                    Análise por Alternativa
                                    <ChevronDown
                                        size={18}
                                        style={{
                                            marginLeft: 'auto',
                                            transform: showItemAnalysis ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease',
                                        }}
                                    />
                                </button>
                                {showItemAnalysis && (
                                    <div
                                        className="animate-fade-in"
                                        style={{
                                            marginTop: 'var(--spacing-3)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 'var(--spacing-2)',
                                        }}
                                    >
                                        {(['A', 'B', 'C', 'D', 'E'] as const).map((key) => {
                                            const text = question.itemAnalysis?.[key];
                                            if (!text) return null;
                                            const isCorrect = key === question.correctAnswer;
                                            const isUserWrong = key === simQuestion?.userAnswer && !simQuestion?.isCorrect;
                                            return (
                                                <div
                                                    key={key}
                                                    style={{
                                                        padding: 'var(--spacing-3)',
                                                        background: 'var(--bg-secondary)',
                                                        borderRadius: 'var(--radius-md)',
                                                        borderLeft: `4px solid ${isCorrect ? 'var(--success-500)'
                                                            : isUserWrong ? 'var(--error-500)'
                                                                : 'var(--border-primary)'
                                                            }`,
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span
                                                            style={{
                                                                fontWeight: 700,
                                                                fontSize: 'var(--font-size-sm)',
                                                                color: isCorrect ? 'var(--success-600)'
                                                                    : isUserWrong ? 'var(--error-600)'
                                                                        : 'var(--text-secondary)',
                                                            }}
                                                        >
                                                            {key})
                                                        </span>
                                                        {isCorrect && <CheckCircle2 size={14} color="var(--success-500)" />}
                                                        {isUserWrong && <XCircle size={14} color="var(--error-500)" />}
                                                    </div>
                                                    <p style={{
                                                        margin: 0,
                                                        fontSize: 'var(--font-size-sm)',
                                                        color: 'var(--text-primary)',
                                                        lineHeight: 1.6,
                                                    }}>
                                                        {text}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Navigation */}
                <div
                    className="flex items-center justify-between"
                    style={{ marginTop: 'var(--spacing-6)' }}
                >
                    <button
                        className="btn btn-secondary"
                        onClick={previousQuestion}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft size={20} />
                        Anterior
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={nextQuestion}
                        disabled={currentIndex === questions.length - 1}
                    >
                        Próxima
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Question Navigation Grid */}
                <div
                    className="card"
                    style={{ marginTop: 'var(--spacing-6)' }}
                >
                    <h4 style={{ margin: '0 0 var(--spacing-4) 0', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                        Navegação Rápida
                    </h4>
                    <div className="question-nav-grid">
                        {simulation.questions.map((q, idx) => (
                            <button
                                key={idx}
                                className={`question-nav-item ${idx === currentIndex ? 'question-nav-item--current' :
                                    q.isCorrect === true ? 'question-nav-item--correct' :
                                        q.isCorrect === false ? 'question-nav-item--incorrect' :
                                            q.userAnswer ? 'question-nav-item--answered' : ''
                                    }`}
                                onClick={() => goToQuestion(idx)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
