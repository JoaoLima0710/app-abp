import { useState, useMemo, Fragment } from 'react';
import { THEME_LABELS, THEME_COLORS } from '../types';
import { examTrends } from '../data/examTrends';
import { THEME_SUBDIVISIONS_V2, SubthemeCategory } from '../db/taxonomy_definitions';
import { questionsOriginais } from '../db/questions_originais';
import { questionsTreaty } from '../db/questions_treaty';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Calendar,
    Zap,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';

export default function TrendsPage() {
    const years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
    const [expandedTheme, setExpandedTheme] = useState<string | null>(null);

    const mostAskedTheme = [...examTrends].sort((a, b) => b.totalQuestions - a.totalQuestions)[0];
    const risingThemes = examTrends.filter((t) => t.trend === 'rising').sort((a, b) => b.probability - a.probability);
    const topRising =
        risingThemes.length > 0
            ? risingThemes.slice(0, 2).map((t) => THEME_LABELS[t.theme].split(' ')[0]).join('/')
            : '—';
    const totalQuestionsAll = examTrends.reduce((sum, t) => sum + t.totalQuestions, 0);
    const avgPerYear = Math.round(totalQuestionsAll / years.length);

    const subthemeCounts = useMemo(() => {
        const allQuestions = [...questionsOriginais, ...questionsTreaty];
        const counts: Record<string, Record<string, number>> = {};
        allQuestions.forEach((q) => {
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
            case 'rising':
                return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
            case 'declining':
                return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
            default:
                return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
        }
    };

    const lineChartData = years.map((year) => {
        const entry: any = { name: year };
        examTrends.forEach((t) => {
            entry[THEME_LABELS[t.theme]] = t.yearlyFrequency[year] || 0;
        });
        return entry;
    });

    const sortedTrends = [...examTrends].sort((a, b) => b.probability - a.probability);

    const kpis = [
        { label: 'Mais Cobrado', value: THEME_LABELS[mostAskedTheme.theme], icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { label: 'Tendência de Alta', value: topRising, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Média/Ano', value: avgPerYear, icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
    ];

    return (
        <AppLayout title="Tendências da Prova" subtitle="Baseado nos exames de 2019–2025">
            <div className="space-y-4 lg:space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:gap-4">
                    {kpis.map((k) => (
                        <Card key={k.label} className="border-none shadow-sm">
                            <CardContent className="flex items-center gap-3 p-3 lg:p-4">
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${k.bg}`}>
                                    <k.icon className={`h-4 w-4 ${k.color}`} />
                                </div>
                                <div className="min-w-0">
                                    <span className="block truncate text-sm font-bold lg:text-base">{k.value}</span>
                                    <p className="text-[10px] text-muted-foreground lg:text-xs">{k.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Chart */}
                <Card>
                    <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                        <CardTitle className="text-sm lg:text-base">Evolução dos Temas (2019–2025)</CardTitle>
                        <p className="text-[10px] text-muted-foreground lg:text-xs">
                            Observe como certos temas ganharam relevância nas últimas edições.
                        </p>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                        <div className="h-[300px] lg:h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineChartData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="name" fontSize={11} />
                                    <YAxis fontSize={11} />
                                    <Tooltip />
                                    {examTrends.slice(0, 5).map((trend) => (
                                        <Line
                                            key={trend.theme}
                                            type="monotone"
                                            dataKey={THEME_LABELS[trend.theme]}
                                            stroke={THEME_COLORS[trend.theme]}
                                            strokeWidth={2}
                                            dot={{ r: 3 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Strategic Matrix */}
                <Card>
                    <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                        <CardTitle className="text-sm lg:text-base">Matriz de Relevância Estratégica</CardTitle>
                        <p className="text-[10px] text-muted-foreground lg:text-xs">
                            Clique em um tema para ver subtemas e distribuição de questões.
                        </p>
                    </CardHeader>
                    <CardContent className="px-0 pb-4 lg:pb-6">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs">Tema</TableHead>
                                        <TableHead className="text-center text-xs">Tendência</TableHead>
                                        <TableHead className="text-center text-xs">Média/Prova</TableHead>
                                        <TableHead className="text-center text-xs">Prob. 2025</TableHead>
                                        <TableHead className="text-center text-xs">Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sortedTrends.map((item) => {
                                        const avg = item.totalQuestions / years.length;
                                        const isExpanded = expandedTheme === item.theme;
                                        const categories: SubthemeCategory[] = THEME_SUBDIVISIONS_V2[item.theme] || [];
                                        const totalTopics = categories.reduce((sum, cat) => sum + cat.topics.length, 0);
                                        const themeSubs = subthemeCounts[item.theme] || {};

                                        return (
                                            <Fragment key={item.theme}>
                                                <TableRow
                                                    className="cursor-pointer transition-colors hover:bg-muted/50"
                                                    onClick={() => setExpandedTheme((prev) => (prev === item.theme ? null : item.theme))}
                                                >
                                                    <TableCell className="text-xs">
                                                        <div className="flex items-center gap-1.5">
                                                            {isExpanded ? (
                                                                <ChevronDown className="h-3.5 w-3.5 text-primary" />
                                                            ) : (
                                                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                                            )}
                                                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: THEME_COLORS[item.theme] }} />
                                                            <span className={cn(isExpanded && 'font-semibold')}>
                                                                {THEME_LABELS[item.theme]}
                                                            </span>
                                                            <span className="hidden text-[9px] text-muted-foreground lg:inline">
                                                                ({categories.length} cat · {totalTopics} tóp)
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            {getTrendIcon(item.trend)}
                                                            <span className={cn(
                                                                'text-[10px]',
                                                                item.trend === 'rising' && 'text-green-500',
                                                                item.trend === 'declining' && 'text-red-500',
                                                            )}>
                                                                {item.trend === 'rising' ? 'Alta' : item.trend === 'declining' ? 'Queda' : 'Estável'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-xs">{avg.toFixed(1)}</TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <Progress value={item.probability} className="h-1 w-10" />
                                                            <span className="text-[10px]">{item.probability}%</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.probability > 80 ? (
                                                            <Badge variant="destructive" className="text-[9px]">Prioridade</Badge>
                                                        ) : item.trend === 'rising' ? (
                                                            <Badge variant="secondary" className="text-[9px]">Atenção</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-[9px]">Revisão</Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>

                                                {/* Expanded subtopics */}
                                                {isExpanded && (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="p-0">
                                                            <div
                                                                className="mx-3 mb-2 rounded-md bg-muted/40 p-3 lg:p-4"
                                                                style={{ borderLeft: `3px solid ${THEME_COLORS[item.theme]}` }}
                                                            >
                                                                {categories.map((cat, catIdx) => {
                                                                    const catTopicCount = cat.topics.reduce((s, t) => s + (themeSubs[t] || 0), 0);
                                                                    return (
                                                                        <div key={cat.label} className={cn(catIdx < categories.length - 1 && 'mb-3 border-b pb-3')}>
                                                                            <div className="mb-1.5 flex items-center gap-1.5">
                                                                                <span
                                                                                    className="text-[10px] font-bold uppercase tracking-wider lg:text-xs"
                                                                                    style={{ color: THEME_COLORS[item.theme] }}
                                                                                >
                                                                                    {cat.label}
                                                                                </span>
                                                                                <span className="text-[9px] text-muted-foreground">
                                                                                    ({cat.topics.length} tópicos{catTopicCount > 0 ? ` · ${catTopicCount} questões` : ''})
                                                                                </span>
                                                                            </div>
                                                                            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
                                                                                {cat.topics.map((topic) => {
                                                                                    const count = themeSubs[topic] || 0;
                                                                                    return (
                                                                                        <div
                                                                                            key={topic}
                                                                                            className="flex items-center justify-between rounded border bg-background px-2 py-1 text-[10px] lg:text-xs"
                                                                                        >
                                                                                            <span className="truncate">{topic}</span>
                                                                                            <Badge
                                                                                                variant={count > 0 ? 'default' : 'outline'}
                                                                                                className="ml-1 min-w-[20px] text-center text-[9px]"
                                                                                            >
                                                                                                {count}
                                                                                            </Badge>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
