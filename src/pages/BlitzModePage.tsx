import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Info } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFlashcards } from '../hooks/useFlashcards';
import { questionsOriginais } from '../db/questions_originais';
import { db } from '../db/database';
// type imports removed as they are unused or inferred
import confetti from 'canvas-confetti';

type UnifiedCard = { isCustom: boolean; data: any; id: string };

const SwipeableCard = ({ card, onSwipe, isTop }: { card: UnifiedCard; onSwipe: (dir: 'left' | 'right') => void; isTop: boolean }) => {
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

    return (
        <motion.div
            style={isTop ? { x, rotate, opacity } : {}}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={isTop ? handleDragEnd : undefined}
            className={`absolute inset-0 w-full h-full flex items-center justify-center ${!isTop && 'pointer-events-none'}`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: isTop ? 1 : 0.95, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => isTop && setFlipped(!flipped)}
        >
            <Card className="w-full max-w-sm h-96 relative overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border-2 border-border/10 bg-card">

                {/* Visual Feedback Overlays */}
                <motion.div style={{ backgroundColor: backgroundRight }} className="absolute inset-0 z-10 pointer-events-none flex items-center justify-end pr-8">
                    <motion.div style={{ opacity: rightIconOpacity }} className="bg-green-500 rounded-full p-4 shadow-lg">
                        <Check className="text-white w-12 h-12" />
                    </motion.div>
                </motion.div>

                <motion.div style={{ backgroundColor: backgroundLeft }} className="absolute inset-0 z-10 pointer-events-none flex items-center justify-start pl-8">
                    <motion.div style={{ opacity: leftIconOpacity }} className="bg-red-500 rounded-full p-4 shadow-lg">
                        <X className="text-white w-12 h-12" />
                    </motion.div>
                </motion.div>

                <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center relative z-20 bg-card">
                    {!flipped ? (
                        <>
                            <div className="absolute top-4 left-4 flex gap-2">
                                {card.isCustom && <Badge variant="secondary" className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">IA</Badge>}
                                <Badge variant="outline" className="text-[10px]">{card.data.theme}</Badge>
                            </div>
                            <h3 className="text-lg font-medium leading-relaxed mt-4">
                                {card.isCustom ? card.data.front : card.data.statement}
                            </h3>
                            <p className="absolute bottom-4 text-xs text-muted-foreground flex items-center gap-1">
                                <Info className="w-3 h-3" /> Clique no card para revelar
                            </p>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col justify-center animate-in fade-in duration-200">
                            <div className="bg-muted/50 p-6 rounded-xl flex-1 flex items-center justify-center overflow-auto">
                                <p className="text-md leading-relaxed text-foreground">
                                    {card.isCustom ? card.data.back : (card.data.options[card.data.correctAnswer] || 'Sem resposta cadastrada')}
                                </p>
                            </div>
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

    // Initial load
    useEffect(() => {
        const loadCards = async () => {
            const standardDue = getDueCards();
            const customCardsResponse = await db.customFlashcards.toArray();

            // Generate a random pool of standard cards
            const randomStandards = [...questionsOriginais].sort(() => 0.5 - Math.random()).slice(0, 30);

            const pool: UnifiedCard[] = [
                ...standardDue.map(q => ({ isCustom: false as const, data: q, id: q.id })),
                ...randomStandards.map(q => ({ isCustom: false as const, data: q, id: q.id })),
                ...customCardsResponse.map(c => ({ isCustom: true as const, data: c, id: c.id }))
            ];

            // Unique shuffle
            const uniqueMap = new Map();
            pool.forEach(c => uniqueMap.set(c.id, c));
            const finalPool = Array.from(uniqueMap.values()).sort(() => 0.5 - Math.random());

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
        setQueue(prev => prev.slice(1));
    };

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

                <div className="relative w-full max-w-sm h-96 flex items-center justify-center perspective-1000">
                    <AnimatePresence>
                        {queue.slice(0, 3).reverse().map((card, index) => (
                            <SwipeableCard
                                key={card.id}
                                card={card}
                                onSwipe={(dir) => handleSwipe(dir, card)}
                                isTop={index === queue.slice(0, 3).length - 1} // Array is reversed so last item in slice is visually on top
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
                            onClick={() => handleSwipe('left', queue[0])}
                            className="bg-white border-2 border-red-100 shadow-md p-4 rounded-full text-red-500 hover:bg-red-50 hover:scale-110 transition-all active:scale-95"
                        >
                            <X className="w-8 h-8" strokeWidth={3} />
                        </button>
                        <button
                            onClick={() => handleSwipe('right', queue[0])}
                            className="bg-white border-2 border-green-100 shadow-md p-4 rounded-full text-green-500 hover:bg-green-50 hover:scale-110 transition-all active:scale-95"
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
