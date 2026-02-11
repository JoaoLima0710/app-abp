import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import {
    TrendingUp,
    Target,
    Clock,
    Award,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Zap
} from 'lucide-react';
import { THEME_LABELS, THEME_COLORS } from '../types';

export default function Dashboard() {
    const navigate = useNavigate();
    const { simulations, progress, recommendations } = useUserStore();

    const recentSimulations = simulations.slice(0, 5);

    return (
        <div className="page animate-fade-in">
            <header className="page-header animate-slide-down">
                <h1 className="page-title" style={{ marginBottom: 'var(--spacing-1)', color: 'var(--text-primary)' }}>Dashboard</h1>
                <p className="text-body-sm" style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    Acompanhe seu progresso na preparação para a Prova de Título
                </p>
            </header>

            {/* Quick Actions */}
            <section style={{ marginBottom: 'var(--spacing-6)' }}>
                <button
                    className="btn btn-primary btn-lg btn-cta"
                    onClick={() => navigate('/simulado/novo')}
                >
                    <Zap size={18} />
                    Iniciar Novo Simulado
                    <ArrowRight size={16} />
                </button>
            </section>

            {/* Stats Grid - 2x2 on mobile */}
            <section className="stats-grid animate-stagger" style={{ marginBottom: 'var(--spacing-6)' }}>
                <div className="stat-card hover-lift">
                    <div className="stat-value">{progress?.totalSimulations || 0}</div>
                    <div className="stat-label">Simulados Realizados</div>
                </div>
                <div className="stat-card hover-lift">
                    <div className="stat-value">{progress?.totalQuestionsAnswered || 0}</div>
                    <div className="stat-label">Questões Respondidas</div>
                </div>
                <div className="stat-card hover-lift">
                    <div className="stat-value" style={{
                        background: progress?.overallAccuracy && progress.overallAccuracy >= 70
                            ? 'linear-gradient(135deg, var(--success-500), var(--success-400))'
                            : progress?.overallAccuracy && progress.overallAccuracy >= 50
                                ? 'linear-gradient(135deg, var(--warning-500), var(--warning-400))'
                                : 'linear-gradient(135deg, var(--error-500), var(--error-400))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        {progress?.overallAccuracy?.toFixed(0) || 0}%
                    </div>
                    <div className="stat-label">Aproveitamento Geral</div>
                </div>
                <div className="stat-card hover-lift">
                    <div className="stat-value">
                        {progress?.trends.strongThemes.length || 0}
                    </div>
                    <div className="stat-label">Áreas Fortes</div>
                </div>
            </section>

            <div className="dashboard-cards-grid">
                {/* Recommendations */}
                <section className="card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <Target size={18} style={{ marginRight: 6 }} />
                            Recomendações
                        </h3>
                    </div>

                    {recommendations.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {recommendations.map((rec, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-3"
                                    style={{
                                        padding: 'var(--spacing-3)',
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-lg)',
                                    }}
                                >
                                    {rec.type === 'priority' && <AlertCircle size={18} color="var(--error-500)" />}
                                    {rec.type === 'celebrate' && <Award size={18} color="var(--success-500)" />}
                                    {rec.type === 'maintain' && <TrendingUp size={18} color="var(--primary-500)" />}
                                    {rec.type === 'review' && <Clock size={18} color="var(--warning-500)" />}
                                    <div style={{ flex: 1 }}>
                                        <p style={{
                                            fontSize: 'var(--font-size-sm)',
                                            margin: 0,
                                            color: 'var(--text-primary)',
                                        }}>
                                            {rec.message}
                                        </p>
                                        <p style={{
                                            fontSize: 'var(--font-size-xs)',
                                            color: 'var(--text-tertiary)',
                                            margin: 'var(--spacing-1) 0 0 0',
                                        }}>
                                            {rec.suggestedAction}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center" style={{ padding: 'var(--spacing-6)' }}>
                            <p style={{ color: 'var(--text-tertiary)', margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                Complete alguns simulados para receber recomendações personalizadas
                            </p>
                        </div>
                    )}
                </section>

                {/* Recent Simulations */}
                <section className="card">
                    <div className="card-header">
                        <h3 className="card-title">
                            <Clock size={18} style={{ marginRight: 6 }} />
                            Simulados Recentes
                        </h3>
                    </div>

                    {recentSimulations.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {recentSimulations.map((sim) => (
                                <div
                                    key={sim.id}
                                    className="flex items-center justify-between"
                                    style={{
                                        padding: 'var(--spacing-3) var(--spacing-4)',
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-lg)',
                                    }}
                                >
                                    <div>
                                        <p style={{
                                            fontSize: 'var(--font-size-sm)',
                                            fontWeight: 500,
                                            margin: 0,
                                        }}>
                                            {sim.questionCount} questões
                                            {sim.focusTheme && (
                                                <span className="theme-tag" style={{ marginLeft: 8 }}>
                                                    <span
                                                        className="theme-tag-dot"
                                                        style={{ background: THEME_COLORS[sim.focusTheme] }}
                                                    />
                                                    {THEME_LABELS[sim.focusTheme]}
                                                </span>
                                            )}
                                        </p>
                                        <p style={{
                                            fontSize: 'var(--font-size-xs)',
                                            color: 'var(--text-tertiary)',
                                            margin: 0,
                                        }}>
                                            {new Date(sim.createdAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {sim.completedAt ? (
                                            <>
                                                <span
                                                    className={`badge ${sim.stats.accuracy >= 70 ? 'badge-success' : sim.stats.accuracy >= 50 ? 'badge-warning' : 'badge-error'}`}
                                                >
                                                    {sim.stats.accuracy.toFixed(0)}%
                                                </span>
                                                <CheckCircle2 size={16} color="var(--success-500)" />
                                            </>
                                        ) : (
                                            <span className="badge badge-neutral">Em andamento</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center" style={{ padding: 'var(--spacing-6)' }}>
                            <p style={{ color: 'var(--text-tertiary)', margin: 0, fontSize: 'var(--font-size-sm)' }}>
                                Nenhum simulado realizado ainda
                            </p>
                            <button
                                className="btn btn-primary mt-4"
                                onClick={() => navigate('/simulado/novo')}
                                style={{ fontSize: 'var(--font-size-sm)' }}
                            >
                                Começar Primeiro Simulado
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* Theme Performance Overview */}
            {progress && Object.keys(progress.byTheme).length > 0 && (
                <section className="card" style={{ marginTop: 'var(--spacing-6)' }}>
                    <div className="card-header">
                        <h3 className="card-title">
                            <TrendingUp size={18} style={{ marginRight: 6 }} />
                            Desempenho por Área
                        </h3>
                    </div>

                    <div className="theme-performance-grid">
                        {Object.entries(progress.byTheme).map(([theme, data]) => (
                            <div
                                key={theme}
                                style={{
                                    padding: 'var(--spacing-3)',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-lg)',
                                    borderLeft: `3px solid ${THEME_COLORS[theme as keyof typeof THEME_COLORS]}`,
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span style={{
                                        fontSize: 'var(--font-size-sm)',
                                        fontWeight: 500,
                                    }}>
                                        {THEME_LABELS[theme as keyof typeof THEME_LABELS]}
                                    </span>
                                    <span
                                        className={`badge ${data && data.accuracy >= 70 ? 'badge-success' :
                                                data && data.accuracy >= 50 ? 'badge-warning' : 'badge-error'
                                            }`}
                                    >
                                        {data?.accuracy.toFixed(0)}%
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${data?.accuracy || 0}%`,
                                            background: THEME_COLORS[theme as keyof typeof THEME_COLORS],
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                                        {data?.correctAnswers}/{data?.totalAttempts} corretas
                                    </span>
                                    {data?.trend === 'improving' && (
                                        <TrendingUp size={14} color="var(--success-500)" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
