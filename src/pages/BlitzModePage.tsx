import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Check, Zap } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { FlashcardBase } from '@/components/ui/FlashcardBase';
import { useFlashcards } from '../hooks/useFlashcards';
import { db } from '../db/database';
import { Flashcard } from '../types';
import confetti from 'canvas-confetti';
import { flashcardsOriginais } from '../db/flashcards_originais';

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

type UnifiedCard = Flashcard;

const SwipeableCard = ({ card, onSwipe, isTop, onFlipChange }: { card: UnifiedCard; onSwipe: (dir: 'left' | 'right') => void; isTop: boolean; onFlipChange?: (flipped: boolean) => void }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Color overlays
    const backgroundRight = useTransform(x, [0, 150], ['rgba(34, 197, 94, 0)', 'rgba(34, 197, 94, 0.4)']);
    const backgroundLeft = useTransform(x, [-150, 0], ['rgba(239, 68, 68, 0.4)', 'rgba(239, 68, 68, 0)']);

    // Icon Opacities
    const rightIconOpacity = useTransform(x, [0, 100], [0, 1]);
    const leftIconOpacity = useTransform(x, [-100, 0], [1, 0]);

    const handleDragEnd = (_: any, info: any) => {
        const threshold = 100;
        if (info.offset.x > threshold) {
            onSwipe('right');
        } else if (info.offset.x < -threshold) {
            onSwipe('left');
        }
    };

    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        if (isTop && onFlipChange) {
            onFlipChange(flipped);
        }
    }, [flipped, isTop, onFlipChange]);

    return (
        <motion.div
            style={isTop ? { x, rotate, opacity } : {}}
            drag={isTop && flipped ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={isTop ? handleDragEnd : undefined}
            className={`absolute inset-0 w-full h-full flex items-center justify-center ${!isTop && 'pointer-events-none'}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: isTop ? 1 : 0.95, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => isTop && setFlipped(!flipped)}
        >
            <Card className="w-full h-[450px] relative overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border-2 border-border/10 bg-card">

                {/* Visual Feedback Overlays */}
                <motion.div style={{ backgroundColor: backgroundRight }} className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
                    <motion.div style={{ opacity: rightIconOpacity }} className="bg-green-500 rounded-full p-4 shadow-lg mb-2">
                        <Check className="text-white w-12 h-12" />
                    </motion.div>
                    <motion.span style={{ opacity: rightIconOpacity }} className="text-green-600 font-bold text-xl uppercase tracking-widest bg-white/90 px-4 py-1 rounded-lg">
                        Acertei
                    </motion.span>
                </motion.div>

                <motion.div style={{ backgroundColor: backgroundLeft }} className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
                    <motion.div style={{ opacity: leftIconOpacity }} className="bg-red-500 rounded-full p-4 shadow-lg mb-2">
                        <X className="text-white w-12 h-12" />
                    </motion.div>
                    <motion.span style={{ opacity: leftIconOpacity }} className="text-red-600 font-bold text-xl uppercase tracking-widest bg-white/90 px-4 py-1 rounded-lg">
                        Errei
                    </motion.span>
                </motion.div>

                <CardContent className="h-full flex flex-col p-6 relative z-20 bg-card">
                    <FlashcardBase
                        card={card}
                        isFlipped={flipped}
                        onFlip={() => { }} // Flip is handled by the whole card container in swipe mode
                        showHelpText={false}
                    />
                    {flipped && (
                        <div className="mt-4 pt-4 border-t text-[10px] text-muted-foreground text-center shrink-0">
                            Agora deslize: 👈 Errei | Acertei 👉
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

const BlitzModePage: React.FC = () => {
    const { getDueCards, submitReview } = useFlashcards();
    const [queue, setQueue] = useState<UnifiedCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [isTopFlipped, setIsTopFlipped] = useState(false);

    // Initial load
    useEffect(() => {
        const loadCards = async () => {
            const standardDue = getDueCards();
            const customCardsResponse = await db.customFlashcards.toArray();

            // Generate a random pool of standard cards
            const randomStandards = shuffleArray([...flashcardsOriginais]).slice(0, 30);

            const pool: UnifiedCard[] = [
                ...standardDue,
                ...randomStandards,
                ...customCardsResponse
            ];

            // Unique shuffle
            const uniqueMap = new Map();
            pool.forEach(c => uniqueMap.set(c.id, c));
            const finalPool = shuffleArray(Array.from(uniqueMap.values()));

            setQueue(finalPool);
            setLoading(false);
        };

        loadCards();
    }, []);

    const handleSwipe = (direction: 'left' | 'right', currentCard: UnifiedCard) => {
        // Evaluate: Right = Easy (5), Left = Again (0)
        const grade = (direction === 'right' ? 5 : 0) as any;
        submitReview(currentCard.id, grade);

        if (direction === 'right') {
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.8 },
                colors: ['#22c55e', '#4ade80']
            });
        }

        // Pop card from queue
        setIsTopFlipped(false);
        setQueue(prev => prev.slice(1));
    };

    // Keyboard Accessibility
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (loading || queue.length === 0) return;

            const currentCard = queue[0];

            if (!isTopFlipped && (e.code === 'Space' || e.code === 'Enter')) {
                e.preventDefault();
                setIsTopFlipped(true);
                return;
            }

            if (isTopFlipped) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    handleSwipe('left', currentCard);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    handleSwipe('right', currentCard);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [loading, queue, isTopFlipped]);

    if (loading) {
        return (
            <AppLayout title="Blitz Mode" subtitle="Sessão infinita">
                <div className="flex min-h-[60vh] items-center justify-center">
                    <p className="text-muted-foreground animate-pulse">Gerando fila infinita...</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Blitz Mode" subtitle="Deslize rápido para fixar">
            <div className="flex flex-col items-center min-h-[70vh] justify-center relative w-full pt-10">
                <div className="mb-8 text-center z-10">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full mb-2">
                        <Zap className="w-4 h-4 fill-primary" />
                        <span className="text-sm font-semibold tracking-wide uppercase">Blitz Mode</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Deslize para a Esquerda (Errei) ou Direita (Acertei/Fácil)</p>
                </div>

                <div className="relative w-full max-w-sm h-[450px] flex items-center justify-center perspective-1000">
                    <AnimatePresence>
                        {queue.slice(0, 3).reverse().map((card, index) => (
                            <SwipeableCard
                                key={card.id}
                                card={card}
                                onSwipe={(dir) => handleSwipe(dir, card)}
                                isTop={index === queue.slice(0, 3).length - 1} // Array is reversed so last item in slice is visually on top
                                onFlipChange={(f) => setIsTopFlipped(f)}
                            />
                        ))}
                    </AnimatePresence>

                    {queue.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                            <Zap className="w-12 h-12 mb-4 opacity-50" />
                            <h3 className="font-bold text-lg text-foreground">Sessão Blitz Concluída</h3>
                            <p className="text-sm mt-2">Você vaporizou todos os cartões disponíveis no momento!</p>
                        </div>
                    )}
                </div>

                {/* Mobile action buttons (optional, for tapping instead of swiping) */}
                {queue.length > 0 && (
                    <div className="flex items-center gap-6 mt-12 z-10 pb-10">
                        <button
                            disabled={!isTopFlipped}
                            onClick={() => handleSwipe('left', queue[0])}
                            className={`bg-white border-2 border-red-100 shadow-md p-4 rounded-full text-red-500 transition-all ${isTopFlipped ? 'hover:bg-red-50 hover:scale-110 active:scale-95 cursor-pointer' : 'opacity-40 grayscale cursor-not-allowed'}`}
                        >
                            <X className="w-8 h-8" strokeWidth={3} />
                        </button>
                        <button
                            disabled={!isTopFlipped}
                            onClick={() => handleSwipe('right', queue[0])}
                            className={`bg-white border-2 border-green-100 shadow-md p-4 rounded-full text-green-500 transition-all ${isTopFlipped ? 'hover:bg-green-50 hover:scale-110 active:scale-95 cursor-pointer' : 'opacity-40 grayscale cursor-not-allowed'}`}
                        >
                            <Check className="w-8 h-8" strokeWidth={3} />
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default BlitzModePage;
