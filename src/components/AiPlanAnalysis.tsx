import { useState } from 'react';
import { useAiTutor } from '@/hooks/useAiTutor';
import { UserProgress, THEME_LABELS } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Sparkles, AlertTriangle, RefreshCw, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface AiPlanAnalysisProps {
    progress: UserProgress;
}

export function AiPlanAnalysis({ progress }: AiPlanAnalysisProps) {
    const { askAi, isLoading, explanation, error, provider } = useAiTutor();
    const [isOpen, setIsOpen] = useState(false);
    const [hasAsked, setHasAsked] = useState(false);

    const handleAnalyze = async () => {
        setHasAsked(true);
        if (!isOpen) setIsOpen(true);

        // Build the rich context string from userProgress
        let statsReport = `Estatísticas Gerais do Aluno:
- Total de Simulados Concluídos: ${progress.totalSimulations}
- Questões Respondidas na vida: ${progress.totalQuestionsAnswered}
- Aproveitamento Global: ${(progress.overallAccuracy || 0).toFixed(1)}%

Desempenho Detalhado por Subtema:
`;

        if (progress.byTheme) {
            Object.entries(progress.byTheme).forEach(([themeKey, data]) => {
                const label = THEME_LABELS[themeKey as keyof typeof THEME_LABELS] || themeKey;
                statsReport += `- **${label}**: ${data.totalAttempts} questões | Acerto: ${data.accuracy.toFixed(1)}% | Tendência recente: ${data.trend}\n`;

                if (data.subthemeStats) {
                    const sortedSubthemes = Object.entries(data.subthemeStats).sort((a, b) => b[1].errors - a[1].errors);
                    sortedSubthemes.forEach(([subm, sts]) => {
                        statsReport += `  ↳ *${subm}*: ${sts.total} feitas, ${sts.errors} erros (${sts.correct} acertos)\n`;
                    });
                }
            });
        }

        await askAi(statsReport, '', 'analyze_plan');
    };

    return (
        <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
            {/* Header / Trigger */}
            <CardHeader
                className={cn("cursor-pointer px-4 py-4 lg:px-6 transition-colors hover:bg-primary/5")}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm text-primary lg:text-base">
                        <Sparkles className="h-5 w-5 text-yellow-500" />
                        Análise de Desempenho por IA (Gemini)
                    </CardTitle>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground lg:text-xs">
                    Cruza seus históricos de acertos com os temas que mais caem na Prova da ABP para montar um roteiro de foco.
                </p>
            </CardHeader>

            {/* Content Body */}
            {isOpen && (
                <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                    {!hasAsked && !explanation && !isLoading ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <BarChart3 className="mb-3 h-10 w-10 text-muted-foreground/50" />
                            <p className="mb-4 max-w-sm text-xs text-muted-foreground">
                                O Gemini irá analisar todas as suas {progress.totalQuestionsAnswered} respostas e gerar um laudo completo indicando onde focar as suas próximas dezenas de horas de estudo.
                            </p>
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAnalyze();
                                }}
                                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold hover:from-blue-700 hover:to-indigo-700 text-white"
                            >
                                <Brain className="h-4 w-4" />
                                Gerar Laudo Estratégico
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-2 space-y-4 rounded-xl bg-white p-4 shadow-inner dark:bg-slate-950 lg:p-6">
                            {isLoading ? (
                                <div className="space-y-4">
                                    <div className="flex animate-pulse items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <Sparkles className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800"></div>
                                            <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800/50"></div>
                                        </div>
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/6" />
                                    <div className="pt-4">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="mt-4 h-24 w-full rounded-lg" />
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-950/30 dark:text-red-300">
                                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                                    <div>
                                        <h4 className="text-sm font-semibold">Falha na Análise</h4>
                                        <p className="mt-1 text-xs">{error}</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAnalyze();
                                            }}
                                            className="mt-3 gap-2 border-red-200 hover:bg-red-100 dark:border-red-900 dark:hover:bg-red-900/50"
                                        >
                                            <RefreshCw className="h-3.5 w-3.5" />
                                            Tentar Novamente
                                        </Button>
                                    </div>
                                </div>
                            ) : explanation ? (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mentor IA</span>
                                        </div>
                                        {provider && (
                                            <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-medium text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                                <Sparkles className="h-3 w-3" />
                                                Powered by {provider === 'gemini' ? 'Gemini 2.5' : provider.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans mt-2">
                                        {explanation.split('\n').map((line, i) => {
                                            if (!line.trim()) return <br key={i} className="my-1" />;

                                            let content: React.ReactNode = line;

                                            // Handle bold (simplistic approach for visual parity)
                                            if (typeof content === 'string' && content.includes('**')) {
                                                const parts = content.split('**');
                                                content = parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-indigo-700 dark:text-indigo-400 font-semibold">{part}</strong> : part);
                                            }

                                            return (
                                                <p key={i} className={cn(
                                                    "min-h-[1em]",
                                                    line.startsWith('# ') ? "text-lg font-bold text-primary mt-4 mb-2" : "",
                                                    line.startsWith('## ') ? "text-base font-bold text-primary mt-3 mb-1" : "",
                                                    line.startsWith('### ') ? "text-[14px] font-semibold text-foreground mt-2" : "",
                                                    line.startsWith('- ') || line.startsWith('• ') ? "pl-4 mb-0.5 list-item ml-4" : "",
                                                    line.match(/^\d+\. /) ? "pl-4 mb-0.5 list-item ml-4" : "",
                                                    line.startsWith('>') ? "border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 my-2 italic text-muted-foreground rounded-r" : ""
                                                )}>
                                                    {content}
                                                </p>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAnalyze();
                                            }}
                                            className="gap-2 text-xs text-muted-foreground hover:text-primary"
                                        >
                                            <RefreshCw className="h-3.5 w-3.5" />
                                            Re-analisar Dados
                                        </Button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}
