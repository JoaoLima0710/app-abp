import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { THEME_LABELS, THEME_COLORS } from '../types';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Minus,
    Target,
    Calendar,
    Award
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';

export default function StatisticsPanel() {
    const { simulations, progress, loadUserData } = useUserStore();

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    const completedSims = simulations.filter(s => s.completedAt);

    // Prepare evolution data
    const evolutionData = completedSims
        .slice(-20)
        .reverse()
        .map((sim, idx) => ({
            name: `#${idx + 1}`,
            accuracy: sim.stats.accuracy,
            date: new Date(sim.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        }));

    // Theme performance data for bar chart
    const themePerformanceData = progress?.byTheme
        ? Object.entries(progress.byTheme)
            .map(([theme, data]) => ({
                name: THEME_LABELS[theme as keyof typeof THEME_LABELS].split(' ')[0],
                fullName: THEME_LABELS[theme as keyof typeof THEME_LABELS],
                accuracy: data?.accuracy || 0,
                total: data?.totalAttempts || 0,
                color: THEME_COLORS[theme as keyof typeof THEME_COLORS],
            }))
            .sort((a, b) => b.accuracy - a.accuracy)
        : [];

    const getTrendIcon = (trend?: 'improving' | 'stable' | 'declining') => {
        switch (trend) {
            case 'improving':
                return <TrendingUp size={16} color="var(--success-500)" />;
            case 'declining':
                return <TrendingDown size={16} color="var(--error-500)" />;
            default:
                return <Minus size={16} color="var(--gray-400)" />;
        }
    };

    return (
        <div className="page animate-fade-in">
            <header className="page-header">
                <h1 className="page-title">
                    <BarChart3 size={32} style={{ marginRight: 12 }} />
                    Estatísticas
                </h1>
                <p className="page-subtitle">
                    Análise detalhada do seu desempenho ao longo do tempo
                </p>
            </header>

            {completedSims.length === 0 ? (
                <div className="card text-center" style={{ padding: 'var(--spacing-16)' }}>
                    <Target size={64} color="var(--text-tertiary)" style={{ margin: '0 auto var(--spacing-4)' }} />
                    <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Nenhum dado disponível</h3>
                    <p style={{ color: 'var(--text-tertiary)' }}>
                        Complete alguns simulados para ver suas estatísticas
                    </p>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="stats-grid" style={{ marginBottom: 'var(--spacing-8)' }}>
                        <div className="stat-card">
                            <Calendar size={24} color="var(--primary-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                            <div className="stat-value">{completedSims.length}</div>
                            <div className="stat-label">Simulados Completos</div>
                        </div>
                        <div className="stat-card">
                            <Target size={24} color="var(--secondary-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                            <div className="stat-value">{progress?.totalQuestionsAnswered || 0}</div>
                            <div className="stat-label">Questões Respondidas</div>
                        </div>
                        <div className="stat-card">
                            <Award size={24} color="var(--success-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                            <div className="stat-value">{progress?.overallAccuracy?.toFixed(1) || 0}%</div>
                            <div className="stat-label">Aproveitamento Geral</div>
                        </div>
                        <div className="stat-card">
                            {getTrendIcon(progress?.trends.overallTrend)}
                            <div className="stat-value" style={{ marginTop: 'var(--spacing-2)' }}>
                                {progress?.trends.overallTrend === 'improving' ? 'Melhorando' :
                                    progress?.trends.overallTrend === 'declining' ? 'Caindo' : 'Estável'}
                            </div>
                            <div className="stat-label">Tendência Geral</div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                        gap: 'var(--spacing-6)',
                        marginBottom: 'var(--spacing-8)',
                    }}>
                        {/* Evolution Chart */}
                        <div className="card">
                            <h3 className="card-title mb-4">
                                <TrendingUp size={20} style={{ marginRight: 8 }} />
                                Evolução do Desempenho
                            </h3>
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={evolutionData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="var(--text-tertiary)"
                                            fontSize={12}
                                        />
                                        <YAxis
                                            domain={[0, 100]}
                                            stroke="var(--text-tertiary)"
                                            fontSize={12}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: 'var(--radius-lg)',
                                            }}
                                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Aproveitamento']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="accuracy"
                                            stroke="var(--primary-500)"
                                            strokeWidth={3}
                                            dot={{ fill: 'var(--primary-500)', strokeWidth: 2 }}
                                            activeDot={{ r: 8, fill: 'var(--primary-600)' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Theme Performance Chart */}
                        <div className="card">
                            <h3 className="card-title mb-4">
                                <BarChart3 size={20} style={{ marginRight: 8 }} />
                                Desempenho por Área
                            </h3>
                            <div style={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={themePerformanceData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                        <XAxis
                                            type="number"
                                            domain={[0, 100]}
                                            stroke="var(--text-tertiary)"
                                            fontSize={12}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            width={80}
                                            stroke="var(--text-tertiary)"
                                            fontSize={11}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: 'var(--radius-lg)',
                                            }}
                                            formatter={(value: number, _name: string, props: any) => [
                                                `${value.toFixed(1)}%`,
                                                props.payload.fullName
                                            ]}
                                        />
                                        <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                                            {themePerformanceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Theme Stats */}
                    <div className="card">
                        <h3 className="card-title mb-4">Análise Detalhada por Área</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: 'var(--font-size-sm)',
                            }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                        <th style={{ textAlign: 'left', padding: 'var(--spacing-3)', color: 'var(--text-secondary)' }}>
                                            Área Temática
                                        </th>
                                        <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', color: 'var(--text-secondary)' }}>
                                            Questões
                                        </th>
                                        <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', color: 'var(--text-secondary)' }}>
                                            Acertos
                                        </th>
                                        <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', color: 'var(--text-secondary)' }}>
                                            Aproveitamento
                                        </th>
                                        <th style={{ textAlign: 'center', padding: 'var(--spacing-3)', color: 'var(--text-secondary)' }}>
                                            Tendência
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(progress?.byTheme || {}).map(([theme, data]) => (
                                        <tr
                                            key={theme}
                                            style={{ borderBottom: '1px solid var(--border-color)' }}
                                        >
                                            <td style={{ padding: 'var(--spacing-3)' }}>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        style={{
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: '50%',
                                                            background: THEME_COLORS[theme as keyof typeof THEME_COLORS],
                                                        }}
                                                    />
                                                    {THEME_LABELS[theme as keyof typeof THEME_LABELS]}
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>
                                                {data?.totalAttempts || 0}
                                            </td>
                                            <td style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>
                                                {data?.correctAnswers || 0}
                                            </td>
                                            <td style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>
                                                <span className={`badge ${(data?.accuracy || 0) >= 70 ? 'badge-success' :
                                                        (data?.accuracy || 0) >= 50 ? 'badge-warning' : 'badge-error'
                                                    }`}>
                                                    {data?.accuracy?.toFixed(1) || 0}%
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>
                                                <div className="flex items-center justify-center gap-1">
                                                    {getTrendIcon(data?.trend)}
                                                    <span style={{
                                                        fontSize: 'var(--font-size-xs)',
                                                        color: data?.trend === 'improving' ? 'var(--success-600)' :
                                                            data?.trend === 'declining' ? 'var(--error-600)' : 'var(--gray-500)',
                                                    }}>
                                                        {data?.trend === 'improving' ? 'Melhorando' :
                                                            data?.trend === 'declining' ? 'Caindo' : 'Estável'}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Strong and Weak Areas */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 'var(--spacing-6)',
                        marginTop: 'var(--spacing-6)',
                    }}>
                        {/* Strong Themes */}
                        <div className="card" style={{ borderTop: '4px solid var(--success-500)' }}>
                            <h3 className="card-title mb-4" style={{ color: 'var(--success-600)' }}>
                                <Award size={20} style={{ marginRight: 8 }} />
                                Áreas Fortes
                            </h3>
                            {progress?.trends.strongThemes && progress.trends.strongThemes.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {progress.trends.strongThemes.map(theme => (
                                        <div
                                            key={theme}
                                            className="flex items-center gap-3"
                                            style={{
                                                padding: 'var(--spacing-3)',
                                                background: 'var(--success-50)',
                                                borderRadius: 'var(--radius-lg)',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    background: THEME_COLORS[theme],
                                                }}
                                            />
                                            <span style={{ flex: 1 }}>{THEME_LABELS[theme]}</span>
                                            <span className="badge badge-success">
                                                {progress.byTheme[theme]?.accuracy?.toFixed(0)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-tertiary)', textAlign: 'center' }}>
                                    Continue praticando para identificar suas áreas fortes
                                </p>
                            )}
                        </div>

                        {/* Weak Themes */}
                        <div className="card" style={{ borderTop: '4px solid var(--error-500)' }}>
                            <h3 className="card-title mb-4" style={{ color: 'var(--error-600)' }}>
                                <Target size={20} style={{ marginRight: 8 }} />
                                Áreas para Melhorar
                            </h3>
                            {progress?.trends.weakThemes && progress.trends.weakThemes.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                    {progress.trends.weakThemes.map(theme => (
                                        <div
                                            key={theme}
                                            className="flex items-center gap-3"
                                            style={{
                                                padding: 'var(--spacing-3)',
                                                background: 'var(--error-50)',
                                                borderRadius: 'var(--radius-lg)',
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    background: THEME_COLORS[theme],
                                                }}
                                            />
                                            <span style={{ flex: 1 }}>{THEME_LABELS[theme]}</span>
                                            <span className="badge badge-error">
                                                {progress.byTheme[theme]?.accuracy?.toFixed(0)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ color: 'var(--text-tertiary)', textAlign: 'center' }}>
                                    Ótimo! Nenhuma área crítica identificada
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
