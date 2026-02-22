import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, ThumbsUp, CheckCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFlashcards } from '../hooks/useFlashcards';
import { SRSGrade } from '../services/srs';
import { Flashcard } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { db } from '@/db/database';
import { CustomFlashcard } from '@/types';
import { FlashcardBase } from '@/components/ui/FlashcardBase';
import { flashcardsOriginais } from '../db/flashcards_originais';

type UnifiedCard = Flashcard;

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
    const subthemeFilter = location.state?.subtheme;

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
            const standardDue = getDueCards().filter(q => (!themeFilter || q.theme === themeFilter) && (!subthemeFilter || q.subtheme === subthemeFilter));

            // Custom due OR New (we want AI generated cards to be immediately available)
            const customDue = customCards.filter(fc => {
                if (subthemeFilter && fc.subtheme !== subthemeFilter) return false;
                const p = progress[fc.id];
                if (!p || p.repetition === 0) return true;
                return p.dueDate <= now;
            });

            cards = [...standardDue, ...customDue];
        } else if (mode === 'theme') {
            const standardDue = getDueCards().filter(q => q.theme === themeFilter && (!subthemeFilter || q.subtheme === subthemeFilter));
            const customDue = customCards.filter(fc => {
                if (subthemeFilter && fc.subtheme !== subthemeFilter) return false;
                const p = progress[fc.id];
                if (!p || p.repetition === 0) return true;
                return p.dueDate <= now && fc.theme === themeFilter;
            });

            const standardUnlearned = flashcardsOriginais.filter((q: Flashcard) => q.theme === themeFilter && (!subthemeFilter || q.subtheme === subthemeFilter) && getCardData(q.id).repetition === 0);
            const standardNewSubset = standardUnlearned.sort(() => 0.5 - Math.random()).slice(0, 15);

            cards = [...standardDue, ...customDue, ...standardNewSubset];
        } else if (mode === 'new') {
            const standardUnlearned = flashcardsOriginais.filter((q: Flashcard) => getCardData(q.id).repetition === 0 && (!themeFilter || q.theme === themeFilter) && (!subthemeFilter || q.subtheme === subthemeFilter));
            const standardSubset = standardUnlearned.sort(() => 0.5 - Math.random()).slice(0, 10);

            const customUnlearned = customCards.filter(c => getCardData(c.id).repetition === 0 && (!subthemeFilter || c.subtheme === subthemeFilter));
            const customSubset = customUnlearned.sort(() => 0.5 - Math.random()).slice(0, 10);

            cards = [...standardSubset, ...customSubset];
        }

        // Shuffle mixed queue
        setQueue(cards.sort(() => 0.5 - Math.random()));
        setLoading(false);
    }, [mode, themeFilter, getDueCards, getCardData, customCards, progress]);

    useEffect(() => {
        if (!loading && queue.length > 0 && currentIndex >= queue.length) {
            // Big burst on session complete!
            const duration = 2 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 40 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        }
    }, [loading, queue.length, currentIndex]);

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
        if (grade >= 4) { // 4=Bom, 5=Fácil
            confetti({
                particleCount: grade === 5 ? 50 : 25,
                spread: 60,
                origin: { y: 0.8 },
                colors: grade === 5 ? ['#22c55e', '#4ade80', '#16a34a'] : ['#3b82f6', '#60a5fa', '#2563eb']
            });
        }
        submitReview(currentCard.id, grade);
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
    };

    // Keyboard Accessibility
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (loading || !currentCard) return;

            // Flip card on Space or Enter (if not flipped)
            if (!isFlipped && (e.code === 'Space' || e.code === 'Enter')) {
                e.preventDefault();
                handleFlip();
                return;
            }

            // Rate card when flipped
            if (isFlipped) {
                switch (e.key) {
                    case '1':
                        handleRate(0); // Errei
                        break;
                    case '2':
                        handleRate(3); // Difícil
                        break;
                    case '3':
                        handleRate(4); // Bom
                        break;
                    case '4':
                        handleRate(5); // Fácil
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [loading, currentCard, isFlipped, handleRate]);

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
                        <div className="space-y-4 h-full flex flex-col">
                            <FlashcardBase
                                card={currentCard}
                                isFlipped={isFlipped}
                                onFlip={() => !isFlipped && handleFlip()}
                                showHelpText={false}
                            />
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
                                        <span className="hidden lg:inline-block mt-0.5 text-[8px] opacity-70">[1]</span>
                                    </button>
                                    <button
                                        onClick={() => handleRate(3)}
                                        className="flex flex-col items-center justify-center rounded-lg bg-muted p-2.5 transition-colors hover:bg-muted/80 lg:p-3"
                                    >
                                        <span className="mb-0.5 text-base lg:text-lg">😐</span>
                                        <span className="text-[9px] font-bold uppercase lg:text-[10px]">Difícil</span>
                                        <span className="hidden lg:inline-block mt-0.5 text-[8px] opacity-70">[2]</span>
                                    </button>
                                    <button
                                        onClick={() => handleRate(4)}
                                        className="flex flex-col items-center justify-center rounded-lg bg-blue-100 p-2.5 text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 lg:p-3"
                                    >
                                        <ThumbsUp className="mb-0.5 h-4 w-4 lg:h-5 lg:w-5" />
                                        <span className="text-[9px] font-bold uppercase lg:text-[10px]">Bom</span>
                                        <span className="hidden lg:inline-block mt-0.5 text-[8px] opacity-70">[3]</span>
                                    </button>
                                    <button
                                        onClick={() => handleRate(5)}
                                        className="flex flex-col items-center justify-center rounded-lg bg-green-100 p-2.5 text-green-700 transition-colors hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 lg:p-3"
                                    >
                                        <CheckCheck className="mb-0.5 h-4 w-4 lg:h-5 lg:w-5" />
                                        <span className="text-[9px] font-bold uppercase lg:text-[10px]">Fácil</span>
                                        <span className="hidden lg:inline-block mt-0.5 text-[8px] opacity-70">[4]</span>
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
