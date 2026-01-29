import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { THEME_LABELS, THEME_COLORS } from '../types';
import {
    BookOpen,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    Zap,
    Target,
    Award,
    ArrowRight,
    Brain,
    Lightbulb
} from 'lucide-react';

export default function StudyPlan() {
    const navigate = useNavigate();
    const { recommendations, progress, loadUserData } = useUserStore();

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    const hasData = progress && progress.totalSimulations > 0;

    // Generate study priorities
    const studyPriorities = progress?.byTheme
        ? Object.entries(progress.byTheme)
            .map(([theme, data]) => ({
                theme: theme as keyof typeof THEME_LABELS,
                accuracy: data?.accuracy || 0,
                total: data?.totalAttempts || 0,
                trend: data?.trend,
                priority: calculatePriority(data?.accuracy || 0, data?.totalAttempts || 0, data?.trend),
            }))
            .sort((a, b) => b.priority - a.priority)
        : [];

    function calculatePriority(accuracy: number, total: number, trend?: string): number {
        let priority = 0;

        // Low accuracy = high priority
        if (accuracy < 50) priority += 40;
        else if (accuracy < 60) priority += 30;
        else if (accuracy < 70) priority += 20;
        else priority += 5;

        // Few questions = medium priority (need more practice)
        if (total < 5) priority += 15;
        else if (total < 10) priority += 10;

        // Declining trend = high priority
        if (trend === 'declining') priority += 20;
        else if (trend === 'stable' && accuracy < 70) priority += 10;

        return priority;
    }

    const getPriorityLabel = (priority: number) => {
        if (priority >= 50) return { label: 'Alta', color: 'var(--error-500)', bg: 'var(--error-50)' };
        if (priority >= 30) return { label: 'Média', color: 'var(--warning-500)', bg: 'var(--warning-50)' };
        return { label: 'Baixa', color: 'var(--success-500)', bg: 'var(--success-50)' };
    };

    const topPriorities = studyPriorities.slice(0, 5);
    const lowPriorities = studyPriorities.slice(-3).reverse();

    return (
        <div className="page animate-fade-in">
            <header className="page-header">
                <h1 className="page-title">
                    <BookOpen size={32} style={{ marginRight: 12 }} />
                    Plano de Estudos
                </h1>
                <p className="page-subtitle">
                    Recomendações personalizadas baseadas no seu desempenho
                </p>
            </header>

            {!hasData ? (
                <div className="card text-center" style={{ padding: 'var(--spacing-16)' }}>
                    <Brain size={64} color="var(--text-tertiary)" style={{ margin: '0 auto var(--spacing-4)' }} />
                    <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Comece a Praticar!</h3>
                    <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-6)' }}>
                        Complete alguns simulados para receber recomendações personalizadas
                    </p>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate('/simulado/novo')}
                    >
                        <Zap size={20} />
                        Iniciar Primeiro Simulado
                    </button>
                </div>
            ) : (
                <>
                    {/* Quick Actions */}
                    <div className="card" style={{
                        marginBottom: 'var(--spacing-8)',
                        background: 'linear-gradient(135deg, var(--primary-50), var(--secondary-50))',
                        border: 'none',
                    }}>
                        <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--spacing-4)' }}>
                            <div>
                                <h3 style={{ margin: '0 0 var(--spacing-1) 0', fontSize: 'var(--font-size-lg)' }}>
                                    Próximo Passo Recomendado
                                </h3>
                                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                                    {topPriorities.length > 0 && topPriorities[0].accuracy < 60
                                        ? `Faça um simulado focado em ${THEME_LABELS[topPriorities[0].theme]}`
                                        : 'Continue praticando com simulados mistos'
                                    }
                                </p>
                            </div>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => navigate('/simulado/novo')}
                            >
                                <Zap size={20} />
                                Iniciar Simulado
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Insights */}
                    {recommendations.length > 0 && (
                        <div className="card" style={{ marginBottom: 'var(--spacing-8)' }}>
                            <h3 className="card-title mb-4">
                                <Lightbulb size={20} style={{ marginRight: 8 }} />
                                Insights Personalizados
                            </h3>
                            <div className="flex flex-col gap-3">
                                {recommendations.map((rec, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: 'var(--spacing-4)',
                                            background: rec.type === 'priority' ? 'var(--error-50)' :
                                                rec.type === 'celebrate' ? 'var(--success-50)' :
                                                    rec.type === 'review' ? 'var(--warning-50)' : 'var(--primary-50)',
                                            borderRadius: 'var(--radius-lg)',
                                            borderLeft: `4px solid ${rec.type === 'priority' ? 'var(--error-500)' :
                                                    rec.type === 'celebrate' ? 'var(--success-500)' :
                                                        rec.type === 'review' ? 'var(--warning-500)' : 'var(--primary-500)'
                                                }`,
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            {rec.type === 'priority' && <AlertTriangle size={20} color="var(--error-500)" />}
                                            {rec.type === 'celebrate' && <Award size={20} color="var(--success-500)" />}
                                            {rec.type === 'maintain' && <TrendingUp size={20} color="var(--primary-500)" />}
                                            {rec.type === 'review' && <Target size={20} color="var(--warning-500)" />}
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>
                                                    {rec.message}
                                                </p>
                                                <p style={{
                                                    margin: 'var(--spacing-1) 0 0 0',
                                                    fontSize: 'var(--font-size-sm)',
                                                    color: 'var(--text-secondary)',
                                                }}>
                                                    💡 {rec.suggestedAction}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Study Priorities */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: 'var(--spacing-6)',
                        marginBottom: 'var(--spacing-8)',
                    }}>
                        {/* High Priority */}
                        <div className="card" style={{ borderTop: '4px solid var(--error-500)' }}>
                            <h3 className="card-title mb-4">
                                <AlertTriangle size={20} color="var(--error-500)" style={{ marginRight: 8 }} />
                                Prioridade Alta - Estudar Mais
                            </h3>
                            <div className="flex flex-col gap-3">
                                {topPriorities.slice(0, 3).map(item => {
                                    const priorityInfo = getPriorityLabel(item.priority);
                                    return (
                                        <div
                                            key={item.theme}
                                            style={{
                                                padding: 'var(--spacing-4)',
                                                background: priorityInfo.bg,
                                                borderRadius: 'var(--radius-lg)',
                                                borderLeft: `4px solid ${THEME_COLORS[item.theme]}`,
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span style={{ fontWeight: 500 }}>{THEME_LABELS[item.theme]}</span>
                                                <span
                                                    className="badge"
                                                    style={{
                                                        background: `${priorityInfo.color}20`,
                                                        color: priorityInfo.color,
                                                    }}
                                                >
                                                    {priorityInfo.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4" style={{ fontSize: 'var(--font-size-sm)' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>
                                                    Aproveitamento: <strong style={{ color: item.accuracy < 60 ? 'var(--error-600)' : 'var(--warning-600)' }}>{item.accuracy.toFixed(0)}%</strong>
                                                </span>
                                                <span style={{ color: 'var(--text-tertiary)' }}>
                                                    {item.total} questões
                                                </span>
                                            </div>
                                            <div className="progress-bar" style={{ marginTop: 'var(--spacing-2)', height: 6 }}>
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{
                                                        width: `${item.accuracy}%`,
                                                        background: THEME_COLORS[item.theme],
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Maintain */}
                        <div className="card" style={{ borderTop: '4px solid var(--success-500)' }}>
                            <h3 className="card-title mb-4">
                                <CheckCircle2 size={20} color="var(--success-500)" style={{ marginRight: 8 }} />
                                Manter - Revisão Periódica
                            </h3>
                            {lowPriorities.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {lowPriorities.map(item => (
                                        <div
                                            key={item.theme}
                                            style={{
                                                padding: 'var(--spacing-4)',
                                                background: 'var(--success-50)',
                                                borderRadius: 'var(--radius-lg)',
                                                borderLeft: `4px solid ${THEME_COLORS[item.theme]}`,
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span style={{ fontWeight: 500 }}>{THEME_LABELS[item.theme]}</span>
                                                <span className="badge badge-success">
                                                    {item.accuracy.toFixed(0)}%
                                                </span>
                                            </div>
                                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                                                Bom desempenho! Continue revisando periodicamente.
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-tertiary)', textAlign: 'center' }}>
                                    Continue praticando para identificar áreas dominadas
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Study Tips */}
                    <div className="card">
                        <h3 className="card-title mb-4">
                            <Brain size={20} style={{ marginRight: 8 }} />
                            Dicas de Estudo
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: 'var(--spacing-4)',
                        }}>
                            <div style={{
                                padding: 'var(--spacing-4)',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-lg)',
                            }}>
                                <h4 style={{
                                    margin: '0 0 var(--spacing-2) 0',
                                    fontSize: 'var(--font-size-base)',
                                    color: 'var(--primary-600)',
                                }}>
                                    📚 Foque nas Lacunas
                                </h4>
                                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                                    Dedique mais tempo às áreas com baixo aproveitamento. Use simulados focados.
                                </p>
                            </div>
                            <div style={{
                                padding: 'var(--spacing-4)',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-lg)',
                            }}>
                                <h4 style={{
                                    margin: '0 0 var(--spacing-2) 0',
                                    fontSize: 'var(--font-size-base)',
                                    color: 'var(--secondary-600)',
                                }}>
                                    🔄 Revisão Espaçada
                                </h4>
                                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                                    Revise questões erradas após 1, 3 e 7 dias. Isso fortalece a memória de longo prazo.
                                </p>
                            </div>
                            <div style={{
                                padding: 'var(--spacing-4)',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-lg)',
                            }}>
                                <h4 style={{
                                    margin: '0 0 var(--spacing-2) 0',
                                    fontSize: 'var(--font-size-base)',
                                    color: 'var(--success-600)',
                                }}>
                                    ⏱️ Simule a Prova
                                </h4>
                                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                                    Faça simulados completos (90 questões) para treinar resistência e gestão de tempo.
                                </p>
                            </div>
                            <div style={{
                                padding: 'var(--spacing-4)',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-lg)',
                            }}>
                                <h4 style={{
                                    margin: '0 0 var(--spacing-2) 0',
                                    fontSize: 'var(--font-size-base)',
                                    color: 'var(--warning-600)',
                                }}>
                                    📖 Estude as Explicações
                                </h4>
                                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                                    Leia as explicações de todas as questões, inclusive as que você acertou.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
