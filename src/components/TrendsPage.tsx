
import { useState, useMemo, useEffect } from 'react';
import { THEME_LABELS, THEME_COLORS } from '../types';
import { calculateTrends, getAvailableYears, TrendData } from '../utils/statistics';

import {
    TrendingUp, TrendingDown, Minus, BarChart2, Calendar,
    Layers, ChevronDown, PieChart, Zap
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';

export default function TrendsPage() {
    const [selectedYear, setSelectedYear] = useState<string>('todos');
    const [expandedTheme, setExpandedTheme] = useState<string | null>(null);
    // Dynamic Years
    const [years, setYears] = useState<string[]>([]);
    const [examTrends, setExamTrends] = useState<TrendData[]>([]);

    useEffect(() => {
        setYears(getAvailableYears());
        setExamTrends(calculateTrends());
    }, []);

    const getTrendIcon = (trend: 'rising' | 'stable' | 'declining') => {
        switch (trend) {
            case 'rising': return <TrendingUp size={16} className="text-emerald-500" />;
            case 'declining': return <TrendingDown size={16} className="text-rose-500" />;
            default: return <Minus size={16} className="text-gray-400" />;
        }
    };

    // Filtered Data
    const filteredStats = useMemo(() => {
        if (examTrends.length === 0) return [];

        const totalForPeriod = selectedYear === 'todos'
            ? examTrends.reduce((acc, t) => acc + t.totalQuestions, 0)
            : examTrends.reduce((acc, t) => acc + (t.yearlyFrequency[selectedYear] || 0), 0);

        return examTrends.map(t => {
            const count = selectedYear === 'todos' ? t.totalQuestions : (t.yearlyFrequency[selectedYear] || 0);
            return {
                ...t,
                currentCount: count,
                percentage: totalForPeriod > 0 ? (count / totalForPeriod) * 100 : 0
            };
        }).sort((a, b) => b.currentCount - a.currentCount);
    }, [selectedYear, examTrends]);

    // Chart Data
    const chartData = useMemo(() => {
        if (examTrends.length === 0) return [];

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
    }, [selectedYear, filteredStats, years, examTrends]);

    // Top Subthemes
    const topSubthemes = useMemo(() => {
        const allSubthemes: { theme: string, name: string, count: number }[] = [];
        examTrends.forEach(t => {
            if (t.subthemes) {
                t.subthemes.forEach(st => {
                    let count = 0;
                    if (selectedYear === 'todos') {
                        count = Object.values(st.yearlyFrequency).reduce((a, b) => a + b, 0);
                    } else {
                        count = st.yearlyFrequency[selectedYear] || 0;
                    }
                    if (count > 0) {
                        allSubthemes.push({ theme: t.theme, name: st.name, count });
                    }
                });
            }
        });
        return allSubthemes.sort((a, b) => b.count - a.count).slice(0, 5);
    }, [selectedYear, examTrends]);

    if (examTrends.length === 0) {
        return <div className="p-8 text-center text-gray-500">Carregando dados estatísticos...</div>;
    }

    return (
        <div className="page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Header Section */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <BarChart2 className="text-primary-600" size={32} />
                        Análise de Tendências
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">
                        Inteligência de dados baseada nas provas da ABP ({years[0]}-{years[years.length - 1]}).
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-gray-200">
                    <div className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition-all ${selectedYear === 'todos' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        onClick={() => setSelectedYear('todos')}>
                        Histórico Completo
                    </div>
                    <div className="h-6 w-px bg-gray-200 mx-1" />
                    <select
                        className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer py-2 pr-8"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="todos">Selecionar Ano...</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </header>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-warning-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-warning-50 rounded-xl text-warning-600">
                        <Zap size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium">Tema Mais Recorrente</div>
                        <div className="text-xl font-bold text-gray-900">
                            {filteredStats[0] ? THEME_LABELS[filteredStats[0].theme].split(' ')[0] : '-'}
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                        <Layers size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium">Top Subtema</div>
                        <div className="text-xl font-bold text-gray-900">{topSubthemes[0]?.name || '-'}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-success-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-success-50 rounded-xl text-success-600">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 font-medium">Questões Analisadas</div>
                        <div className="text-xl font-bold text-gray-900">
                            {selectedYear === 'todos' ? examTrends.reduce((a, b) => a + b.totalQuestions, 0) : filteredStats.reduce((a, b) => a + Number(b.currentCount), 0)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Visual: Evolution Chart */}
            <section className="mb-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {selectedYear === 'todos' ? <TrendingUp size={20} className="text-primary-500" /> : <PieChart size={20} className="text-primary-500" />}
                        {selectedYear === 'todos' ? 'Evolução dos Temas (2019-2025)' : `Distribuição em ${selectedYear}`}
                    </h2>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {selectedYear === 'todos' ? (
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                                />
                                {examTrends.slice(0, 5).map((trend) => (
                                    <Line
                                        key={trend.theme}
                                        type="monotone"
                                        dataKey={THEME_LABELS[trend.theme]}
                                        stroke={THEME_COLORS[trend.theme]}
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                ))}
                            </LineChart>
                        ) : (
                            <BarChart data={chartData} layout="vertical" margin={{ left: 100, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 13, fill: '#374151', fontWeight: 500 }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                    {chartData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Detailed Breakdown List */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Detalhamento por Tema</h3>

                {filteredStats.map((item) => {
                    const isExpanded = expandedTheme === item.theme;
                    const hasSubthemes = item.subthemes && item.subthemes.length > 0;

                    return (
                        <div key={item.theme}
                            className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-primary-200 shadow-md ring-1 ring-primary-100' : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'}`}>

                            <div
                                className="p-5 flex items-center gap-6 cursor-pointer"
                                onClick={() => hasSubthemes && setExpandedTheme(isExpanded ? null : item.theme)}
                            >
                                {/* Percentage Badge */}
                                <div className="flex flex-col items-center justify-center w-16 text-center">
                                    <span className="text-xl font-black text-gray-800">{item.percentage.toFixed(1)}%</span>
                                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">da prova</span>
                                </div>

                                {/* Theme Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="text-lg font-bold text-gray-900">{THEME_LABELS[item.theme]}</h4>
                                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-50 border border-gray-100">
                                            {getTrendIcon(item.trend)}
                                            <span className="text-xs font-medium text-gray-600 capitalize">{item.trend === 'rising' ? 'Em Alta' : item.trend === 'declining' ? 'Em Queda' : 'Estável'}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden max-w-md">
                                        <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, background: THEME_COLORS[item.theme] }} />
                                    </div>
                                </div>

                                {/* Expand Action */}
                                {hasSubthemes && (
                                    <div className={`p-2 rounded-full transition-all ${isExpanded ? 'bg-primary-50 text-primary-600 rotate-180' : 'text-gray-300 hover:bg-gray-50 hover:text-gray-500'}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                )}
                            </div>

                            {/* Subthemes Expansion */}
                            {isExpanded && hasSubthemes && (
                                <div className="bg-gray-50/50 border-t border-gray-100 p-6 animate-slide-down">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Layers size={14} /> Subtemas Recorrentes
                                    </h5>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                        {item.subthemes
                                            .map(st => {
                                                const rawCount = selectedYear === 'todos'
                                                    ? Object.values(st.yearlyFrequency).reduce((a, b) => a + Number(b), 0)
                                                    : (st.yearlyFrequency[selectedYear] || 0);
                                                return { ...st, rawCount };
                                            })
                                            .sort((a, b) => b.rawCount - a.rawCount)
                                            .map((st, idx) => (
                                                <div key={idx} className="flex flex-col gap-1">
                                                    <div className="flex justify-between items-end text-sm">
                                                        <span className="font-medium text-gray-700">{st.name}</span>
                                                        <span className="text-gray-500 font-mono text-xs">{st.rawCount} questões</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{
                                                                width: `${item.currentCount > 0 ? (st.rawCount / item.currentCount) * 100 : 0}%`,
                                                                backgroundColor: THEME_COLORS[item.theme],
                                                                opacity: 0.8
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </section>
        </div>
    );
}
