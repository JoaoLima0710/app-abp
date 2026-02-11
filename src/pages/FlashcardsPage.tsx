import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Layers, CheckCircle, Clock, Sparkles, ArrowRight, Brain } from 'lucide-react';
import { useFlashcards } from '../hooks/useFlashcards';

const FlashcardsPage: React.FC = () => {
    const navigate = useNavigate();
    const { getStats } = useFlashcards();
    const stats = getStats();

    const handleStartReview = () => {
        navigate('/flashcards/estudo', { state: { mode: 'due' } });
    };

    const handleStartNew = () => {
        navigate('/flashcards/estudo', { state: { mode: 'new' } });
    };

    // Progress percentage
    const progressPct = stats.totalQuestions > 0
        ? Math.round((stats.totalLearned / stats.totalQuestions) * 100)
        : 0;

    return (
        <div className="page animate-fade-in">
            <header className="page-header">
                <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <Brain size={32} />
                    Flashcards
                </h1>
                <p className="page-subtitle">
                    Revisão espaçada para memorização de longo prazo
                </p>
            </header>

            {/* Stats Row */}
            <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'var(--spacing-4)',
                marginBottom: 'var(--spacing-6)',
            }}>
                {/* Due Today */}
                <div className="card" style={{
                    padding: 'var(--spacing-5)',
                    display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)',
                    borderLeft: '4px solid var(--primary-500)',
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                        background: 'var(--primary-50)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Clock size={24} color="var(--primary-500)" />
                    </div>
                    <div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)', fontWeight: 700,
                            color: stats.dueCount > 0 ? 'var(--primary-600)' : 'var(--text-primary)',
                            lineHeight: 1.1,
                        }}>
                            {stats.dueCount}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            Para Revisar Hoje
                        </div>
                    </div>
                </div>

                {/* Learned */}
                <div className="card" style={{
                    padding: 'var(--spacing-5)',
                    display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)',
                    borderLeft: '4px solid var(--success-500)',
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                        background: 'var(--success-50)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <CheckCircle size={24} color="var(--success-500)" />
                    </div>
                    <div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)', fontWeight: 700,
                            color: 'var(--text-primary)', lineHeight: 1.1,
                        }}>
                            {stats.totalLearned}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            Cartões Aprendidos
                        </div>
                    </div>
                </div>

                {/* Total */}
                <div className="card" style={{
                    padding: 'var(--spacing-5)',
                    display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)',
                    borderLeft: '4px solid var(--secondary-500)',
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                        background: 'var(--secondary-50)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <Layers size={24} color="var(--secondary-500)" />
                    </div>
                    <div>
                        <div style={{
                            fontSize: 'var(--font-size-3xl)', fontWeight: 700,
                            color: 'var(--text-primary)', lineHeight: 1.1,
                        }}>
                            {stats.totalQuestions}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            Total no Baralho
                        </div>
                    </div>
                </div>
            </section>

            {/* Overall Progress Bar */}
            <section className="card" style={{ padding: 'var(--spacing-5)', marginBottom: 'var(--spacing-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Progresso Geral
                    </span>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--primary-600)' }}>
                        {progressPct}%
                    </span>
                </div>
                <div style={{
                    height: 10, borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-tertiary)', overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${progressPct}%`,
                        background: 'linear-gradient(90deg, var(--primary-400), var(--primary-600))',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.6s ease',
                    }} />
                </div>
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginTop: 'var(--spacing-2)',
                    fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)',
                }}>
                    <span>{stats.totalLearned} aprendidos</span>
                    <span>{stats.totalQuestions - stats.totalLearned} restantes</span>
                </div>
            </section>

            {/* Action Cards */}
            <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--spacing-5)',
            }}>
                {/* Daily Review */}
                <div style={{
                    background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--spacing-6)',
                    color: 'white',
                    boxShadow: 'var(--shadow-lg)',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Decorative circle */}
                    <div style={{
                        position: 'absolute', top: -20, right: -20,
                        width: 100, height: 100, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: -30, right: 40,
                        width: 60, height: 60, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.07)',
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)',
                            marginBottom: 'var(--spacing-2)',
                        }}>
                            <Sparkles size={20} />
                            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'white', margin: 0 }}>
                                Revisão Diária
                            </h2>
                        </div>
                        <p style={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: 'var(--font-size-sm)',
                            marginBottom: 'var(--spacing-5)',
                            lineHeight: 1.5,
                        }}>
                            {stats.dueCount > 0
                                ? `Você tem ${stats.dueCount} cartão${stats.dueCount !== 1 ? 'ões' : ''} agendado${stats.dueCount !== 1 ? 's' : ''} para hoje. Mantenha sua ofensiva!`
                                : 'Nenhum cartão pendente. Você está em dia! 🎉'
                            }
                        </p>
                        <button
                            className="btn"
                            onClick={handleStartReview}
                            disabled={stats.dueCount === 0}
                            style={{
                                background: stats.dueCount > 0 ? 'white' : 'rgba(255,255,255,0.2)',
                                color: stats.dueCount > 0 ? 'var(--primary-600)' : 'rgba(255,255,255,0.5)',
                                fontWeight: 600,
                                padding: 'var(--spacing-3) var(--spacing-6)',
                                cursor: stats.dueCount > 0 ? 'pointer' : 'not-allowed',
                                border: 'none',
                                fontSize: 'var(--font-size-sm)',
                            }}
                        >
                            {stats.dueCount > 0 ? 'Iniciar Revisão' : 'Nada para revisar'}
                            {stats.dueCount > 0 && <ArrowRight size={16} />}
                        </button>
                    </div>
                </div>

                {/* Learn New */}
                <div className="card" style={{
                    padding: 'var(--spacing-6)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}>
                    {/* Subtle gradient accent */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                        background: 'linear-gradient(90deg, var(--secondary-400), var(--secondary-600))',
                    }} />

                    <div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)',
                            marginBottom: 'var(--spacing-2)',
                        }}>
                            <BookOpen size={20} color="var(--secondary-500)" />
                            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, margin: 0 }}>
                                Aprender Novos
                            </h2>
                        </div>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: 'var(--font-size-sm)',
                            marginBottom: 'var(--spacing-5)',
                            lineHeight: 1.5,
                        }}>
                            Adicione 10 novos cartões ao seu ciclo de aprendizado. Expanda seu conhecimento gradualmente.
                        </p>
                    </div>
                    <button
                        className="btn btn-secondary"
                        onClick={handleStartNew}
                        style={{
                            fontWeight: 600,
                            padding: 'var(--spacing-3) var(--spacing-6)',
                            alignSelf: 'flex-start',
                        }}
                    >
                        <BookOpen size={16} />
                        Aprender +10
                        <ArrowRight size={16} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default FlashcardsPage;
