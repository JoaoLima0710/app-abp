import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { THEME_LABELS, THEME_COLORS, PsychiatryTheme } from '../types';
import { db } from '../db/database';
import { Loader2, Radar as RadarIcon } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { MasteryBadges } from './MasteryBadges';

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

    const radarData = coverageData.map(d => ({
        subject: d.label.split(' ')[0], // Short name for the web
        fullLabel: d.label,
        Acurácia: d.accuracy,
        Cobertura: d.coverage,
        color: d.color
    }));

    // Generate stats object for mastery badges
    const statsByTheme = coverageData.reduce((acc, curr) => {
        acc[curr.theme] = {
            total: curr.totalQuestions,
            correct: curr.correctAnswers,
            accuracy: curr.accuracy,
            questionsSeen: curr.answeredQuestions
        };
        return acc;
    }, {} as Record<string, any>);

    return (
        <AppLayout title="Árvore de Habilidades" subtitle="Seu domínio taxonômico visualizado">
            <div className="space-y-4 lg:space-y-6">
                {/* Hero Radar Chart */}
                <Card className="text-center overflow-hidden border-2 shadow-sm">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle className="text-xl lg:text-2xl flex items-center justify-center gap-2">
                            <RadarIcon className="w-6 h-6 text-primary" />
                            Mapa de Competências
                        </CardTitle>
                        <CardDescription>
                            Seu desempenho em % de acerto distribuído pelos eixos da psiquiatria.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[350px] lg:h-[450px] w-full pt-6 pb-2">
                            {radarData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 11 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Acurácia (%)"
                                            dataKey="Acurácia"
                                            stroke="#3b82f6"
                                            fill="#3b82f6"
                                            fillOpacity={0.4}
                                        />
                                        <Tooltip
                                            formatter={(value: number, name: string) => [`${value.toFixed(0)}%`, name]}
                                            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullLabel || label}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    Responda a algumas questões para formar seu gráfico.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Gamified Mastery Badges */}
                <MasteryBadges statsByTheme={statsByTheme} />

                {/* Raw Coverage Grid */}
                <h3 className="text-lg font-bold mt-8 mb-2 px-2">Estatísticas Brutas</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                    {coverageData.map((d) => (
                        <Card key={d.theme} className="relative overflow-hidden shadow-sm" style={{ borderLeftWidth: 4, borderLeftColor: d.color }}>
                            <div
                                className="absolute inset-y-0 left-0 opacity-5 transition-all duration-500"
                                style={{ width: `${d.coverage}%`, background: d.color }}
                            />
                            <CardContent className="relative space-y-2 p-3 lg:p-4">
                                <h4 className="text-xs font-semibold lg:text-sm">{d.label}</h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-muted-foreground lg:text-xs">
                                        Vistas: {d.answeredQuestions}/{d.totalQuestions}
                                    </span>
                                    <Badge
                                        variant={d.coverage > 70 ? 'default' : d.coverage > 40 ? 'secondary' : 'outline'}
                                        className="text-[10px] lg:text-xs bg-background"
                                    >
                                        Cobertura {d.coverage.toFixed(0)}%
                                    </Badge>
                                </div>
                                <Progress value={d.coverage} className="h-1.5" />
                                {d.answeredQuestions > 0 && (
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                                        <span className="text-[10px] font-medium lg:text-xs">Precisão</span>
                                        <span className={`text-[10px] font-bold lg:text-xs ${d.accuracy >= 70 ? 'text-green-500' : d.accuracy >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                                            {d.accuracy.toFixed(0)}%
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
