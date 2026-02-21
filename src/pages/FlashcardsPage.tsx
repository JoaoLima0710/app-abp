import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, Pill, Brain, Zap, Baby, Wine, ArrowRight, Sparkles, Target } from 'lucide-react';
import { useFlashcards } from '../hooks/useFlashcards';
import { useUserStore } from '../store/userStore';
import { questionsOriginais } from '../db/questions_originais';
import { questionsTreaty } from '../db/questions_treaty';
import { THEME_LABELS, PsychiatryTheme } from '../types';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { db } from '@/db/database';
import { CustomFlashcard } from '@/types';

const allQuestions = [...questionsOriginais, ...questionsTreaty];

const themeIcons: Record<string, React.ElementType> = {
    transtornos_humor: Heart,
    psicofarmacologia: Pill,
    esquizofrenia: Brain,
    transtornos_ansiedade: Zap,
    psiquiatria_infantil: Baby,
    dependencia_quimica: Wine,
    transtornos_personalidade: Brain,
    neuropsiquiatria: Brain,
};

const themeColors: Record<string, string> = {
    transtornos_humor: 'text-destructive bg-destructive/10',
    psicofarmacologia: 'text-primary bg-primary/10',
    esquizofrenia: 'text-info bg-info/10',
    transtornos_ansiedade: 'text-warning bg-warning/10',
    psiquiatria_infantil: 'text-success bg-success/10',
    dependencia_quimica: 'text-destructive bg-destructive/10',
    transtornos_personalidade: 'text-primary bg-primary/10',
    neuropsiquiatria: 'text-info bg-info/10',
};

