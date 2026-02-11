import { useState, useMemo } from 'react';
import { THEME_LABELS, THEME_COLORS } from '../types';
import { examTrends } from '../data/examTrends';
import { THEME_SUBDIVISIONS_V2, SubthemeCategory } from '../db/taxonomy_definitions';
import { questionsOriginais } from '../db/questions_originais';
import { questionsTreaty } from '../db/questions_treaty';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    BarChart2,
    Calendar,
    Zap,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function TrendsPage() {
    const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
    const [expandedTheme, setExpandedTheme] = useState<string | null>(null);

    // Dynamically compute summary stats from data
    const mostAskedTheme = [...examTrends].sort((a, b) => b.totalQuestions - a.totalQuestions)[0];
    const risingThemes = examTrends.filter(t => t.trend === 'rising').sort((a, b) => b.probability - a.probability);
    const topRising = risingThemes.length > 0
        ? risingThemes.slice(0, 2).map(t => THEME_LABELS[t.theme].split(' ')[0]).join('/')
        : '—';
    const totalQuestionsAll = examTrends.reduce((sum, t) => sum + t.totalQuestions, 0);
    const avgPerYear = Math.round(totalQuestionsAll / years.length);

    // Compute subtheme counts from real question data
    const subthemeCounts = useMemo(() => {
        const allQuestions = [...questionsOriginais, ...questionsTreaty];
        const counts: Record<string, Record<string, number>> = {};
        allQuestions.forEach(q => {
            const theme = q.theme;
            const sub = (q as any).subtheme;
            if (theme && sub) {
                if (!counts[theme]) counts[theme] = {};
                counts[theme][sub] = (counts[theme][sub] || 0) + 1;
            }
        });
        return counts;
    }, []);

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

    const toggleTheme = (theme: string) => {
        setExpandedTheme(prev => prev === theme ? null : theme);
    };

    return (
        <div className="page animate-fade-in">
            <header className="page-header">
                <h1 className="page-title">
                    <BarChart2 size={32} style={{ marginRight: 12 }} />
                    Tendências da Prova
                </h1>
                <p className="page-subtitle">
                    Análise profunda do que cai na prova baseada nos exames de 2019 a 2025
                </p>
            </header>

            {/* Overview Cards */}
            <div className="stats-grid" style={{ marginBottom: 'var(--spacing-8)' }}>
                <div className="stat-card">
                    <Zap size={24} color="var(--warning-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value">{THEME_LABELS[mostAskedTheme.theme]}</div>
                    <div className="stat-label">Tema Mais Cobrado</div>
                </div>
                <div className="stat-card">
                    <TrendingUp size={24} color="var(--success-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value">{topRising}</div>
                    <div className="stat-label">Tendência de Alta</div>
                </div>
                <div className="stat-card">
                    <Calendar size={24} color="var(--primary-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value">{avgPerYear}</div>
                    <div className="stat-label">Questões Média/Ano</div>
                </div>
            </div>

            {/* Main Chart */}
            <div className="card" style={{ marginBottom: 'var(--spacing-8)' }}>
                <h3 className="card-title mb-4">Evolução dos Temas (2019-2025)</h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                    Observe como certos temas (Neurociências, Ética/Forense) ganharam relevância nas últimas edições.
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
                            {examTrends.slice(0, 5).map((trend) => (
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

            {/* Detailed Analysis with Expandable Subtopics */}
            <div className="card">
                <h3 className="card-title mb-4">Matriz de Relevância Estratégica</h3>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                    Clique em um tema para ver seus subtemas e a distribuição de questões.
                </p>
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
                                const isExpanded = expandedTheme === item.theme;
                                const categories: SubthemeCategory[] = THEME_SUBDIVISIONS_V2[item.theme] || [];
                                const totalTopics = categories.reduce((sum, cat) => sum + cat.topics.length, 0);
                                const themeSubs = subthemeCounts[item.theme] || {};

                                return (
                                    <>
                                        <tr
                                            key={item.theme}
                                            onClick={() => toggleTheme(item.theme)}
                                            style={{
                                                borderBottom: isExpanded ? 'none' : '1px solid var(--border-color)',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s ease',
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                        >
                                            <td style={{ padding: 'var(--spacing-3)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                                    {isExpanded
                                                        ? <ChevronDown size={16} color="var(--primary-500)" />
                                                        : <ChevronRight size={16} color="var(--text-tertiary)" />
                                                    }
                                                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: THEME_COLORS[item.theme], flexShrink: 0 }} />
                                                    <span style={{ fontWeight: isExpanded ? 600 : 400 }}>
                                                        {THEME_LABELS[item.theme]}
                                                    </span>
                                                    <span style={{
                                                        fontSize: 'var(--font-size-xs)',
                                                        color: 'var(--text-tertiary)',
                                                        marginLeft: 'var(--spacing-1)',
                                                    }}>
                                                        ({categories.length} categorias · {totalTopics} tópicos)
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center', padding: 'var(--spacing-3)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-1)' }}>
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
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-2)' }}>
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
                                        {/* Expanded 3-Level Subtopics */}
                                        {isExpanded && (
                                            <tr key={`${item.theme}-subs`} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td colSpan={5} style={{ padding: 0 }}>
                                                    <div style={{
                                                        background: 'var(--bg-secondary)',
                                                        borderLeft: `3px solid ${THEME_COLORS[item.theme]}`,
                                                        padding: 'var(--spacing-4)',
                                                        margin: '0 var(--spacing-3) var(--spacing-2) var(--spacing-3)',
                                                        borderRadius: 'var(--radius-md)',
                                                    }}>
                                                        {categories.map((cat, catIdx) => {
                                                            const catTopicCount = cat.topics.reduce((s, t) => s + (themeSubs[t] || 0), 0);
                                                            return (
                                                                <div key={cat.label} style={{ marginBottom: catIdx < categories.length - 1 ? 'var(--spacing-4)' : 0 }}>
                                                                    <div style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 'var(--spacing-2)',
                                                                        marginBottom: 'var(--spacing-2)',
                                                                    }}>
                                                                        <span style={{
                                                                            fontSize: 'var(--font-size-xs)',
                                                                            fontWeight: 700,
                                                                            color: THEME_COLORS[item.theme],
                                                                            textTransform: 'uppercase',
                                                                            letterSpacing: '0.04em',
                                                                        }}>
                                                                            {cat.label}
                                                                        </span>
                                                                        <span style={{
                                                                            fontSize: '10px',
                                                                            color: 'var(--text-tertiary)',
                                                                            fontWeight: 500,
                                                                        }}>
                                                                            ({cat.topics.length} tópicos{catTopicCount > 0 ? ` · ${catTopicCount} questões` : ''})
                                                                        </span>
                                                                    </div>
                                                                    <div style={{
                                                                        display: 'grid',
                                                                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                                                        gap: 'var(--spacing-1)',
                                                                    }}>
                                                                        {cat.topics.map(topic => {
                                                                            const count = themeSubs[topic] || 0;
                                                                            return (
                                                                                <div
                                                                                    key={topic}
                                                                                    style={{
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        justifyContent: 'space-between',
                                                                                        padding: '4px var(--spacing-2)',
                                                                                        borderRadius: 'var(--radius-sm)',
                                                                                        background: 'var(--bg-primary)',
                                                                                        fontSize: 'var(--font-size-xs)',
                                                                                        border: '1px solid var(--border-color)',
                                                                                    }}
                                                                                >
                                                                                    <span style={{ color: 'var(--text-primary)' }}>
                                                                                        {topic}
                                                                                    </span>
                                                                                    <span style={{
                                                                                        background: count > 0 ? THEME_COLORS[item.theme] + '20' : 'var(--bg-tertiary)',
                                                                                        color: count > 0 ? THEME_COLORS[item.theme] : 'var(--text-tertiary)',
                                                                                        padding: '1px 6px',
                                                                                        borderRadius: 'var(--radius-full)',
                                                                                        fontSize: '10px',
                                                                                        fontWeight: 600,
                                                                                        minWidth: 20,
                                                                                        textAlign: 'center',
                                                                                    }}>
                                                                                        {count}
                                                                                    </span>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    {catIdx < categories.length - 1 && (
                                                                        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginTop: 'var(--spacing-3)' }} />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
