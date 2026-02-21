import { useState } from 'react';
import { useAiTutor } from '@/hooks/useAiTutor';
import { THEME_LABELS, PsychiatryTheme, CustomFlashcard } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Bot, BookOpen, AlertTriangle, RefreshCw, ChevronDown, ChevronUp, Layers, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserId } from '@/lib/supabaseClient';

interface AiStudyGuideProps {
    theme: PsychiatryTheme;
}

export function AiStudyGuide({ theme }: AiStudyGuideProps) {
    const { askAi, isLoading, explanation, error, provider } = useAiTutor();
    const [isOpen, setIsOpen] = useState(false);
    const [hasAsked, setHasAsked] = useState(false);

    // Flashcard generation state
    const [isGeneratingFc, setIsGeneratingFc] = useState(false);
    const [fcSuccess, setFcSuccess] = useState(false);
    const [fcError, setFcError] = useState<string | null>(null);

    const themeName = THEME_LABELS[theme];

    const handleAsk = () => {
        if (!isOpen) setIsOpen(true);
        if (!hasAsked && !explanation) {
            setHasAsked(true);
            askAi(themeName, 'Foque nos critérios do DSM-5-TR, epidemiologia, quadro clínico e tratamento.', 'study_guide');
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleGenerateFlashcards = async () => {
        if (isGeneratingFc || fcSuccess) return;
        setIsGeneratingFc(true);
        setFcError(null);

        try {
            // We use the same hook to fetch JSON flashcards (assuming askAi parses it correctly)
            const cards = await askAi(themeName, 'Foque nos pontos de alto rendimento: critérios diagnósticos cruciais, antídotos e efeitos adversos específicos.', 'generate_flashcards');

            if (Array.isArray(cards) && cards.length > 0) {
                // Save to local IndexedDB
                const userId = getUserId() || 'anonymous';

                const dbObjects: CustomFlashcard[] = cards.map(c => ({
                    id: crypto.randomUUID(),
                    theme,
                    front: c.front,
                    back: c.back,
                    createdAt: new Date(),
                    userId
                }));

                // Lazy load db and save
                const { db: database } = await import('@/db/database');
                await database.customFlashcards.bulkAdd(dbObjects);

                setFcSuccess(true);
            } else {
                setFcError('IA não retornou um formato JSON válido.');
            }
        } catch (err: any) {
            setFcError(err.message || 'Erro ao gerar flashcards.');
        } finally {
            setIsGeneratingFc(false);
        }
    };

    return (
        <div className="mt-3">
            {!hasAsked ? (
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 border-indigo-200 bg-indigo-50 text-[11px] text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300 dark:hover:bg-indigo-950/50 lg:text-xs"
                    onClick={handleAsk}
                >
                    <Sparkles className="h-3.5 w-3.5" />
                    Aprofundar com IA
                </Button>
            ) : (
                <Card className="border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/10">
                    <div
                        className="flex cursor-pointer items-center justify-between px-3 py-2.5"
                        onClick={handleToggle}
                    >
                        <div className="flex items-center gap-2 text-[11px] font-medium text-indigo-700 dark:text-indigo-300 lg:text-xs">
                            <Bot className="h-3.5 w-3.5" />
                            Guia de Estudo: {themeName}
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-indigo-500">
                            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </div>

                    {isOpen && (
                        <CardContent className="border-t border-indigo-100 px-3 py-3 dark:border-indigo-800/50 lg:px-4 lg:py-4">
                            {isLoading ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground lg:text-xs">
                                        <Sparkles className="h-3 w-3 animate-pulse" />
                                        Escrevendo guia super detalhado...
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-[90%]" />
                                    <Skeleton className="h-4 w-[95%]" />
                                    <Skeleton className="h-4 w-[85%]" />
                                    <Skeleton className="h-4 w-[60%]" />
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center gap-2 text-center py-2">
                                    <div className="flex items-center gap-2 text-xs text-red-500">
                                        <AlertTriangle className="h-4 w-4" />
                                        Erro ao consultar IA
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">{error}</p>
                                    <Button variant="outline" size="sm" onClick={() => askAi(themeName, '', 'study_guide')} className="mt-2 h-7 gap-1.5 text-[10px]">
                                        <RefreshCw className="h-3 w-3" /> Tentar Novamente
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed text-foreground/90 lg:text-sm">
                                        {/* Simple formatting for markdown-like structures */}
                                        {explanation?.split('\n').map((line, i) => {
                                            if (line.trim() === '') return <br key={i} className="my-1" />;
                                            let content: React.ReactNode = line;

                                            // Handle bold **text**
                                            const boldParts = line.split(/(\*\*.*?\*\*)/g);
                                            if (boldParts.length > 1) {
                                                content = boldParts.map((part, idx) => {
                                                    if (part.startsWith('**') && part.endsWith('**')) {
                                                        return <strong key={idx}>{part.slice(2, -2)}</strong>;
                                                    }
                                                    return part;
                                                });
                                            }

                                            return (
                                                <p key={i} className={cn(
                                                    "min-h-[1em]",
                                                    line.startsWith('## ') ? "text-sm font-bold text-indigo-700 dark:text-indigo-400 mt-3 mb-1" : "",
                                                    line.startsWith('### ') ? "text-[13px] font-semibold text-foreground mt-2" : "",
                                                    line.startsWith('- ') || line.startsWith('• ') ? "pl-4 mb-0.5 list-item ml-4" : "",
                                                    line.match(/^\d+\. /) ? "pl-4 mb-0.5 list-item ml-4" : ""
                                                )}>
                                                    {content}
                                                </p>
                                            );
                                        })}
                                    </div>

                                    <div className="flex items-center justify-between border-t border-indigo-100/50 pt-3 dark:border-indigo-800/30">
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground opacity-70">
                                            <BookOpen className="h-3 w-3" />
                                            fontes: DSM-5-TR, Tratado ABP
                                        </div>
                                        {provider && (
                                            <span className={cn(
                                                'rounded-full px-2 py-0.5 text-[9px] font-medium',
                                                provider === 'poe'
                                                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400'
                                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                                            )}>
                                                {provider === 'poe' ? '📚 POE' : '✨ Gemini'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Generate Flashcards Button Section */}
                                    <div className="rounded-lg bg-background p-3 shadow-sm border mt-3">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Layers className="h-4 w-4 text-primary" />
                                            <span className="text-xs font-semibold">Decore os detalhes</span>
                                        </div>
                                        <p className="mb-3 text-[10px] sm:text-[11px] text-muted-foreground leading-snug">
                                            Transforme este guia em cards de memória (Flashcards) e estude eles usando repetição espaçada na aba Flashcards.
                                        </p>
                                        <Button
                                            size="sm"
                                            onClick={handleGenerateFlashcards}
                                            disabled={isGeneratingFc || fcSuccess}
                                            className="w-full h-8 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            {isGeneratingFc ? (
                                                <><Sparkles className="mr-2 h-3 w-3 animate-pulse" /> Criando cards mágicos...</>
                                            ) : fcSuccess ? (
                                                <><CheckCircle2 className="mr-2 h-3.5 w-3.5 text-green-300" /> Sucesso! Ver aba Flashcards</>
                                            ) : (
                                                <><Bot className="mr-2 h-3.5 w-3.5" /> Gerar Flashcards Específicos</>
                                            )}
                                        </Button>
                                        {fcError && <p className="mt-2 text-[10px] text-red-500 text-center">{fcError}</p>}
                                    </div>

                                </div>
                            )}
                        </CardContent>
                    )}
                </Card>
            )}
        </div>
    );
}
