import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, ThumbsUp, Check, CheckCheck, Sparkles } from 'lucide-react';
import { useFlashcards } from '../hooks/useFlashcards';
import { questionsOriginais as questions } from '../db/questions_originais';
import { SRSGrade } from '../services/srs';
import { Question } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { db } from '@/db/database';
import { CustomFlashcard } from '@/types';

type UnifiedCard =
    | { isCustom: false; data: Question; id: string }
    | { isCustom: true; data: CustomFlashcard; id: string };

const FlashcardStudyPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getDueCards, submitReview, getCardData, progress } = useFlashcards();
    const [queue, setQueue] = useState<UnifiedCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);

    const [customCards, setCustomCards] = useState<CustomFlashcard[] | undefined>(undefined);

    const mode = location.state?.mode || 'due';
    const themeFilter = location.state?.theme;

    // Fetch custom flashcards from Dexie
    useEffect(() => {
        const fetchCustomCards = async () => {
            const cards = themeFilter
                ? await db.customFlashcards.where('theme').equals(themeFilter).toArray()
                : await db.customFlashcards.toArray();
            setCustomCards(cards);
        };
        fetchCustomCards();
    }, [themeFilter]);

    useEffect(() => {
        if (customCards === undefined) return; // Wait until dexie loads

        let cards: UnifiedCard[] = [];
        const now = Date.now();

        if (mode === 'due') {
            // Standard due
            const standardDue = getDueCards().filter(q => !themeFilter || q.theme === themeFilter);

            // Custom due OR New (we want AI generated cards to be immediately available)
            const customDue = customCards.filter(fc => {
                const p = progress[fc.id];
                // If no progress exists, or repetition is 0, it's new -> due now
                if (!p || p.repetition === 0) return true;
                // Otherwise check if it's due based on time
                return p.dueDate <= now;
            });

            cards = [
                ...standardDue.map(q => ({ isCustom: false as const, data: q, id: q.id })),
                ...customDue.map(c => ({ isCustom: true as const, data: c, id: c.id }))
            ];
        } else if (mode === 'theme') {
            // Mixed session for a specific theme: All DUE cards + Some NEW cards
            const standardDue = getDueCards().filter(q => q.theme === themeFilter);
            const customDue = customCards.filter(fc => {
                const p = progress[fc.id];
                if (!p || p.repetition === 0) return true;
                return p.dueDate <= now && fc.theme === themeFilter;
            });

            // New cards for theme (Standard limit to 15, Custom limit to 15)
            const standardUnlearned = questions.filter(q => q.theme === themeFilter && getCardData(q.id).repetition === 0);
            const standardNewSubset = standardUnlearned.sort(() => 0.5 - Math.random()).slice(0, 15);

            // Avoid adding custom unlearned twice since they are already caught in customDue logic above
            // Actually, customDue catches ALL new custom cards if progress repetition === 0. 
            // So we don't need to add customNewSubset array avoiding duplicates. 

            cards = [
                ...standardDue.map(q => ({ isCustom: false as const, data: q, id: q.id })),
                ...customDue.map(c => ({ isCustom: true as const, data: c, id: c.id })),
                ...standardNewSubset.map(q => ({ isCustom: false as const, data: q, id: q.id }))
            ];
        } else if (mode === 'new') {
            // Standard new
            const standardUnlearned = questions.filter(q => getCardData(q.id).repetition === 0 && (!themeFilter || q.theme === themeFilter));
            const standardSubset = standardUnlearned.sort(() => 0.5 - Math.random()).slice(0, 10);

            // Custom new
            const customUnlearned = customCards.filter(c => getCardData(c.id).repetition === 0);
            const customSubset = customUnlearned.sort(() => 0.5 - Math.random()).slice(0, 10);

            cards = [
                ...standardSubset.map(q => ({ isCustom: false as const, data: q, id: q.id })),
                ...customSubset.map(c => ({ isCustom: true as const, data: c, id: c.id }))
            ];
        }

        // Shuffle mixed queue
        setQueue(cards.sort(() => 0.5 - Math.random()));
        setLoading(false);
    }, [mode, themeFilter, getDueCards, getCardData, customCards, progress]);

    const currentCard = queue[currentIndex];

    if (!loading && !currentCard) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="space-y-4 p-6 lg:p-8">
                        <CheckCheck className="mx-auto h-14 w-14 text-green-500" />
                        <div>
                            <h2 className="text-xl font-bold lg:text-2xl">Sessão Concluída!</h2>
                            <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                                Você completou todos os cartões desta sessão.
                            </p>
                        </div>
                        <Button className="gap-1.5" onClick={() => navigate('/flashcards')}>
                            Voltar ao Painel
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleFlip = () => {
        setIsFlipped(true);
    };

    const handleRate = (grade: SRSGrade) => {
        submitReview(currentCard.id, grade);
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-muted-foreground">Carregando...</p>
            </div>
        );
    }

    const progressPct = Math.min(100, (currentIndex / queue.length) * 100);

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-3xl space-y-4 px-4 py-4 pb-24 lg:space-y-6 lg:py-6 lg:pb-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => navigate('/flashcards')}>
                        <ArrowLeft className="h-4 w-4" />
                        Sair
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        Cartão {currentIndex + 1} de {queue.length}
                    </span>
                </div>

                {/* Progress */}
                <Progress value={progressPct} className="h-1.5" />

                {/* Flash Card */}
                <Card className="min-h-[400px] shadow-xl">
                    <CardContent className="flex h-full flex-col justify-between p-6 lg:p-8">
                        <div className="space-y-4">
                            <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider", currentCard.isCustom ? "border-purple-200 text-purple-700 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300" : "")}>
                                {isFlipped ? 'Resposta' : 'Pergunta'}{currentCard.isCustom ? ' (IA)' : ''}
                            </Badge>

                            <p className="text-base leading-relaxed lg:text-lg lg:leading-7 font-medium whitespace-pre-wrap">
                                {currentCard.isCustom ? currentCard.data.front : currentCard.data.statement}
                            </p>

                            {/* Options (shown on question side, only for standard) */}
                            {!isFlipped && !currentCard.isCustom && currentCard.data.options && (
                                <div className="mt-6 space-y-1.5 opacity-60 transition-opacity hover:opacity-100">
                                    {Object.entries(currentCard.data.options).map(([key, text]) => (
                                        <div key={key} className="rounded-md border p-2 text-xs text-muted-foreground">
                                            <span className="mr-2 font-bold">{key})</span> {text as string}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Answer (shown on flip) */}
                            {isFlipped && (
                                <div className="mt-4 space-y-4 border-t pt-4">
                                    {currentCard.isCustom ? (
                                        <div className="rounded-lg bg-purple-50/50 p-4 border border-purple-100 dark:bg-purple-900/10 dark:border-purple-900/30">
                                            <div className="flex items-center gap-2 text-xs font-bold text-purple-600 mb-2 dark:text-purple-400">
                                                <Sparkles className="h-3.5 w-3.5" />
                                                Gabarito IA
                                            </div>
                                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                                                {currentCard.data.back}
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2 text-lg font-bold text-green-600 dark:text-green-400 lg:text-xl">
                                                <Check className="h-5 w-5" />
                                                Gabarito: {currentCard.data.correctAnswer}
                                            </div>

                                            <div className="rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground lg:p-4 lg:text-sm">
                                                <p className="whitespace-pre-wrap">{currentCard.data.explanation.correct}</p>
                                            </div>

                                            {currentCard.data.itemAnalysis && (
                                                <div className="space-y-2">
                                                    <h4 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground lg:text-xs">
                                                        <span className="h-3.5 w-0.5 rounded-full bg-primary" />
                                                        Análise Item a Item
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {Object.entries(currentCard.data.itemAnalysis).map(([key, analysis]) => {
                                                            const isCorrect = key === currentCard.data.correctAnswer;
                                                            return (
                                                                <div
                                                                    key={key}
                                                                    className={cn(
                                                                        'rounded-lg border p-3 text-xs lg:p-4',
                                                                        isCorrect
                                                                            ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30'
                                                                            : 'hover:bg-muted/30',
                                                                    )}
                                                                >
                                                                    <div className="flex gap-2">
                                                                        <span className={cn(
                                                                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                                                                            isCorrect
                                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                                                : 'bg-muted text-muted-foreground',
                                                                        )}>
                                                                            {key}
                                                                        </span>
                                                                        <div className="space-y-0.5">
                                                                            <p className={cn(
                                                                                'text-xs font-medium',
                                                                                isCorrect && 'text-green-900 dark:text-green-100',
                                                                            )}>
                                                                                {(currentCard.data.options as any)[key]}
                                                                            </p>
                                                                            <p className={cn(
                                                                                'text-[10px] leading-relaxed lg:text-xs',
                                                                                isCorrect ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground',
                                                                            )}>
                                                                                {analysis as string}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="mt-6">
                            {!isFlipped ? (
                                <Button size="lg" className="w-full text-sm lg:text-base" onClick={handleFlip}>
                                    Mostrar Resposta
                                </Button>
                            ) : (
                                <div className="grid grid-cols-4 gap-1.5 lg:gap-2">
                                    <button
                                        onClick={() => handleRate(0)}
                                        className="flex flex-col items-center justify-center rounded-lg bg-orange-100 p-2.5 text-orange-700 transition-colors hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 lg:p-3"
                                    >
                                        <RotateCcw className="mb-0.5 h-4 w-4 lg:h-5 lg:w-5" />
                                        <span className="text-[9px] font-bold uppercase lg:text-[10px]">Errei</span>
                                    </button>
                                    <button
                                        onClick={() => handleRate(3)}
                                        className="flex flex-col items-center justify-center rounded-lg bg-muted p-2.5 transition-colors hover:bg-muted/80 lg:p-3"
                                    >
                                        <span className="mb-0.5 text-base lg:text-lg">😐</span>
                                        <span className="text-[9px] font-bold uppercase lg:text-[10px]">Difícil</span>
                                    </button>
                                    <button
                                        onClick={() => handleRate(4)}
                                        className="flex flex-col items-center justify-center rounded-lg bg-blue-100 p-2.5 text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 lg:p-3"
                                    >
                                        <ThumbsUp className="mb-0.5 h-4 w-4 lg:h-5 lg:w-5" />
                                        <span className="text-[9px] font-bold uppercase lg:text-[10px]">Bom</span>
                                    </button>
                                    <button
                                        onClick={() => handleRate(5)}
                                        className="flex flex-col items-center justify-center rounded-lg bg-green-100 p-2.5 text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 lg:p-3"
                                    >
                                        <CheckCheck className="mb-0.5 h-4 w-4 lg:h-5 lg:w-5" />
                                        <span className="text-[9px] font-bold uppercase lg:text-[10px]">Fácil</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FlashcardStudyPage;
