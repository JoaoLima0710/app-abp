import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { THEME_LABELS, THEME_COLORS } from '../types';
import {
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    Zap,
    Target,
    Award,
    ArrowRight,
    Brain,
    Lightbulb,
} from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { AiStudyGuide } from '@/components/AiStudyGuide';

export default function StudyPlan() {
    const navigate = useNavigate();
    const { recommendations, progress, loadUserData } = useUserStore();

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    const hasData = progress && progress.totalSimulations > 0;

    const studyPriorities = progress?.byTheme
        ? Object.entries(progress.byTheme)
            .map(([theme, data]) => ({
                theme: theme as keyof typeof THEME_LABELS,
                accuracy: data?.accuracy || 0,
                total: data?.totalAttempts || 0,
                trend: data?.trend,
                priority: calculatePriority(data?.accuracy || 0, data?.totalAttempts || 0, data?.trend),
            }))
            .sort((a, b) => b.priority - a.priority)
        : [];

    function calculatePriority(accuracy: number, total: number, trend?: string): number {
        let priority = 0;
        if (accuracy < 50) priority += 40;
        else if (accuracy < 60) priority += 30;
        else if (accuracy < 70) priority += 20;
        else priority += 5;
        if (total < 5) priority += 15;
        else if (total < 10) priority += 10;
        if (trend === 'declining') priority += 20;
        else if (trend === 'stable' && accuracy < 70) priority += 10;
        return priority;
    }

    const getPriorityBadge = (priority: number) => {
        if (priority >= 50) return <Badge variant="destructive" className="text-[10px]">Alta</Badge>;
        if (priority >= 30) return <Badge variant="secondary" className="text-[10px]">Média</Badge>;
        return <Badge className="text-[10px]">Baixa</Badge>;
    };

    const topPriorities = studyPriorities.slice(0, 5);
    const lowPriorities = studyPriorities.slice(-3).reverse();

    const studyTips = [
        { emoji: '📚', title: 'Foque nas Lacunas', text: 'Dedique mais tempo às áreas com baixo aproveitamento. Use simulados focados.', color: 'text-primary' },
        { emoji: '🔄', title: 'Revisão Espaçada', text: 'Revise questões erradas após 1, 3 e 7 dias para fortalecer a memória.', color: 'text-primary' },
        { emoji: '⏱️', title: 'Simule a Prova', text: 'Faça simulados completos (100 questões) para treinar resistência e gestão de tempo.', color: 'text-green-500' },
        { emoji: '📖', title: 'Estude as Explicações', text: 'Leia as explicações de todas as questões, inclusive as que você acertou.', color: 'text-yellow-500' },
    ];

    return (
        <AppLayout title="Plano de Estudos" subtitle="Recomendações baseadas no seu desempenho">
            {!hasData ? (
                <Card className="py-16 text-center">
                    <CardContent>
                        <Brain className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                        <h3 className="text-base font-semibold">Comece a Praticar!</h3>
                        <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
                            Complete alguns simulados para receber recomendações personalizadas
                        </p>
                        <Button className="mt-4 gap-1.5" onClick={() => navigate('/simulado')}>
                            <Zap className="h-4 w-4" />
                            Iniciar Primeiro Simulado
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4 lg:space-y-6">
                    {/* Quick Action */}
                    <Card className="border-none bg-gradient-to-r from-primary/5 to-primary/10">
                        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4 lg:p-6">
                            <div>
                                <h3 className="text-sm font-bold lg:text-base">Próximo Passo Recomendado</h3>
                                <p className="mt-0.5 text-[11px] text-muted-foreground lg:text-xs">
                                    {topPriorities.length > 0 && topPriorities[0].accuracy < 60
                                        ? `Faça um simulado focado em ${THEME_LABELS[topPriorities[0].theme]}`
                                        : 'Continue praticando com simulados mistos'}
                                </p>
                            </div>
                            <Button className="gap-1.5 text-xs lg:text-sm" onClick={() => navigate('/simulado')}>
                                <Zap className="h-3.5 w-3.5" />
                                Iniciar Simulado
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Insights */}
                    {recommendations.length > 0 && (
                        <Card>
                            <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                                <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                                    Insights Personalizados
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 px-4 pb-4 lg:space-y-3 lg:px-6 lg:pb-6">
                                {recommendations.map((rec, idx) => {
                                    const isP = rec.type === 'priority';
                                    const isC = rec.type === 'celebrate';
                                    const isR = rec.type === 'review';
                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                'flex items-start gap-2 rounded-lg border-l-4 p-3 lg:gap-3 lg:p-4',
                                                isP && 'border-l-red-500 bg-red-50 dark:bg-red-950/20',
                                                isC && 'border-l-green-500 bg-green-50 dark:bg-green-950/20',
                                                isR && 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
                                                !isP && !isC && !isR && 'border-l-primary bg-primary/5',
                                            )}
                                        >
                                            {isP && <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}
                                            {isC && <Award className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />}
                                            {!isP && !isC && isR && <Target className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />}
                                            {!isP && !isC && !isR && <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
                                            <div>
                                                <p className="text-[11px] font-medium lg:text-xs">{rec.message}</p>
                                                <p className="mt-0.5 text-[10px] text-muted-foreground lg:text-[11px]">
                                                    💡 {rec.suggestedAction}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    )}

                    {/* Priorities vs Maintain */}
                    <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                        {/* High Priority */}
                        <Card className="border-t-4 border-t-red-500">
                            <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                                <CardTitle className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 lg:text-base">
                                    <AlertTriangle className="h-4 w-4" />
                                    Prioridade Alta
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 px-4 pb-4 lg:space-y-3 lg:px-6 lg:pb-6">
                                {topPriorities.slice(0, 3).map((item) => (
                                    <div
                                        key={item.theme}
                                        className="space-y-1.5 rounded-lg bg-muted/40 p-3"
                                        style={{ borderLeft: `4px solid ${THEME_COLORS[item.theme]}` }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-medium lg:text-xs">{THEME_LABELS[item.theme]}</span>
                                            {getPriorityBadge(item.priority)}
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground lg:text-[11px]">
                                            <span>
                                                Aproveitamento:{' '}
                                                <strong className={item.accuracy < 60 ? 'text-red-500' : 'text-yellow-500'}>
                                                    {item.accuracy.toFixed(0)}%
                                                </strong>
                                            </span>
                                            <span>{item.total} questões</span>
                                        </div>
                                        <Progress value={item.accuracy} className="h-1" />
                                        <AiStudyGuide theme={item.theme} />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Maintain */}
                        <Card className="border-t-4 border-t-green-500">
                            <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                                <CardTitle className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 lg:text-base">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Manter - Revisão Periódica
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 px-4 pb-4 lg:space-y-3 lg:px-6 lg:pb-6">
                                {lowPriorities.length > 0 ? (
                                    lowPriorities.map((item) => (
                                        <div
                                            key={item.theme}
                                            className="flex items-center justify-between rounded-lg bg-green-50 p-2.5 dark:bg-green-950/30 lg:p-3"
                                            style={{ borderLeft: `4px solid ${THEME_COLORS[item.theme]}` }}
                                        >
                                            <div>
                                                <span className="text-[11px] font-medium lg:text-xs">{THEME_LABELS[item.theme]}</span>
                                                <p className="text-[9px] text-muted-foreground lg:text-[10px]">Bom desempenho!</p>
                                            </div>
                                            <Badge className="text-[10px]">{item.accuracy.toFixed(0)}%</Badge>
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-4 text-center text-xs text-muted-foreground">Continue praticando</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Study Tips */}
                    <Card>
                        <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                            <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
                                <Brain className="h-4 w-4" />
                                Dicas de Estudo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                            <div className="grid gap-3 sm:grid-cols-2 lg:gap-4">
                                {studyTips.map((tip) => (
                                    <div key={tip.title} className="rounded-lg bg-muted/50 p-3 lg:p-4">
                                        <h4 className={`mb-1 text-xs font-semibold ${tip.color} lg:text-sm`}>
                                            {tip.emoji} {tip.title}
                                        </h4>
                                        <p className="text-[10px] text-muted-foreground lg:text-xs">{tip.text}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </AppLayout>
    );
}
