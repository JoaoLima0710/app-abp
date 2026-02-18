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
    Award,
    Lightbulb,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { addCardsToReview } from '../hooks/useFlashcards';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export default function SimulationResults() {
    const navigate = useNavigate();
    const { simulation, questions, resetSimulation } = useSimulationStore();
    const { loadUserData } = useUserStore();

    useEffect(() => {
        if (!simulation?.completedAt) {
            navigate('/');
            return;
        }
        loadUserData();
        const wrongIds = simulation.questions
            .filter((q) => q.isCorrect === false)
            .map((q) => q.questionId);
        if (wrongIds.length > 0) addCardsToReview(wrongIds);
    }, [simulation, navigate, loadUserData]);

    if (!simulation) return null;

    const { stats } = simulation;

    const handleNewSimulation = () => {
        resetSimulation();
        navigate('/simulado');
    };

    const handleGoHome = () => {
        resetSimulation();
        navigate('/');
    };

    const themeChartData = Object.entries(stats.byTheme).map(([theme, data]) => ({
        name: THEME_LABELS[theme as keyof typeof THEME_LABELS],
        value: data?.total || 0,
        correct: data?.correct || 0,
        accuracy: data?.accuracy || 0,
        color: THEME_COLORS[theme as keyof typeof THEME_COLORS],
    }));

    const getMessage = () => {
        if (stats.accuracy >= 80) return { icon: Trophy, text: 'Excelente! Você está no caminho certo!', cls: 'text-green-500' };
        if (stats.accuracy >= 70) return { icon: Award, text: 'Muito bom! Continue praticando!', cls: 'text-green-500' };
        if (stats.accuracy >= 60) return { icon: TrendingUp, text: 'Bom progresso! Há espaço para melhorar.', cls: 'text-yellow-500' };
        return { icon: Target, text: 'Continue estudando! A prática leva à perfeição.', cls: 'text-red-500' };
    };

    const msg = getMessage();

    const kpis = [
        { label: 'Acertos', value: stats.correct, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
        { label: 'Erros', value: stats.incorrect, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
        { label: 'Total', value: stats.totalQuestions, icon: Target, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Tempo Médio', value: `${stats.avgTimePerQuestion.toFixed(0)}s`, icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
    ];

    return (
        <AppLayout title="Resultado" subtitle="Detalhes do simulado">
            {/* Hero Score */}
            <div className="mb-6 text-center lg:mb-8">
                <msg.icon className={`mx-auto mb-3 h-12 w-12 lg:h-16 lg:w-16 ${msg.cls}`} />
                <h2 className="text-2xl font-bold lg:text-3xl">Simulado Concluído!</h2>
                <p className={`mt-1 text-sm ${msg.cls}`}>{msg.text}</p>

                <div className={cn(
                    'mx-auto mt-4 inline-flex flex-col items-center rounded-2xl border-2 px-8 py-4 lg:mt-6 lg:px-12 lg:py-6',
                    stats.accuracy >= 70 ? 'border-green-500/30 bg-green-50 dark:bg-green-950/20' :
                        stats.accuracy >= 50 ? 'border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20' :
                            'border-red-500/30 bg-red-50 dark:bg-red-950/20',
                )}>
                    <span className={cn(
                        'text-5xl font-extrabold lg:text-6xl',
                        stats.accuracy >= 70 ? 'text-green-500' : stats.accuracy >= 50 ? 'text-yellow-500' : 'text-red-500',
                    )}>
                        {stats.accuracy.toFixed(0)}%
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground lg:text-sm">de aproveitamento</span>
                </div>
            </div>

            {/* KPIs */}
            <div className="mb-4 grid grid-cols-2 gap-2 lg:mb-6 lg:grid-cols-4 lg:gap-4">
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
            <div className="mb-4 grid gap-4 lg:mb-6 lg:grid-cols-2 lg:gap-6">
                {/* Pie Chart */}
                <Card>
                    <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                        <CardTitle className="text-sm lg:text-base">Distribuição por Área</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                        <div className="h-[250px] lg:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={themeChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {themeChartData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, _name, props) => [
                                            `${props.payload.correct}/${value} (${props.payload.accuracy.toFixed(0)}%)`,
                                            _name,
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Theme Breakdown */}
                <Card>
                    <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                        <CardTitle className="text-sm lg:text-base">Desempenho por Área</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-4 pb-4 lg:px-6 lg:pb-6">
                        {Object.entries(stats.byTheme).map(([theme, data]) => {
                            const acc = data?.accuracy || 0;
                            return (
                                <div key={theme} className="space-y-1">
                                    <div className="flex items-center justify-between text-[11px] lg:text-xs">
                                        <span className="font-medium">{THEME_LABELS[theme as keyof typeof THEME_LABELS]}</span>
                                        <Badge variant={acc >= 70 ? 'default' : acc >= 50 ? 'secondary' : 'destructive'} className="text-[10px] lg:text-xs">
                                            {data?.correct}/{data?.total} ({acc.toFixed(0)}%)
                                        </Badge>
                                    </div>
                                    <Progress value={acc} className="h-1.5" />
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Missed Questions */}
            {stats.incorrect > 0 && (
                <Card className="mb-4 lg:mb-6">
                    <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                        <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                            <XCircle className="h-4 w-4 text-red-500" />
                            Questões para Revisar ({stats.incorrect})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 px-4 pb-4 lg:space-y-3 lg:px-6 lg:pb-6">
                        {simulation.questions.map((sq, idx) => {
                            if (sq.isCorrect !== false) return null;
                            const q = questions[idx];
                            if (!q) return null;
                            return (
                                <Collapsible key={sq.questionId}>
                                    <CollapsibleTrigger className="flex w-full items-start gap-2 rounded-lg border-l-4 border-l-red-500 bg-muted/40 p-3 text-left transition-colors hover:bg-muted lg:gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-red-100 text-[10px] font-bold text-red-700 dark:bg-red-950 dark:text-red-400 lg:text-xs">
                                            {idx + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11px] leading-snug lg:text-xs">
                                                {q.statement.length > 120 ? q.statement.substring(0, 120) + '...' : q.statement}
                                            </p>
                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] lg:gap-3 lg:text-[11px]">
                                                <span className="text-red-500">Sua: {sq.userAnswer}</span>
                                                <span className="text-green-500">Correta: {q.correctAnswer}</span>
                                                <Badge variant="outline" className="text-[9px] lg:text-[10px]">{THEME_LABELS[q.theme]}</Badge>
                                            </div>
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-2 border-l-4 border-l-red-500/30 bg-muted/20 p-3 lg:p-4">
                                        <div className="rounded border-l-4 border-l-green-500 bg-muted/50 p-2 lg:p-3">
                                            <strong className="text-[10px] text-green-600 dark:text-green-400 lg:text-xs">Correta: {q.correctAnswer}</strong>
                                            <p className="mt-0.5 text-[10px] leading-relaxed lg:text-xs">{q.explanation.correct}</p>
                                        </div>
                                        {q.explanation.examTip && (
                                            <div className="flex gap-2 rounded bg-warning/10 p-2 lg:p-3">
                                                <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                                                <p className="text-[10px] lg:text-xs">{q.explanation.examTip}</p>
                                            </div>
                                        )}
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
                <Button variant="outline" size="lg" className="gap-1.5 text-xs lg:text-sm" onClick={handleGoHome}>
                    <Home className="h-4 w-4" />
                    Início
                </Button>
                <Button size="lg" className="gap-1.5 text-xs lg:text-sm" onClick={handleNewSimulation}>
                    <RotateCcw className="h-4 w-4" />
                    Novo Simulado
                </Button>
            </div>
        </AppLayout>
    );
}