const FlashcardsPage: React.FC = () => {
    const navigate = useNavigate();
    const { progress: flashcardProgress, getStats } = useFlashcards();
    const { progress: userProgress } = useUserStore();
    const [customCards, setCustomCards] = React.useState<CustomFlashcard[]>([]);

    React.useEffect(() => {
        const fetchCards = async () => {
            const cards = await db.customFlashcards.toArray();
            setCustomCards(cards);
        };
        fetchCards();
    }, []);

    const stats = getStats(customCards.length, customCards);

    // Calculate per-theme stats
    const categories = useMemo(() => {
        // Group questions by theme
        const byTheme: Record<string, { total: number; reviewed: number }> = {};

        for (const q of allQuestions) {
            const theme = q.theme;
            if (!theme) continue;
            if (!byTheme[theme]) byTheme[theme] = { total: 0, reviewed: 0 };
            byTheme[theme].total++;
            // Check if this question has been reviewed (has repetition > 0)
            if (flashcardProgress[q.id] && flashcardProgress[q.id].repetition > 0) {
                byTheme[theme].reviewed++;
            }
        }

        for (const c of customCards) {
            const theme = c.theme;
            if (!theme) continue;
            if (!byTheme[theme]) byTheme[theme] = { total: 0, reviewed: 0 };
            byTheme[theme].total++;

            if (flashcardProgress[c.id] && flashcardProgress[c.id].repetition > 0) {
                byTheme[theme].reviewed++;
            }
        }

        return Object.entries(byTheme).map(([theme, data]) => ({
            theme: theme as PsychiatryTheme,
            name: THEME_LABELS[theme as PsychiatryTheme] || theme,
            icon: themeIcons[theme] || BookOpen,
            color: themeColors[theme] || 'text-primary bg-primary/10',
            total: data.total,
            reviewed: data.reviewed,
            pct: data.total > 0 ? Math.round((data.reviewed / data.total) * 100) : 0,
        }));
    }, [flashcardProgress, customCards]);

    const worstSubthemes = useMemo(() => {
        if (!userProgress?.byTheme) return [];

        const all: { themeKey: PsychiatryTheme; themeLabel: string; subtheme: string; errors: number; total: number }[] = [];

        Object.entries(userProgress.byTheme).forEach(([themeKey, data]) => {
            if (data.subthemeStats) {
                Object.entries(data.subthemeStats).forEach(([subm, sts]) => {
                    if (sts.errors > 0) {
                        all.push({
                            themeKey: themeKey as PsychiatryTheme,
                            themeLabel: THEME_LABELS[themeKey as PsychiatryTheme] || themeKey,
                            subtheme: subm,
                            errors: sts.errors,
                            total: sts.total
                        });
                    }
                });
            }
        });

        // Sort by most errors
        return all.sort((a, b) => b.errors - a.errors).slice(0, 6);
    }, [userProgress]);

    const handleStartReview = () => {
        navigate('/flashcards/estudo', { state: { mode: 'due' } });
    };

    const handleStartNew = () => {
        navigate('/flashcards/estudo', { state: { mode: 'new' } });
    };

    return (
        <AppLayout title="Flashcards" subtitle="Revisão espaçada por tema">
            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                {categories.map((cat) => (
                    <Card
                        key={cat.theme}
                        className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
                        onClick={() => navigate('/flashcards/estudo', { state: { mode: 'theme', theme: cat.theme } })}
                    >
                        <CardContent className="p-3 lg:p-5">
                            <div className="flex items-start gap-2.5 lg:gap-4">
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md lg:h-10 lg:w-10 lg:rounded-lg ${cat.color}`}>
                                    <cat.icon className="h-3.5 w-3.5 lg:h-5 lg:w-5" />
                                </div>
                                <div className="min-w-0 flex-1 space-y-1.5 lg:space-y-2">
                                    <p className="truncate text-[12px] font-medium leading-tight lg:text-sm">{cat.name}</p>
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground lg:text-xs">
                                        <span>{cat.reviewed}/{cat.total}</span>
                                        <span className="font-medium">{cat.pct}%</span>
                                    </div>
                                    <Progress value={cat.pct} className="h-1.5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Action section */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:mt-8 lg:gap-4">
                {/* Daily Review */}
                <Card className="relative overflow-hidden border-none bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                    <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />
                    <div className="absolute -bottom-8 right-10 h-16 w-16 rounded-full bg-white/5" />
                    <CardContent className="relative z-10 space-y-3 p-5 lg:p-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            <h3 className="text-lg font-bold">Revisão Diária</h3>
                        </div>
                        <p className="text-xs leading-relaxed opacity-80 lg:text-sm">
                            {stats.dueCount > 0
                                ? `${stats.dueCount} cartão${stats.dueCount !== 1 ? 'ões' : ''} agendado${stats.dueCount !== 1 ? 's' : ''} para hoje.`
                                : 'Nenhum cartão pendente. Você está em dia! 🎉'}
                        </p>
                        <Button
                            variant="secondary"
                            className="gap-1.5 bg-white text-primary hover:bg-white/90"
                            onClick={handleStartReview}
                            disabled={stats.dueCount === 0}
                        >
                            {stats.dueCount > 0 ? 'Iniciar Revisão' : 'Nada para revisar'}
                            {stats.dueCount > 0 && <ArrowRight className="h-3.5 w-3.5" />}
                        </Button>
                    </CardContent>
                </Card>

                {/* Learn New */}
                <Card className="relative overflow-hidden border-t-4 border-t-muted-foreground/30">
                    <CardContent className="flex h-full flex-col justify-between space-y-3 p-5 lg:p-6">
                        <div>
                            <div className="mb-1.5 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-muted-foreground" />
                                <h3 className="text-lg font-bold">Aprender Novos</h3>
                            </div>
                            <p className="text-xs text-muted-foreground lg:text-sm">
                                Adicione 10 novos cartões ao seu ciclo de aprendizado.
                            </p>
                        </div>
                        <Button variant="outline" className="gap-1.5 self-start text-xs lg:text-sm" onClick={handleStartNew}>
                            <BookOpen className="h-3.5 w-3.5" />
                            Aprender +10
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Gap Analysis / Suggested Focus */}
            {worstSubthemes.length > 0 && (
                <div className="mt-8 lg:mt-12">
                    <div className="mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-destructive" />
                        <h3 className="text-lg font-bold">Focos Estratégicos Recomendados</h3>
                    </div>
                    <p className="mb-4 text-xs text-muted-foreground lg:text-sm">
                        Baseado no seu histórico de simulados, estes são os subtemas com maior índice de erros.
                        Recomendamos priorizar a revisão e a criação de flashcards (via Gemini) para estes tópicos.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {worstSubthemes.map((ws, idx) => {
                            const Icon = themeIcons[ws.themeKey] || BookOpen;
                            const colorClass = themeColors[ws.themeKey] || 'text-primary bg-primary/10';
                            return (
                                <Card
                                    key={`${ws.themeKey}-${ws.subtheme}-${idx}`}
                                    className="cursor-pointer transition-colors hover:bg-muted/50"
                                    onClick={() => navigate('/flashcards/estudo', { state: { mode: 'theme', theme: ws.themeKey } })}
                                >
                                    <CardContent className="p-4 flex items-start gap-3">
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${colorClass}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-semibold text-muted-foreground">{ws.themeLabel}</p>
                                            <p className="font-bold text-sm leading-tight text-foreground mt-0.5">{ws.subtheme}</p>
                                            <div className="mt-2 flex items-center justify-between text-xs">
                                                <span className="text-destructive font-medium">{ws.errors} erros</span>
                                                <span className="text-muted-foreground">de {ws.total} questões</span>
                                            </div>
                                            <Progress
                                                value={(ws.errors / ws.total) * 100}
                                                className="h-1.5 mt-2 bg-destructive/20 [&>div]:bg-destructive"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Help text */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground lg:mt-8 lg:text-sm">
                <BookOpen className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                <span>Clique em uma categoria ou foco estratégico para iniciar a revisão</span>
            </div>
        </AppLayout>
    );
};

export default FlashcardsPage;
