
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, ThumbsUp, Check, CheckCheck } from 'lucide-react';
import { useFlashcards } from '../hooks/useFlashcards';
import { questionsOriginais as questions } from '../db/questions_originais';
import { SRSGrade } from '../services/srs';
import { Question } from '../types';

const FlashcardStudyPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getDueCards, submitReview, getCardData } = useFlashcards();
    const [queue, setQueue] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);

    const mode = location.state?.mode || 'due';

    useEffect(() => {
        let cards: Question[] = [];
        if (mode === 'due') {
            cards = getDueCards();
        } else if (mode === 'new') {
            // Logic to get 10 random new cards
            // Filter questions that have no progress (repetition === 0)
            const unlearned = questions.filter(q => {
                const data = getCardData(q.id);
                return data.repetition === 0;
            });

            // Shuffle and take 10
            cards = unlearned.sort(() => 0.5 - Math.random()).slice(0, 10);
        }

        setQueue(cards);
        setLoading(false);
    }, [mode, getDueCards, getCardData]);

    const currentCard = queue[currentIndex];

    // If queue is empty (finished or no cards)
    if (!loading && !currentCard) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
                <CheckCheck className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Sessão Concluída!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Você completou todos os cartões desta sessão.
                </p>
                <button
                    onClick={() => navigate('/flashcards')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Voltar ao Painel
                </button>
            </div>
        );
    }

    const handleFlip = () => {
        setIsFlipped(true);
    };

    const handleRate = (grade: SRSGrade) => {
        submitReview(currentCard.id, grade);

        // Move to next
        setIsFlipped(false);
        setCurrentIndex(prev => prev + 1);
    };

    if (loading) return <div className="p-8">Carregando...</div>;

    const progress = Math.min(100, ((currentIndex) / queue.length) * 100);

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-0">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/flashcards')}
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    Sair
                </button>
                <span className="text-sm text-gray-500">
                    Cartão {currentIndex + 1} de {queue.length}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Card */}
            <div className="perspective-1000 min-h-[400px]">
                <div className={`
                    relative w-full h-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 
                    p-8 flex flex-col justify-between
                `}>
                    <div className="space-y-4">
                        <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                            {isFlipped ? 'Resposta' : 'Pergunta'}
                        </span>

                        <div className="text-lg md:text-xl text-gray-900 dark:text-gray-100 leading-relaxed font-serif">
                            {currentCard.statement}
                        </div>

                        {!isFlipped && (
                            <div className="mt-8 space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                                {Object.entries(currentCard.options).map(([key, text]) => (
                                    <div key={key} className="p-2 border border-gray-100 dark:border-gray-700 rounded text-sm text-gray-500">
                                        <span className="font-bold mr-2">{key})</span> {text as string}
                                    </div>
                                ))}
                            </div>
                        )}

                        {isFlipped && (
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                                    <Check className="w-6 h-6" />
                                    Gabarito: {currentCard.correctAnswer}
                                </div>
                                <div className="prose dark:prose-invert text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                                    <p className="whitespace-pre-wrap">{currentCard.explanation.correct}</p>
                                </div>

                                {currentCard.itemAnalysis && (
                                    <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100">
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                                            Análise Item a Item
                                        </h4>
                                        <div className="grid gap-3">
                                            {Object.entries(currentCard.itemAnalysis).map(([key, analysis]) => {
                                                const isCorrect = key === currentCard.correctAnswer;
                                                return (
                                                    <div
                                                        key={key}
                                                        className={`
                                                            p-4 rounded-xl border text-sm transition-colors
                                                            ${isCorrect
                                                                ? 'bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                                                : 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 hover:bg-red-50/30 dark:hover:bg-red-900/10'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex gap-3">
                                                            <span className={`
                                                                flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs
                                                                ${isCorrect
                                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                                }
                                                            `}>
                                                                {key}
                                                            </span>
                                                            <div className="space-y-1">
                                                                <p className={`font-medium ${isCorrect ? 'text-green-900 dark:text-green-100' : 'text-gray-900 dark:text-gray-100'}`}>
                                                                    {(currentCard.options as any)[key]}
                                                                </p>
                                                                <p className={`text-xs leading-relaxed ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>
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
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="mt-8">
                        {!isFlipped ? (
                            <button
                                onClick={handleFlip}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all transform hover:scale-[1.02]"
                            >
                                Mostrar Resposta
                            </button>
                        ) : (
                            <div className="grid grid-cols-4 gap-2 md:gap-3">
                                <button
                                    onClick={() => handleRate(0)}
                                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 border border-transparent hover:border-orange-300"
                                >
                                    <RotateCcw className="w-5 h-5 mb-1" />
                                    <span className="text-xs font-bold uppercase">Errei</span>
                                    <span className="text-[10px] opacity-70">1d</span>
                                </button>

                                <button
                                    onClick={() => handleRate(3)}
                                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-400"
                                >
                                    <span className="text-lg font-bold mb-1">😐</span>
                                    <span className="text-xs font-bold uppercase">Difícil</span>
                                </button>

                                <button
                                    onClick={() => handleRate(4)}
                                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 border border-transparent hover:border-blue-300"
                                >
                                    <ThumbsUp className="w-5 h-5 mb-1" />
                                    <span className="text-xs font-bold uppercase">Bom</span>
                                </button>

                                <button
                                    onClick={() => handleRate(5)}
                                    className="flex flex-col items-center justify-center p-3 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 border border-transparent hover:border-green-300"
                                >
                                    <CheckCheck className="w-5 h-5 mb-1" />
                                    <span className="text-xs font-bold uppercase">Fácil</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashcardStudyPage;
