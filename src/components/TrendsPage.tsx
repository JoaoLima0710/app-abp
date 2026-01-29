import { THEME_LABELS, THEME_COLORS } from '../types';
import { examTrends } from '../data/examTrends';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    BarChart2,
    Calendar,
    AlertTriangle,
    Zap,
    Search
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
    Cell,
    ReferenceLine
} from 'recharts';

export default function TrendsPage() {
    const years = ['2019', '2020', '2021', '2022.1', '2022.2', '2023.1', '2023.2', '2024'];

    const getTrendIcon = (trend: 'rising' | 'stable' | 'declining') => {
        switch (trend) {
            case 'rising': return <TrendingUp size={16} color="var(--success-500)" />;
            case 'declining': return <TrendingDown size={16} color="var(--error-500)" />;
            default: return <Minus size={16} color="var(--gray-400)" />;
        }
    };

    // Convert data for line chart
    const lineChartData = years.map(year => {
        const entry: any = { name: year };
        examTrends.forEach(t => {
            entry[THEME_LABELS[t.theme]] = t.yearlyFrequency[year] || 0;
        });
        return entry;
    });

    const sortedTrends = [...examTrends].sort((a, b) => b.probability - a.probability);

    return (
        <div className="page animate-fade-in">
            <header className="page-header">
                <h1 className="page-title">
                    <BarChart2 size={32} style={{ marginRight: 12 }} />
                    Tendências da Prova
                </h1>
                <p className="page-subtitle">
                    Análise profunda do que cai na prova baseada nos exames de 2019 a 2024
                </p>
            </header>

            {/* Overview Cards */}
            <div className="stats-grid" style={{ marginBottom: 'var(--spacing-8)' }}>
                <div className="stat-card">
                    <Zap size={24} color="var(--warning-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value">Psicofarmacologia</div>
                    <div className="stat-label">Tema Mais Cobrado</div>
                </div>
                <div className="stat-card">
                    <TrendingUp size={24} color="var(--success-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value">Infância/Forense</div>
                    <div className="stat-label">Tendência de Alta</div>
                </div>
                <div className="stat-card">
                    <Calendar size={24} color="var(--primary-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value">90</div>
                    <div className="stat-label">Questões Média/Ano</div>
                </div>
            </div>

            {/* Main Chart */}
            <div className="card" style={{ marginBottom: 'var(--spacing-8)' }}>
                <h3 className="card-title mb-4">Evolução dos Temas (2019-2024)</h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                    Observe como certos temas (Forense, Infância) ganharam relevância nas últimas edições.
                </p>
                <div style={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="name" fontSize={12} stroke="var(--text-tertiary)" />
                            <YAxis fontSize={12} stroke="var(--text-tertiary)" label={{ value: 'Questões', angle: -90, position: 'insideLeft' }} />
                            <Tooltip
                                contentStyle={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}
                            />
                            {examTrends.slice(0, 5).map((trend, idx) => (
                                <Line
                                    key={trend.theme}
                                    type="monotone"
                                    dataKey={THEME_LABELS[trend.theme]}
                                    stroke={THEME_COLORS[trend.theme]}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Analysis */}
            <div className="card">
                <h3 className="card-title mb-4">Matriz de Relevância Estratégica</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                <th style={{ textAlign: 'left', padding: 'var(--spacing-3)' }}>Tema</th>
                                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>Tendência</th>
                                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>Média/Prova</th>
                                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>Probabilidade 2025</th>
                                <th style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>Ação Sugerida</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTrends.map(item => {
                                const avg = item.totalQuestions / years.length;
                                return (
                                    <tr key={item.theme} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: 'var(--spacing-3)' }}>
                                            <div className="flex items-center gap-2">
                                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: THEME_COLORS[item.theme] }} />
                                                {THEME_LABELS[item.theme]}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>
                                            <div className="flex items-center justify-center gap-1">
                                                {getTrendIcon(item.trend)}
                                                <span style={{
                                                    fontSize: 'var(--font-size-xs)',
                                                    textTransform: 'capitalize',
                                                    color: item.trend === 'rising' ? 'var(--success-600)' :
                                                        item.trend === 'declining' ? 'var(--error-600)' : 'var(--gray-500)'
                                                }}>
                                                    {item.trend === 'rising' ? 'Alta' : item.trend === 'declining' ? 'Queda' : 'Estável'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>
                                            {avg.toFixed(1)}
                                        </td>
                                        <td style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="progress-bar" style={{ width: 60, height: 6 }}>
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{
                                                            width: `${item.probability}%`,
                                                            background: item.probability > 80 ? 'var(--success-500)' :
                                                                item.probability > 60 ? 'var(--warning-500)' : 'var(--gray-300)'
                                                        }}
                                                    />
                                                </div>
                                                {item.probability}%
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>
                                            {item.probability > 80 ? (
                                                <span className="badge badge-error">Prioridade Total</span>
                                            ) : item.trend === 'rising' ? (
                                                <span className="badge badge-warning">Atenção</span>
                                            ) : (
                                                <span className="badge">Revisão</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
