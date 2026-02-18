import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import {
    TrendingUp,
    Target,
    Clock,
    Award,
    ArrowRight,
    AlertCircle,
    FileText,
    BookOpen,
} from 'lucide-react';
import { THEME_LABELS } from '../types';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function Dashboard() {
    const navigate = useNavigate();
    const { simulations, progress, recommendations } = useUserStore();

    const recentSimulations = simulations.slice(0, 5);

    const stats = [
        {
            label: 'Questões Resolvidas',
            value: progress?.totalQuestionsAnswered?.toLocaleString('pt-BR') || '0',
            icon: Target,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
        {
            label: 'Taxa de Acerto',
            value: `${progress?.overallAccuracy?.toFixed(0) || 0}%`,
            icon: TrendingUp,
            color: progress?.overallAccuracy && progress.overallAccuracy >= 70 ? 'text-success' : progress?.overallAccuracy && progress.overallAccuracy >= 50 ? 'text-warning' : 'text-destructive',
            bgColor: progress?.overallAccuracy && progress.overallAccuracy >= 70 ? 'bg-success/10' : progress?.overallAccuracy && progress.overallAccuracy >= 50 ? 'bg-warning/10' : 'bg-destructive/10',
        },
        {
            label: 'Simulados Completos',
            value: String(progress?.totalSimulations || 0),
            icon: Award,
            color: 'text-warning',
            bgColor: 'bg-warning/10',
        },
        {
            label: 'Áreas Fortes',
            value: String(progress?.trends.strongThemes.length || 0),
            icon: TrendingUp,
            color: 'text-info',
            bgColor: 'bg-info/10',
        },
    ];

    return (
        <AppLayout title="Dashboard" subtitle="Visão geral do seu progresso">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-sm">
                        <CardContent className="flex flex-col gap-2 p-4 lg:flex-row lg:items-start lg:gap-4 lg:p-5">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg lg:h-10 lg:w-10 ${stat.bgColor}`}>
                                <stat.icon className={`h-4 w-4 lg:h-5 lg:w-5 ${stat.color}`} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold lg:text-2xl">{stat.value}</span>
                                <span className="text-[11px] leading-tight text-muted-foreground lg:text-xs">{stat.label}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-6">
                <Button
                    size="lg"
                    className="w-full gap-2 sm:w-auto"
                    onClick={() => navigate('/simulado')}
                >
                    <FileText className="h-4 w-4" />
                    Iniciar Novo Simulado
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Main Content Grid */}
            <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-3 lg:gap-6">
                {/* Recommendations - 2/3 */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                            <CardTitle className="text-base lg:text-lg">Recomendações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 px-4 pb-4 lg:space-y-3 lg:px-6 lg:pb-6">
                            {recommendations.length > 0 ? (
                                recommendations.map((rec, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 lg:gap-4 lg:p-4"
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 lg:h-9 lg:w-9 lg:rounded-lg">
                                            {rec.type === 'priority' && <AlertCircle className="h-3.5 w-3.5 text-destructive lg:h-4 lg:w-4" />}
                                            {rec.type === 'celebrate' && <Award className="h-3.5 w-3.5 text-success lg:h-4 lg:w-4" />}
                                            {rec.type === 'maintain' && <TrendingUp className="h-3.5 w-3.5 text-primary lg:h-4 lg:w-4" />}
                                            {rec.type === 'review' && <Clock className="h-3.5 w-3.5 text-warning lg:h-4 lg:w-4" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-medium leading-tight lg:text-sm">{rec.message}</p>
                                            <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground lg:text-xs">
                                                {rec.suggestedAction}
                                            </p>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium lg:px-2.5 lg:text-xs ${rec.type === 'priority'
                                                ? 'bg-destructive/10 text-destructive'
                                                : rec.type === 'review'
                                                    ? 'bg-warning/10 text-warning'
                                                    : 'bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {rec.type === 'priority' ? 'Alta' : rec.type === 'review' ? 'Média' : THEME_LABELS[rec.theme]}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <BookOpen className="mb-2 h-8 w-8 text-muted-foreground/30" />
                                    <p className="text-xs text-muted-foreground">
                                        Complete alguns simulados para receber recomendações personalizadas
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Simulations - 1/3 */}
                <div>
                    <Card>
                        <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                            <CardTitle className="text-base lg:text-lg">Simulados Recentes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 px-4 pb-4 lg:space-y-4 lg:px-6 lg:pb-6">
                            {recentSimulations.length > 0 ? (
                                <>
                                    {recentSimulations.map((sim) => (
                                        <div key={sim.id} className="space-y-1.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="truncate text-[13px] font-medium lg:text-sm">
                                                        {sim.questionCount} questões
                                                        {sim.focusTheme && ` · ${THEME_LABELS[sim.focusTheme]}`}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground lg:text-xs">
                                                        {new Date(sim.createdAt).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                                {sim.completedAt ? (
                                                    <span className="shrink-0 text-base font-bold text-primary lg:text-lg">
                                                        {sim.stats.accuracy.toFixed(0)}%
                                                    </span>
                                                ) : (
                                                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                        Em andamento
                                                    </span>
                                                )}
                                            </div>
                                            {sim.completedAt && (
                                                <Progress value={sim.stats.accuracy} className="h-1.5" />
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full gap-1 text-xs lg:text-sm"
                                        onClick={() => navigate('/estatisticas')}
                                    >
                                        Ver todas
                                        <ArrowRight className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                                    </Button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <FileText className="mb-2 h-8 w-8 text-muted-foreground/30" />
                                    <p className="text-xs text-muted-foreground">
                                        Nenhum simulado realizado ainda
                                    </p>
                                    <Button
                                        size="sm"
                                        className="mt-3 gap-1"
                                        onClick={() => navigate('/simulado')}
                                    >
                                        Começar Primeiro Simulado
                                        <ArrowRight className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Theme Performance Overview */}
            {progress && Object.keys(progress.byTheme).length > 0 && (
                <Card className="mt-4 lg:mt-6">
                    <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                        <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Desempenho por Área
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 px-4 pb-4 lg:space-y-4 lg:px-6 lg:pb-6">
                        {Object.entries(progress.byTheme).map(([theme, data]) => {
                            const accuracy = data?.accuracy || 0;
                            return (
                                <div key={theme} className="space-y-1">
                                    <div className="flex items-center justify-between text-[12px] lg:text-sm">
                                        <span className="font-medium">{THEME_LABELS[theme as keyof typeof THEME_LABELS]}</span>
                                        <span className={`font-bold ${accuracy >= 70 ? 'text-success' : accuracy >= 50 ? 'text-warning' : 'text-destructive'}`}>
                                            {accuracy.toFixed(0)}%
                                        </span>
                                    </div>
                                    <Progress value={accuracy} className="h-1.5" />
                                    <p className="text-[10px] text-muted-foreground lg:text-xs">
                                        {data?.correctAnswers}/{data?.totalAttempts} corretas
                                        {data?.trend === 'improving' && ' · ↑ Melhorando'}
                                        {data?.trend === 'declining' && ' · ↓ Em queda'}
                                    </p>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}
        </AppLayout>
    );
}
