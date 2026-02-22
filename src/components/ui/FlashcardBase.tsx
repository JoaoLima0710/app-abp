import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Info } from 'lucide-react';
import { Flashcard } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface FlashcardBaseProps {
    card: Flashcard;
    isFlipped: boolean;
    onFlip: () => void;
    className?: string;
    showHelpText?: boolean;
}

export function FlashcardBase({
    card,
    isFlipped,
    onFlip,
    className,
    showHelpText = true,
}: FlashcardBaseProps) {
    return (
        <div
            className={cn(
                "w-full h-full flex flex-col cursor-pointer",
                className
            )}
            onClick={onFlip}
        >
            {/* Header: Theme and Tags */}
            <div className="flex items-center gap-2 mb-4 shrink-0">
                {card.isCustom && (
                    <Badge
                        variant="secondary"
                        className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 uppercase shrink-0"
                    >
                        Flashcard IA
                    </Badge>
                )}
                <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                    {card.theme}
                </Badge>
                {/* Visual Label (Front/Back) aligned to the right */}
                <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-1">
                    {isFlipped ? (card.isCustom ? 'Gabarito IA' : 'Resposta') : 'Pergunta'}
                </span>
            </div>

            {/* Content Area */}
            {!isFlipped ? (
                // FRONT
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex items-center justify-center pb-2">
                    <h3 className="text-base font-medium leading-relaxed text-center w-full whitespace-pre-wrap break-words lg:text-lg lg:leading-7">
                        {card.front}
                    </h3>
                </div>
            ) : (
                // BACK
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col"
                >
                    <div className="bg-muted/30 p-4 rounded-xl flex-1 border border-primary/10 flex items-center justify-center dark:bg-muted/10">
                        <div className="w-full flex flex-col items-center">
                            {card.isCustom && (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 mb-3 justify-center w-full dark:text-purple-400">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    <span>Geração Analítica</span>
                                </div>
                            )}
                            <p className="text-base leading-relaxed text-foreground font-medium text-center w-full whitespace-pre-wrap break-words lg:text-lg">
                                {card.back}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Optional Help Text (Footer) */}
            {showHelpText && !isFlipped && (
                <p className="mt-4 text-[10px] text-muted-foreground flex items-center justify-center gap-1 shrink-0 pb-1 pt-2 border-t">
                    <Info className="w-3 h-3" /> Clique na área central para revelar a resposta
                </p>
            )}
        </div>
    );
}
