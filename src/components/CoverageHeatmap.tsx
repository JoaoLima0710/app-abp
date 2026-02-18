import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { THEME_LABELS, THEME_COLORS, PsychiatryTheme } from '../types';
import { db } from '../db/database';
import { Map, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CoverageData {
    theme: PsychiatryTheme;
    label: string;
    color: string;
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    coverage: number;
    accuracy: number;
}

export default function CoverageHeatmap() {
    const { progress } = useUserStore();
    const [coverageData, setCoverageData] = useState<CoverageData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const allQuestions = await db.questions.toArray();

            const byTheme: Record<string, { total: number; ids: Set<string> }> = {};
            for (const q of allQuestions) {
                if (!byTheme[q.theme]) byTheme[q.theme] = { total: 0, ids: new Set() };
                byTheme[q.theme].total++;
                byTheme[q.theme].ids.add(q.id);
            }

            const sims = await db.simulations.toArray();
            const answeredByTheme: Record<string, { answered: Set<string>; correct: number }> = {};

            for (const sim of sims) {
                for (const sq of sim.questions) {
                    if (!sq.userAnswer) continue;
                    const q = allQuestions.find((x) => x.id === sq.questionId);
                    if (!q) continue;
                    if (!answeredByTheme[q.theme]) answeredByTheme[q.theme] = { answered: new Set(), correct: 0 };
                    answeredByTheme[q.theme].answered.add(sq.questionId);
                    if (sq.isCorrect) answeredByTheme[q.theme].correct++;
                }
            }

            const data: CoverageData[] = Object.entries(byTheme).map(([theme, { total }]) => {
                const answered = answeredByTheme[theme]?.answered.size || 0;
                const correct = answeredByTheme[theme]?.correct || 0;
                return {
                    theme: theme as PsychiatryTheme,
                    label: THEME_LABELS[theme as PsychiatryTheme] || theme,
                    color: THEME_COLORS[theme as PsychiatryTheme] || '#888',
                    totalQuestions: total,
                    answeredQuestions: answered,
                    correctAnswers: correct,
                    coverage: total > 0 ? (answered / total) * 100 : 0,
                    accuracy: answered > 0 ? (correct / answered) * 100 : 0,
                };
            });

            data.sort((a, b) => a.coverage - b.coverage);
            setCoverageData(data);
            setIsLoading(false);
        })();
    }, [progress]);

    if (isLoading) {
        return (
            <AppLayout title="Cobertura" subtitle="Carregando...">
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AppLayout>
        );
    }

    const overallCoverage =
        coverageData.length > 0 ? coverageData.reduce((sum, d) => sum + d.coverage, 0) / coverageData.length : 0;

    return (
        <AppLayout title="Cobertura Temática" subtitle="Quais temas ainda precisam ser estudados">
            <div className="space-y-4 lg:space-y-6">
                {/* Overview */}
                <Card className="text-center">
                    <CardContent className="p-4 lg:p-6">
                        <Map className="mx-auto mb-2 h-8 w-8 text-primary lg:h-10 lg:w-10" />
                        <span className="text-3xl font-bold text-primary lg:text-4xl">{overallCoverage.toFixed(0)}%</span>
                        <p className="mt-0.5 text-xs text-muted-foreground">Cobertura Geral</p>
                        <Progress value={overallCoverage} className="mx-auto mt-3 h-2 max-w-xs" />
                    </CardContent>
                </Card>

                {/* Theme Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                    {coverageData.map((d) => (
                        <Card key={d.theme} className="relative overflow-hidden" style={{ borderLeftWidth: 4, borderLeftColor: d.color }}>
                            {/* Background fill */}
                            <div
                                className="absolute inset-y-0 left-0 opacity-10 transition-all duration-500"
                                style={{ width: `${d.coverage}%`, background: d.color }}
                            />
                            <CardContent className="relative space-y-2 p-3 lg:p-4">
                                <h4 className="text-xs font-semibold lg:text-sm">{d.label}</h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-muted-foreground lg:text-xs">
                                        {d.answeredQuestions}/{d.totalQuestions} questões
                                    </span>
                                    <Badge
                                        variant={d.coverage > 70 ? 'default' : d.coverage > 40 ? 'secondary' : 'destructive'}
                                        className="text-[10px] lg:text-xs"
                                    >
                                        {d.coverage.toFixed(0)}%
                                    </Badge>
                                </div>
                                <Progress value={d.coverage} className="h-1.5" />
                                {d.answeredQuestions > 0 && (
                                    <p className="text-[10px] text-muted-foreground lg:text-xs">
                                        Acurácia: {d.accuracy.toFixed(0)}%
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
