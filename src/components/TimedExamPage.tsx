import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulationStore } from '../store/simulationStore';
import { AnswerOption } from '../types';
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, Flag, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const TOTAL_QUESTIONS = 100;
const EXAM_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours

export default function TimedExamPage() {
    const navigate = useNavigate();
    const { simulation, questions, startSimulation, submitAnswer, finishSimulation } = useSimulationStore();
    const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION_MS);
    const [isStarted, setIsStarted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
    const [currentQ, setCurrentQ] = useState(0);
    const startTimeRef = useRef<number>(0);
    const timerRef = useRef<ReturnType<typeof setInterval>>();

    const handleStart = useCallback(async () => {
        await startSimulation(TOTAL_QUESTIONS);
        startTimeRef.current = Date.now();
        setIsStarted(true);
    }, [startSimulation]);

    useEffect(() => {
        if (!isStarted) return;
        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const remaining = Math.max(0, EXAM_DURATION_MS - elapsed);
            setTimeRemaining(remaining);
            if (remaining === 0) {
                clearInterval(timerRef.current);
                finishSimulation();
                navigate('/simulado/resultado');
            }
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [isStarted, finishSimulation, navigate]);

    const formatTime = (ms: number) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
    };

    const handleAnswer = (answer: AnswerOption) => {
        setSelectedAnswer(answer);
        submitAnswer(answer);
    };

    const goToQ = (idx: number) => {
        if (idx >= 0 && idx < questions.length) {
            setCurrentQ(idx);
            setSelectedAnswer(null);
        }
    };

    const handleFinish = async () => {
        // Yield main thread to allow button UI update (fixes INP block)
        setTimeout(async () => {
            if (confirm('Deseja finalizar a prova? Não será possível voltar.')) {
                clearInterval(timerRef.current);
                await finishSimulation();
                navigate('/simulado/resultado');
            }
        }, 10);
    };

    // Pre-exam screen
    if (!isStarted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <Card className="w-full max-w-lg text-center">
                    <CardContent className="space-y-4 p-6 lg:space-y-6 lg:p-8">
                        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
                        <div>
                            <h1 className="text-xl font-bold lg:text-2xl">Simulação de Prova Completa</h1>
                            <p className="mt-1 text-xs text-muted-foreground lg:text-sm">
                                Reproduz as condições da prova real de Título ABP
                            </p>
                        </div>

                        <div className="space-y-2 rounded-lg bg-muted p-4 text-left">
                            <div className="flex items-center gap-2 text-xs lg:text-sm">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                <span><strong>100 questões</strong> selecionadas aleatoriamente</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs lg:text-sm">
                                <Clock className="h-4 w-4 shrink-0 text-primary" />
                                <span><strong>5 horas</strong> de tempo máximo</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs lg:text-sm">
                                <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500" />
                                <span><strong>Sem explicações</strong> durante a prova</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Button size="lg" className="w-full text-sm lg:text-base" onClick={handleStart}>
                                Iniciar Prova
                            </Button>
                            <Button variant="outline" className="w-full gap-1.5 text-xs" onClick={() => navigate('/')}>
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Voltar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const question = questions[currentQ];
    if (!question) return null;
    const simQ = simulation?.questions[currentQ];
    const answeredCount = simulation?.questions.filter(q => q.userAnswer).length || 0;

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Sticky Timer */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-[800px] items-center justify-between px-4 py-2 lg:py-3">
                    <div className={cn(
                        'flex items-center gap-1.5 rounded-md bg-muted px-3 py-1 font-mono text-sm font-bold lg:text-base',
                        timeRemaining < 1800000 && 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
                    )}>
                        <Clock className="h-4 w-4" />
                        {formatTime(timeRemaining)}
                    </div>
                    <span className="text-xs text-muted-foreground lg:text-sm">
                        {currentQ + 1}/{questions.length}
                    </span>
                    <Button variant="destructive" size="sm" className="gap-1 text-[11px] lg:text-xs" onClick={handleFinish}>
                        <Flag className="h-3 w-3" />
                        Finalizar
                    </Button>
                </div>
                <div className="mx-auto max-w-[800px] px-4 pb-2">
                    <Progress value={(answeredCount / questions.length) * 100} className="h-1" />
                </div>
            </header>

            <main className="mx-auto w-full max-w-[800px] flex-1 space-y-4 px-4 py-4 lg:py-6">
                {/* Question */}
                <Card>
                    <CardContent className="space-y-4 p-4 lg:p-6">
                        <p className="text-[13px] font-medium leading-relaxed lg:text-base lg:leading-7">
                            {question.statement}
                        </p>

                        <div className="space-y-2">
                            {(Object.entries(question.options) as [AnswerOption, string][]).map(([letter, text]) => {
                                const isSelected = simQ?.userAnswer === letter || selectedAnswer === letter;
                                return (
                                    <button
                                        key={letter}
                                        onClick={() => handleAnswer(letter)}
                                        className={cn(
                                            'flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all lg:gap-4 lg:p-4',
                                            isSelected
                                                ? 'border-primary bg-primary/5'
                                                : 'hover:border-primary/30 hover:bg-muted/50',
                                        )}
                                    >
                                        <span className={cn(
                                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold lg:h-8 lg:w-8 lg:text-xs',
                                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted',
                                        )}>
                                            {letter}
                                        </span>
                                        <span className="text-[12px] lg:text-sm">{text}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button variant="outline" className="gap-1 text-[11px] lg:text-sm" onClick={() => goToQ(currentQ - 1)} disabled={currentQ === 0}>
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Anterior
                    </Button>
                    <Button className="gap-1 text-[11px] lg:text-sm" onClick={() => goToQ(currentQ + 1)} disabled={currentQ >= questions.length - 1}>
                        Próxima
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {/* Question Map */}
                <Card>
                    <CardContent className="p-3 lg:p-4">
                        <p className="mb-2 text-[11px] font-medium text-muted-foreground lg:text-xs">Mapa de Questões</p>
                        <div className="grid grid-cols-10 gap-1">
                            {questions.map((_, idx) => {
                                const sq = simulation?.questions[idx];
                                const answered = !!sq?.userAnswer;
                                const isCurrent = idx === currentQ;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => goToQ(idx)}
                                        className={cn(
                                            'flex aspect-square items-center justify-center rounded text-[9px] font-medium transition-all lg:rounded-md lg:text-[10px]',
                                            isCurrent && 'bg-primary text-primary-foreground ring-2 ring-primary/30',
                                            !isCurrent && answered && 'bg-primary/10 text-primary',
                                            !isCurrent && !answered && 'border bg-background hover:bg-muted/50',
                                        )}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
