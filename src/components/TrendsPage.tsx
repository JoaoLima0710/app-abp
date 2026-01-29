import { useState, useMemo } from 'react';
import { THEME_LABELS, THEME_COLORS } from '../types';
import { examTrends } from '../data/examTrends';
import { useUserStore } from '../store/userStore';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    BarChart2,
    Calendar,
    Zap,
    Filter,
    Layers,
    AlertCircle,
    AlertOctagon
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

export default function TrendsPage() {
    const { progress } = useUserStore();
    const [selectedYear, setSelectedYear] = useState<string>('todos');
    const years = ['2019', '2020', '2021', '2022.1', '2022.2', '2023.1', '2023.2', '2024', '2025'];

    const getTrendIcon = (trend: 'rising' | 'stable' | 'declining') => {
        switch (trend) {
            case 'rising': return <TrendingUp size={16} color="var(--success-500)" />;
            case 'declining': return <TrendingDown size={16} color="var(--error-500)" />;
            default: return <Minus size={16} color="var(--gray-400)" />;
        }
    };

    // Filtered Data
    const filteredStats = useMemo(() => {
        if (selectedYear === 'todos') {
            return examTrends.map(t => ({
                ...t,
                currentCount: t.totalQuestions,
                displayCount: (t.totalQuestions / years.length).toFixed(1) // avg for all years
            })).sort((a, b) => b.probability - a.probability);
        }

        return examTrends.map(t => ({
            ...t,
            currentCount: t.yearlyFrequency[selectedYear] || 0,
            displayCount: t.yearlyFrequency[selectedYear] || 0
        })).sort((a, b) => (b.yearlyFrequency[selectedYear] || 0) - (a.yearlyFrequency[selectedYear] || 0));
    }, [selectedYear]);

    // Chart Data
    const chartData = useMemo(() => {
        if (selectedYear === 'todos') {
            return years.map(year => {
                const entry: any = { name: year };
                examTrends.forEach(t => {
                    entry[THEME_LABELS[t.theme]] = t.yearlyFrequency[year] || 0;
                });
                return entry;
            });
        } else {
            return filteredStats
                .filter(t => t.currentCount > 0)
                .map(t => ({
                    name: THEME_LABELS[t.theme],
                    value: t.currentCount,
                    color: THEME_COLORS[t.theme]
                }));
        }
    }, [selectedYear, filteredStats]);

    // Top Subthemes Logic (General Exam Data)
    const topSubthemes = useMemo(() => {
        const allSubthemes: { theme: string, name: string, count: number }[] = [];
        examTrends.forEach(t => {
            if (t.subthemes) {
                t.subthemes.forEach(st => {
                    let count = 0;
                    if (selectedYear === 'todos') {
                        // Sum all years
                        count = Object.values(st.yearlyFrequency).reduce((a, b) => a + b, 0);
                    } else {
                        count = st.yearlyFrequency[selectedYear] || 0;
                    }
                    if (count > 0) {
                        allSubthemes.push({
                            theme: t.theme,
                            name: st.name,
                            count
                        });
                    }
                });
            }
        });
        return allSubthemes.sort((a, b) => b.count - a.count).slice(0, 5);
    }, [selectedYear]);

    // User Weak Spots Logic (User Error Data)
    const userWeakSpots = useMemo(() => {
        if (!progress?.subthemeStats) return [];

        return Object.entries(progress.subthemeStats)
            .map(([subtheme, stats]) => ({
                name: subtheme,
                incorrect: stats.incorrect,
                total: stats.total,
                accuracy: stats.total > 0 ? ((stats.total - stats.incorrect) / stats.total) * 100 : 0
            }))
            .filter(s => s.incorrect > 0)
            .sort((a, b) => b.incorrect - a.incorrect) // Most errors first
            .slice(0, 5);
    }, [progress]);


    return (
        <div className="page animate-fade-in">
            <header className="page-header">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">
                            <BarChart2 size={32} style={{ marginRight: 12 }} />
                            Tendências da Prova
                        </h1>
                        <p className="page-subtitle">
                            Análise estratégica do exame de Título de Especialista
                        </p>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center gap-2 bg-secondary p-2 rounded-lg border border-border">
                        <Filter size={18} className="text-muted-foreground ml-2" />
                        <select
                            className="bg-transparent border-none text-foreground focus:ring-0 cursor-pointer"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            style={{ outline: 'none', minWidth: 120 }}
                        >
                            <option value="todos">Todos os Anos</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>
            </header>

            {/* Overview Cards */}
            <div className="stats-grid" style={{ marginBottom: 'var(--spacing-8)' }}>
                <div className="stat-card">
                    <Zap size={24} color="var(--warning-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value">
                        {filteredStats[0] ? THEME_LABELS[filteredStats[0].theme].split(' ')[0] : '-'}
                    </div>
                    <div className="stat-label">
                        {selectedYear === 'todos' ? 'Tema Mais Recorrente (Geral)' : `Mais Cobrado em ${selectedYear}`}
                    </div>
                </div>
                <div className="stat-card">
                    <Layers size={24} color="var(--primary-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value">{topSubthemes[0]?.name || '-'}</div>
                    <div className="stat-label">Top Subtema</div>
                </div>
                <div className="stat-card">
                    <Calendar size={24} color="var(--success-500)" style={{ marginBottom: 'var(--spacing-2)' }} />
                    <div className="stat-value">
                        {selectedYear === 'todos' ? '90' : filteredStats.reduce((a, b) => a + Number(b.currentCount), 0)}
                    </div>
                    <div className="stat-label">Questões Analisadas</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Visualization */}
                <div className="card lg:col-span-2">
                    <h3 className="card-title mb-4">
                        {selectedYear === 'todos' ? 'Evolução Histórica (2019-2025)' : `Distribuição de Questões (${selectedYear})`}
                    </h3>
                    <div style={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            {selectedYear === 'todos' ? (
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="name" fontSize={12} stroke="var(--text-tertiary)" />
                                    <YAxis fontSize={12} stroke="var(--text-tertiary)" />
                                    <Tooltip contentStyle={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }} />
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
                            ) : (
                                <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} interval={0} stroke="var(--text-primary)" />
                                    <Tooltip
                                        cursor={{ fill: 'var(--bg-tertiary)' }}
                                        contentStyle={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {chartData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Top Subthemes Panel */}
                    <div className="card">
                        <h3 className="card-title mb-4 flex items-center gap-2">
                            <AlertCircle size={20} className="text-secondary-500" />
                            O Que Mais Cai
                        </h3>
                        <p className="text-sm text-secondary mb-4">
                            Subtemas específicos mais frequentes {selectedYear !== 'todos' ? `em ${selectedYear}` : 'no histórico'}:
                        </p>
                        <div className="flex flex-col gap-3">
                            {topSubthemes.map((st, idx) => (
                                <div key={idx} className="p-3 bg-tertiary rounded-lg border-l-4" style={{ borderColor: THEME_COLORS[st.theme as keyof typeof THEME_COLORS] }}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-sm text-primary">{st.name}</span>
                                        <span className="badge badge-sm bg-background">{st.count} q</span>
                                    </div>
                                    <span className="text-xs text-secondary uppercase tracking-wider block">
                                        {THEME_LABELS[st.theme as keyof typeof THEME_LABELS]}
                                    </span>
                                </div>
                            ))}
                            {topSubthemes.length === 0 && (
                                <p className="text-secondary text-center py-8">Dados insuficientes para este período.</p>
                            )}
                        </div>
                    </div>

                    {/* User Weak Spots Panel (NEW) */}
                    <div className="card border-2 border-red-500/20">
                        <h3 className="card-title mb-4 flex items-center gap-2 text-red-500">
                            <AlertOctagon size={20} />
                            Seus Pontos de Atenção
                        </h3>
                        <p className="text-sm text-secondary mb-4">
                            Subtemas onde você apresenta maior taxa de erro:
                        </p>
                        <div className="flex flex-col gap-3">
                            {userWeakSpots.map((ws, idx) => (
                                <div key={idx} className="p-3 bg-red-50/10 rounded-lg border border-red-200/20">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-sm text-primary">{ws.name}</span>
                                        <span className="badge badge-sm bg-red-100 text-red-800">{ws.incorrect} erros</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="h-full bg-red-500"
                                            style={{ width: `${100 - ws.accuracy}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-red-400 mt-1 block text-right">
                                        {ws.accuracy.toFixed(0)}% de acerto
                                    </span>
                                </div>
                            ))}
                            {userWeakSpots.length === 0 && (
                                <div className="text-center py-6 text-secondary text-sm">
                                    <span className="block mb-2">🎉</span>
                                    Nenhum erro registrado em subtemas ainda. Continue praticando!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="card">
                <h3 className="card-title mb-4">Análise Detalhada por Tema</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left p-3">Tema</th>
                                <th className="text-center p-3 w-32">
                                    {selectedYear === 'todos' ? 'Média/Ano' : 'Questões'}
                                </th>
                                <th className="text-center p-3 w-32">Tendência</th>
                                <th className="text-center p-3 w-40">Probabilidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStats.map(item => (
                                <tr key={item.theme} className="border-b border-border hover:bg-tertiary/50 transition-colors">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: THEME_COLORS[item.theme] }} />
                                            <div>
                                                <div className="font-medium">{THEME_LABELS[item.theme]}</div>
                                                {/* Show subthemes inline if relevant */}
                                                {item.subthemes && item.subthemes.length > 0 && selectedYear !== 'todos' && item.yearlyFrequency[selectedYear] > 0 && (
                                                    <div className="text-xs text-secondary mt-1">
                                                        Foco: {item.subthemes.map(s => s.name).slice(0, 2).join(', ')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center p-3 font-mono">
                                        {item.displayCount}
                                    </td>
                                    <td className="text-center p-3">
                                        <div className="flex items-center justify-center gap-1">
                                            {getTrendIcon(item.trend)}
                                        </div>
                                    </td>
                                    <td className="text-center p-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all"
                                                    style={{
                                                        width: `${item.probability}%`,
                                                        background: item.probability > 80 ? 'var(--success-500)' :
                                                            item.probability > 60 ? 'var(--warning-500)' : 'var(--gray-400)'
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs w-8 text-right">{item.probability}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
