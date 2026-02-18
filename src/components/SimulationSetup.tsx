import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulationStore } from '../store/simulationStore';
import { PsychiatryTheme, THEME_LABELS } from '../types';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Shuffle,
    Target,
    Loader2,
    Gauge,
    Brain,
    FileText,
    ArrowRight,
    CheckCircle2,
    BookOpen,
} from 'lucide-react';

const QUESTION_COUNTS = [5, 10, 15, 20, 30, 50, 90];

export default function SimulationSetup() {
    const navigate = useNavigate();
    const { startSimulation, isLoading } = useSimulationStore();
    const [questionCount, setQuestionCount] = useState(10);
    const [focusTheme, setFocusTheme] = useState<PsychiatryTheme | 'all'>('all');
    const [mode, setMode] = useState<'mixed' | 'focused' | 'adaptive'>('mixed');
    const [difficulty, setDifficulty] = useState<1 | 2 | 3 | undefined>(undefined);

    const handleStart = async () => {
        const theme = mode === 'focused' && focusTheme !== 'all' ? focusTheme : undefined;
        await startSimulation(questionCount, { theme, difficulty, adaptive: mode === 'adaptive' });
        navigate('/simulado/active');
    };

    const themes = Object.entries(THEME_LABELS) as [PsychiatryTheme, string][];

    return (
        <AppLayout title="Novo Simulado" subtitle="Configure e inicie">
            <div className="grid gap-4 lg:grid-cols-5 lg:gap-6">
                {/* Config - 3/5 */}
                <div className="space-y-4 lg:col-span-3 lg:space-y-6">
                    {/* Mode Selection */}
                    <Card>
                        <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                                <Shuffle className="h-3.5 w-3.5 text-primary lg:h-4 lg:w-4" />
                                Modo do Simulado
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                            <div className="grid gap-2 sm:grid-cols-3 lg:gap-3">
                                {[
                                    {
                                        key: 'mixed' as const,
                                        label: 'Misto',
                                        desc: 'Todas as áreas temáticas',
                                        icon: Shuffle,
                                    },
                                    {
                                        key: 'focused' as const,
                                        label: 'Focado',
                                        desc: 'Área específica',
                                        icon: Target,
                                    },
                                    {
                                        key: 'adaptive' as const,
                                        label: 'Adaptativo',
                                        desc: 'Prioriza áreas fracas',
                                        icon: Brain,
                                    },
                                ].map((m) => (
                                    <button
                                        key={m.key}
                                        onClick={() => setMode(m.key)}
                                        className={`flex items-start gap-2.5 rounded-lg border-2 p-3 text-left transition-all lg:gap-3 lg:p-4 ${mode === m.key
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/30'
                                            }`}
                                    >
                                        <m.icon
                                            className={`mt-0.5 h-4 w-4 shrink-0 lg:h-5 lg:w-5 ${mode === m.key ? 'text-primary' : 'text-muted-foreground'
                                                }`}
                                        />
                                        <div>
                                            <p className="text-[12px] font-medium lg:text-sm">{m.label}</p>
                                            <p className="text-[10px] text-muted-foreground lg:text-xs">{m.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Theme Selection (focused mode) */}
                    {mode === 'focused' && (
                        <Card>
                            <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                                <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                                    <BookOpen className="h-3.5 w-3.5 text-primary lg:h-4 lg:w-4" />
                                    Área Temática
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                                <div className="flex flex-wrap gap-1.5 lg:gap-2">
                                    {themes.map(([key, label]) => (
                                        <Badge
                                            key={key}
                                            variant={focusTheme === key ? 'default' : 'outline'}
                                            className="cursor-pointer px-2 py-1 text-[11px] transition-all hover:scale-105 lg:px-3 lg:py-1.5 lg:text-sm"
                                            onClick={() => setFocusTheme(key)}
                                        >
                                            {focusTheme === key && (
                                                <CheckCircle2 className="mr-1 h-2.5 w-2.5 lg:h-3 lg:w-3" />
                                            )}
                                            {label}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="mt-2 text-[10px] text-muted-foreground lg:mt-3 lg:text-xs">
                                    {focusTheme === 'all'
                                        ? 'Nenhum selecionado — todas as áreas serão incluídas'
                                        : `Tema: ${THEME_LABELS[focusTheme as PsychiatryTheme]}`}
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Question count */}
                    <Card>
                        <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                                <FileText className="h-3.5 w-3.5 text-primary lg:h-4 lg:w-4" />
                                Quantidade de Questões
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:gap-3">
                                {QUESTION_COUNTS.map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setQuestionCount(n)}
                                        className={`rounded-lg border-2 p-3 text-center transition-all lg:p-4 ${questionCount === n
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border hover:border-primary/30'
                                            }`}
                                    >
                                        <span className="text-xl font-bold lg:text-2xl">{n}</span>
                                        <p className="text-[10px] text-muted-foreground lg:text-xs">questões</p>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Difficulty */}
                    <Card>
                        <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                            <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                                <Gauge className="h-3.5 w-3.5 text-primary lg:h-4 lg:w-4" />
                                Dificuldade
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:gap-3">
                                {[
                                    { value: undefined as 1 | 2 | 3 | undefined, label: 'Todas' },
                                    { value: 1 as const, label: 'Fácil' },
                                    { value: 2 as const, label: 'Médio' },
                                    { value: 3 as const, label: 'Difícil' },
                                ].map((opt) => (
                                    <button
                                        key={opt.label}
                                        onClick={() => setDifficulty(opt.value)}
                                        className={`rounded-lg border-2 p-3 text-center transition-all lg:p-4 ${difficulty === opt.value
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border hover:border-primary/30'
                                            }`}
                                    >
                                        <p className="text-[12px] font-medium lg:text-sm">{opt.label}</p>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary - 2/5 */}
                <div className="lg:col-span-2">
                    <Card className="sticky top-20">
                        <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                            <CardTitle className="text-base lg:text-lg">Resumo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 px-4 pb-4 lg:space-y-4 lg:px-6 lg:pb-6">
                            <div className="space-y-2 text-[12px] lg:space-y-3 lg:text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Modo</span>
                                    <span className="font-medium">
                                        {mode === 'mixed' ? 'Misto' : mode === 'focused' ? 'Focado' : 'Adaptativo'}
                                    </span>
                                </div>
                                {mode === 'focused' && focusTheme !== 'all' && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tema</span>
                                        <span className="font-medium">{THEME_LABELS[focusTheme as PsychiatryTheme]}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Questões</span>
                                    <span className="font-medium">{questionCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Dificuldade</span>
                                    <span className="font-medium">
                                        {difficulty === undefined ? 'Todas' : difficulty === 1 ? 'Fácil' : difficulty === 2 ? 'Médio' : 'Difícil'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tempo estimado</span>
                                    <span className="font-medium">~{Math.round(questionCount * 1.5)} min</span>
                                </div>
                            </div>

                            <hr />

                            <Button
                                className="w-full gap-2 text-[12px] lg:text-sm"
                                size="lg"
                                onClick={handleStart}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Carregando...
                                    </>
                                ) : (
                                    <>
                                        Iniciar Simulado
                                        <ArrowRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
