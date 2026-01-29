import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulationStore } from '../store/simulationStore';
import { useUserStore } from '../store/userStore';
import { THEME_LABELS, THEME_COLORS } from '../types';
import {
    Trophy,
    Target,
    Clock,
    CheckCircle2,
    XCircle,
    Home,
    RotateCcw,
    TrendingUp,
    Award
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function SimulationResults() {
    const navigate = useNavigate();
    const { simulation, questions, resetSimulation } = useSimulationStore();
    const { loadUserData } = useUserStore();

    useEffect(() => {
        if (!simulation?.completedAt) {
            navigate('/');
        }
        // Reload user data to update statistics
        loadUserData();
    }, [simulation, navigate, loadUserData]);

    if (!simulation) return null;

    const { stats } = simulation;

    const handleNewSimulation = () => {
        resetSimulation();
        navigate('/simulado/novo');
    };

    const handleGoHome = () => {
        resetSimulation();
        navigate('/');
    };

    // Prepare chart data
    const themeChartData = Object.entries(stats.byTheme).map(([theme, data]) => ({
        name: THEME_LABELS[theme as keyof typeof THEME_LABELS],
        value: data?.total || 0,
        correct: data?.correct || 0,
        accuracy: data?.accuracy || 0,
        color: THEME_COLORS[theme as keyof typeof THEME_COLORS],
    }));

    const scoreColor = stats.accuracy >= 70
        ? 'var(--success-500)'
        : stats.accuracy >= 50
            ? 'var(--warning-500)'
            : 'var(--error-500)';

    const getMessage = () => {
        if (stats.accuracy >= 80) return { icon: Trophy, text: 'Excelente! Você está no caminho certo!', color: 'var(--success-500)' };
        if (stats.accuracy >= 70) return { icon: Award, text: 'Muito bom! Continue praticando!', color: 'var(--success-500)' };
        if (stats.accuracy >= 60) return { icon: TrendingUp, text: 'Bom progresso! Há espaço para melhorar.', color: 'var(--warning-500)' };
        return { icon: Target, text: 'Continue estudando! A prática leva à perfeição.', color: 'var(--error-500)' };
    };

    const message = getMessage();

    return (
        <div className="page animate-fade-in">
            <header className="page-header text-center">
                <message.icon size={64} color={message.color} style={{ marginBottom: 'var(--spacing-4)' }} />
                <h1 className="page-title">Simulado Concluído!</h1>
                <p className="page-subtitle" style={{ color: message.color }}>{message.text}</p>
            </header>

            {/* Main Score */}
            <div
                className="card text-center"
                style={{
                    maxWidth: 400,
                    margin: '0 auto var(--spacing-8)',
                    background: `linear-gradient(135deg, ${scoreColor}10, var(--bg-secondary))`,
                    border: `2px solid ${scoreColor}30`,
                }}
            >
                <div style={{
                    fontSize: 'var(--font-size-5xl)',
                    fontWeight: 800,
                    color: scoreColor,
                    lineHeight: 1,
                }}>
                    {stats.accuracy.toFixed(0)}%
                </div>
                <p style={{
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--text-secondary)',
                    margin: 'var(--spacing-2) 0 0 0',
                }}>
                    de aproveitamento
                </p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid" style={{ marginBottom: 'var(--spacing-8)' }}>
                <div className="stat-card">
                    <CheckCircle2 size={32} color="var(--success-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value" style={{
                        background: 'linear-gradient(135deg, var(--success-500), var(--success-400))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        {stats.correct}
                    </div>
                    <div className="stat-label">Acertos</div>
                </div>
                <div className="stat-card">
                    <XCircle size={32} color="var(--error-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value" style={{
                        background: 'linear-gradient(135deg, var(--error-500), var(--error-400))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        {stats.incorrect}
                    </div>
                    <div className="stat-label">Erros</div>
                </div>
                <div className="stat-card">
                    <Target size={32} color="var(--primary-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value">{stats.totalQuestions}</div>
                    <div className="stat-label">Total de Questões</div>
                </div>
                <div className="stat-card">
                    <Clock size={32} color="var(--secondary-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value">{stats.avgTimePerQuestion.toFixed(0)}s</div>
                    <div className="stat-label">Tempo Médio / Questão</div>
                </div>
            </div>

            {/* Performance by Theme */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: 'var(--spacing-6)',
                marginBottom: 'var(--spacing-8)',
            }}>
                {/* Chart */}
                <div className="card">
                    <h3 className="card-title mb-4">Distribuição por Área</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={themeChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {themeChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name, props) => [
                                        `${props.payload.correct}/${value} (${props.payload.accuracy.toFixed(0)}%)`,
                                        name
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Theme Details */}
                <div className="card">
                    <h3 className="card-title mb-4">Desempenho por Área</h3>
                    <div className="flex flex-col gap-3">
                        {Object.entries(stats.byTheme).map(([theme, data]) => (
                            <div
                                key={theme}
                                style={{
                                    padding: 'var(--spacing-3)',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-lg)',
                                    borderLeft: `4px solid ${THEME_COLORS[theme as keyof typeof THEME_COLORS]}`,
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                                        {THEME_LABELS[theme as keyof typeof THEME_LABELS]}
                                    </span>
                                    <span className={`badge ${(data?.accuracy || 0) >= 70 ? 'badge-success' :
                                            (data?.accuracy || 0) >= 50 ? 'badge-warning' : 'badge-error'
                                        }`}>
                                        {data?.correct}/{data?.total} ({data?.accuracy.toFixed(0)}%)
                                    </span>
                                </div>
                                <div className="progress-bar" style={{ height: 6 }}>
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${data?.accuracy || 0}%`,
                                            background: THEME_COLORS[theme as keyof typeof THEME_COLORS],
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Missed Questions Review */}
            {stats.incorrect > 0 && (
                <div className="card" style={{ marginBottom: 'var(--spacing-8)' }}>
                    <h3 className="card-title mb-4">
                        <XCircle size={20} color="var(--error-500)" style={{ marginRight: 8 }} />
                        Questões para Revisar ({stats.incorrect})
                    </h3>
                    <div className="flex flex-col gap-3">
                        {simulation.questions.map((sq, idx) => {
                            if (sq.isCorrect !== false) return null;
                            const q = questions[idx];
                            if (!q) return null;

                            return (
                                <div
                                    key={sq.questionId}
                                    style={{
                                        padding: 'var(--spacing-4)',
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-lg)',
                                        borderLeft: '4px solid var(--error-500)',
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 'var(--radius-md)',
                                                background: 'var(--error-100)',
                                                color: 'var(--error-700)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 'var(--font-size-sm)',
                                                fontWeight: 600,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {idx + 1}
                                        </span>
                                        <div style={{ flex: 1 }}>
                                            <p style={{
                                                fontSize: 'var(--font-size-sm)',
                                                color: 'var(--text-primary)',
                                                margin: '0 0 var(--spacing-2) 0',
                                                lineHeight: 1.5,
                                            }}>
                                                {q.statement.length > 150 ? q.statement.substring(0, 150) + '...' : q.statement}
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--error-600)' }}>
                                                    Sua resposta: {sq.userAnswer}
                                                </span>
                                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--success-600)' }}>
                                                    Correta: {q.correctAnswer}
                                                </span>
                                                <span
                                                    className="theme-tag"
                                                    style={{ marginLeft: 'auto' }}
                                                >
                                                    <span
                                                        className="theme-tag-dot"
                                                        style={{ background: THEME_COLORS[q.theme] }}
                                                    />
                                                    {THEME_LABELS[q.theme]}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
                <button className="btn btn-secondary btn-lg" onClick={handleGoHome}>
                    <Home size={20} />
                    Voltar ao Início
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleNewSimulation}>
                    <RotateCcw size={20} />
                    Novo Simulado
                </button>
            </div>
        </div>
    );
}
