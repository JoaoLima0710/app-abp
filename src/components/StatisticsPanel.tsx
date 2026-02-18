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
    Award,
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
} from 'recharts';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function StatisticsPanel() {
    const { simulations, progress, loadUserData } = useUserStore();

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    const completedSims = simulations.filter((s) => s.completedAt);

    const evolutionData = completedSims
        .slice(-20)
        .reverse()
        .map((sim, idx) => ({
            name: `#${idx + 1}`,
            accuracy: sim.stats.accuracy,
            date: new Date(sim.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        }));

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
                return <TrendingUp className="h-4 w-4 text-green-500" />;
            case 'declining':
                return <TrendingDown className="h-4 w-4 text-red-500" />;
            default:
                return <Minus className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const getTrendLabel = (trend?: 'improving' | 'stable' | 'declining') => {
        switch (trend) {
            case 'improving':
                return 'Melhorando';
            case 'declining':
                return 'Caindo';
            default:
                return 'Estável';
        }
    };

    const kpis = [
        { label: 'Simulados', value: completedSims.length, icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Questões', value: progress?.totalQuestionsAnswered || 0, icon: Target, color: 'text-muted-foreground', bg: 'bg-muted' },
        { label: 'Aproveitamento', value: `${progress?.overallAccuracy?.toFixed(1) || 0}%`, icon: Award, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Tendência', value: getTrendLabel(progress?.trends.overallTrend), icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
    ];

    return (
        <AppLayout title="Estatísticas" subtitle="Análise detalhada do seu desempenho">
            {completedSims.length === 0 ? (
                <Card className="py-16 text-center">
                    <CardContent>
                        <Target className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                        <h3 className="text-base font-semibold">Nenhum dado disponível</h3>
                        <p className="mt-1 text-xs text-muted-foreground">Complete alguns simulados para ver suas estatísticas</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4 lg:space-y-6">
                    {/* KPIs */}
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
                        {kpis.map((k) => (
                            <Card key={k.label} className="border-none shadow-sm">
                                <CardContent className="flex items-center gap-3 p-3 lg:p-4">
                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${k.bg}`}>
                                        <k.icon className={`h-4 w-4 ${k.color}`} />
                                    </div>
                                    <div>
                                        <span className="text-lg font-bold lg:text-xl">{k.value}</span>
                                        <p className="text-[10px] text-muted-foreground lg:text-xs">{k.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                        {/* Evolution Chart */}
                        <Card>
                            <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                                <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                                    <TrendingUp className="h-4 w-4" />
                                    Evolução
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                                <div className="h-[250px] lg:h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={evolutionData}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                            <XAxis dataKey="date" className="text-muted-foreground" fontSize={11} />
                                            <YAxis domain={[0, 100]} className="text-muted-foreground" fontSize={11} />
                                            <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Aproveitamento']} />
                                            <Line type="monotone" dataKey="accuracy" className="stroke-primary" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bar Chart */}
                        <Card>
                            <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                                <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                                    <BarChart3 className="h-4 w-4" />
                                    Por Área
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                                <div className="h-[250px] lg:h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={themePerformanceData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                            <XAxis type="number" domain={[0, 100]} fontSize={11} />
                                            <YAxis type="category" dataKey="name" width={75} fontSize={10} />
                                            <Tooltip formatter={(value: number, _name: string, props: any) => [`${value.toFixed(1)}%`, props.payload.fullName]} />
                                            <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                                                {themePerformanceData.map((entry, i) => (
                                                    <Cell key={i} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Table */}
                    <Card>
                        <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                            <CardTitle className="text-sm lg:text-base">Análise Detalhada por Área</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-4 lg:pb-6">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-xs">Área</TableHead>
                                            <TableHead className="text-center text-xs">Questões</TableHead>
                                            <TableHead className="text-center text-xs">Acertos</TableHead>
                                            <TableHead className="text-center text-xs">%</TableHead>
                                            <TableHead className="text-center text-xs">Tendência</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(progress?.byTheme || {}).map(([theme, data]) => {
                                            const acc = data?.accuracy || 0;
                                            return (
                                                <TableRow key={theme}>
                                                    <TableCell className="text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: THEME_COLORS[theme as keyof typeof THEME_COLORS] }} />
                                                            {THEME_LABELS[theme as keyof typeof THEME_LABELS]}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center text-xs">{data?.totalAttempts || 0}</TableCell>
                                                    <TableCell className="text-center text-xs">{data?.correctAnswers || 0}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge variant={acc >= 70 ? 'default' : acc >= 50 ? 'secondary' : 'destructive'} className="text-[10px]">
                                                            {acc.toFixed(1)}%
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center gap-1">
                                                            {getTrendIcon(data?.trend)}
                                                            <span className={cn(
                                                                'text-[10px]',
                                                                data?.trend === 'improving' && 'text-green-500',
                                                                data?.trend === 'declining' && 'text-red-500',
                                                                data?.trend === 'stable' && 'text-muted-foreground',
                                                            )}>
                                                                {getTrendLabel(data?.trend)}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Strong vs Weak */}
                    <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                        <Card className="border-t-4 border-t-green-500">
                            <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                                <CardTitle className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 lg:text-base">
                                    <Award className="h-4 w-4" />
                                    Áreas Fortes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 px-4 pb-4 lg:px-6 lg:pb-6">
                                {progress?.trends.strongThemes && progress.trends.strongThemes.length > 0 ? (
                                    progress.trends.strongThemes.map((theme) => (
                                        <div key={theme} className="flex items-center gap-2 rounded-lg bg-green-50 p-2 dark:bg-green-950/30 lg:p-3">
                                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: THEME_COLORS[theme] }} />
                                            <span className="flex-1 text-[11px] lg:text-xs">{THEME_LABELS[theme]}</span>
                                            <Badge className="text-[10px]">{progress.byTheme[theme]?.accuracy?.toFixed(0)}%</Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-4 text-center text-xs text-muted-foreground">Continue praticando</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-t-4 border-t-red-500">
                            <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                                <CardTitle className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 lg:text-base">
                                    <Target className="h-4 w-4" />
                                    Áreas para Melhorar
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 px-4 pb-4 lg:px-6 lg:pb-6">
                                {progress?.trends.weakThemes && progress.trends.weakThemes.length > 0 ? (
                                    progress.trends.weakThemes.map((theme) => (
                                        <div key={theme} className="flex items-center gap-2 rounded-lg bg-red-50 p-2 dark:bg-red-950/30 lg:p-3">
                                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: THEME_COLORS[theme] }} />
                                            <span className="flex-1 text-[11px] lg:text-xs">{THEME_LABELS[theme]}</span>
                                            <Badge variant="destructive" className="text-[10px]">{progress.byTheme[theme]?.accuracy?.toFixed(0)}%</Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-4 text-center text-xs text-muted-foreground">Nenhuma área crítica</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
