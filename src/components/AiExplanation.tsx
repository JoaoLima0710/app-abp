
import { useState } from 'react';
import { useAiTutor } from '@/hooks/useAiTutor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Bot, BookOpen, ChevronDown, ChevronUp, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface AiExplanationProps {
    questionBody: string;
    alternatives: Record<string, string>;
    correctAnswer: string;
    userAnswer?: string;
    className?: string;
}

export function AiExplanation({
    questionBody,
    alternatives,
    correctAnswer,
    userAnswer,
    className
}: AiExplanationProps) {
    const { askAi, isLoading, explanation, error } = useAiTutor();
    const [isOpen, setIsOpen] = useState(false);
    const [hasAsked, setHasAsked] = useState(false);

    const handleAsk = () => {
        if (!isOpen) setIsOpen(true);
        if (!hasAsked && !explanation) {
            setHasAsked(true);
            const context = `
Alternativas:
A) ${alternatives.A}
B) ${alternatives.B}
C) ${alternatives.C}
D) ${alternatives.D}
E) ${alternatives.E}

Gabarito Oficial: ${correctAnswer}
${userAnswer ? `Resposta do Aluno: ${userAnswer}` : ''}
            `.trim();
            askAi(questionBody, context);
        }
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={cn("mt-4", className)}>
            {!hasAsked ? (
                <Button
                    variant="outline"
                    className="w-full gap-2 border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300 dark:hover:bg-indigo-950/50"
                    onClick={handleAsk}
                >
                    <Sparkles className="h-4 w-4" />
                    Explicar com IA (DSM-5-TR / ABP)
                </Button>
            ) : (
                <Card className="border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/10">
                    <div
                        className="flex cursor-pointer items-center justify-between px-4 py-3"
                        onClick={handleToggle}
                    >
                        <div className="flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                            <Bot className="h-4 w-4" />
                            Tutor IA
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-indigo-500">
                            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </div>

                    {isOpen && (
                        <CardContent className="border-t border-indigo-100 px-4 py-4 dark:border-indigo-800/50">
                            {isLoading ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Sparkles className="h-3 w-3 animate-pulse" />
                                        Consultando base de conhecimento (DSM-5-TR)...
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-[90%]" />
                                    <Skeleton className="h-4 w-[95%]" />
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="flex items-center gap-2 text-sm text-red-500">
                                        <AlertTriangle className="h-4 w-4" />
                                        Erro ao consultar IA
                                    </div>
                                    <p className="text-xs text-muted-foreground">{error}</p>
                                    <Button variant="outline" size="sm" onClick={() => askAi(questionBody, '')} className="mt-2 gap-2">
                                        <RefreshCw className="h-3 w-3" /> Tentar Novamente
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed text-foreground/90 lg:text-sm">
                                        {/* Simple formatting for basic markdown-like structures */}
                                        {explanation?.split('\n').map((line, i) => (
                                            <p key={i} className={cn(
                                                "min-h-[1em]",
                                                line.startsWith('-') || line.startsWith('•') ? "pl-4" : "",
                                                line.match(/^\d+\./) ? "pl-4" : ""
                                            )}>
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground opacity-70 lg:text-xs">
                                        <BookOpen className="h-3 w-3" />
                                        fontes: DSM-5-TR, Tratado de Psiquiatria da ABP
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
