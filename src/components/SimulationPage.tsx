import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulationStore } from '../store/simulationStore';
import { AnswerOption, THEME_LABELS } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

import {
    ChevronLeft,
    ChevronRight,

    Clock,
    CheckCircle2,
    XCircle,
    Flag,
    BookOpen,
    Lightbulb,


} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AiExplanation } from '@/components/AiExplanation';
import { Loader2 } from 'lucide-react';

export default function SimulationPage() {
    const navigate = useNavigate();
    const {
        simulation,
        questions,
        currentIndex,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        goToQuestion,
        finishSimulation,
        getCurrentQuestion,
        getCurrentSimulationQuestion,
        getProgress,
    } = useSimulationStore();

    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (!simulation) navigate('/simulado');
    }, [simulation, navigate]);

    useEffect(() => {
        const interval = setInterval(() => setElapsedTime((prev) => prev + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    if (!simulation) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-3 text-sm text-muted-foreground">Iniciando ambiente...</p>
            </div>
        );
    }

    const question = getCurrentQuestion();
    const simQuestion = getCurrentSimulationQuestion();
    const progress = getProgress();

    if (!question) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
                <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
                <h3 className="text-lg font-semibold">Sincronizando Banco de Questões</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    As questões deste simulado estão sendo puxadas para o seu dispositivo. Por favor, aguarde alguns segundos...
                </p>
                <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => window.location.reload()}
                >
                    Recarregar se demorar muito
                </Button>
            </div>
        );
    }

    const formatTime = (s: number) =>
        `${Math.floor(s / 60)
            .toString()
            .padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const handleAnswer = (answer: AnswerOption) => {
        if (simQuestion?.userAnswer) return;
        answerQuestion(answer);
    };

    const handleFinish = async () => {
        await finishSimulation();
        navigate(`/simulado/${simulation.id}/resultado`);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-[900px] items-center justify-between px-4 py-2 lg:py-3">
                    <div className="flex items-center gap-2 lg:gap-3">
                        <Badge variant="outline" className="text-[11px] lg:text-xs">{THEME_LABELS[question.theme]}</Badge>
                        <span className="text-[11px] text-muted-foreground lg:text-sm">
                            {currentIndex + 1}/{questions.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-3">
                        <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-[11px] font-mono lg:text-sm">
                            <Clock className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                            {formatTime(elapsedTime)}
                        </div>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1 text-[11px] lg:gap-1.5 lg:text-xs"
                            onClick={handleFinish}
                            disabled={progress.answered === 0}
                        >
                            <Flag className="h-3 w-3" />
                            Finalizar
                        </Button>
                    </div>
                </div>
                <div className="mx-auto max-w-[900px] px-4 pb-2">
                    <Progress value={progress.percentage} className="h-1" />
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto w-full max-w-[900px] flex-1 space-y-4 px-4 py-4 lg:space-y-6 lg:py-8">
                {/* Question Card */}
                <Card>
                    <CardContent className="space-y-4 p-4 lg:space-y-6 lg:p-6">
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={
                                    question.difficulty === 1
                                        ? 'default'
                                        : question.difficulty === 2
                                            ? 'secondary'
                                            : 'destructive'
                                }
                                className="text-[10px] lg:text-xs"
                            >
                                {question.difficulty === 1 ? 'Fácil' : question.difficulty === 2 ? 'Médio' : 'Difícil'}
                            </Badge>
                        </div>

                        <p className="text-[13px] leading-relaxed lg:text-base lg:leading-7">
                            {question.statement}
                        </p>

                        {/* Options */}
                        <div className="space-y-2 lg:space-y-3">
                            {(['A', 'B', 'C', 'D', 'E'] as AnswerOption[]).map((option) => {
                                const isAnswered = !!simQuestion?.userAnswer;
                                const isCorrect = option === question.correctAnswer;
                                const isUserWrong = option === simQuestion?.userAnswer && !simQuestion?.isCorrect;
                                const isSelected = option === simQuestion?.userAnswer;

                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswer(option)}
                                        disabled={isAnswered}
                                        className={cn(
                                            'flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all lg:gap-4 lg:p-4',
                                            !isAnswered && 'cursor-pointer hover:border-primary/50 hover:bg-muted/50',
                                            isAnswered && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                                            isAnswered && isUserWrong && 'border-red-500 bg-red-50 dark:bg-red-950/30',
                                            isAnswered && !isCorrect && !isUserWrong && 'opacity-50',
                                            !isAnswered && isSelected && 'border-primary bg-primary/5',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold lg:h-8 lg:w-8 lg:text-xs',
                                                isAnswered && isCorrect && 'bg-green-500 text-white',
                                                isAnswered && isUserWrong && 'bg-red-500 text-white',
                                                !isAnswered && 'bg-muted',
                                            )}
                                        >
                                            {option}
                                        </span>
                                        <span className="flex-1 text-[12px] lg:text-sm">{question.options[option]}</span>
                                        {isAnswered && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />}
                                        {isUserWrong && <XCircle className="h-5 w-5 shrink-0 text-red-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Explanation */}
                {simQuestion?.userAnswer && (
                    <Card className={cn(
                        'border-l-4',
                        simQuestion.isCorrect ? 'border-l-green-500' : 'border-l-red-500',
                    )}>
                        <CardContent className="space-y-3 p-4 lg:space-y-4 lg:p-6">
                            <div className="flex items-center gap-2">
                                {simQuestion.isCorrect ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                <h3 className="text-sm font-bold lg:text-lg">
                                    {simQuestion.isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta'}
                                </h3>
                            </div>

                            {/* Correct explanation */}
                            <div className="rounded-lg border-l-4 border-l-green-500 bg-muted/50 p-3 lg:p-4">
                                <div className="mb-1 flex items-center gap-1.5">
                                    <BookOpen className="h-3.5 w-3.5 text-green-600" />
                                    <strong className="text-[11px] text-green-700 dark:text-green-400 lg:text-xs">
                                        Alternativa Correta: {question.correctAnswer}
                                    </strong>
                                </div>
                                <p className="text-[12px] leading-relaxed lg:text-sm">{question.explanation.correct}</p>
                            </div>



                            {/* Exam tip */}
                            {question.explanation.examTip && (
                                <div className="flex gap-2 rounded-lg bg-warning/10 p-3 lg:gap-3 lg:p-4">
                                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                                    <div>
                                        <strong className="text-[11px] text-warning lg:text-xs">Dica de Prova</strong>
                                        <p className="mt-0.5 text-[11px] lg:text-xs">{question.explanation.examTip}</p>
                                    </div>
                                </div>
                            )}

                            <AiExplanation
                                questionBody={question.statement}
                                alternatives={question.options}
                                correctAnswer={question.correctAnswer}
                                userAnswer={simQuestion.userAnswer}
                                className="mt-4 border-t pt-4"
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        className="gap-1 text-[11px] lg:gap-1.5 lg:text-sm"
                        onClick={previousQuestion}
                        disabled={currentIndex === 0}
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Anterior
                    </Button>
                    <Button
                        className="gap-1 text-[11px] lg:gap-1.5 lg:text-sm"
                        onClick={nextQuestion}
                        disabled={currentIndex === questions.length - 1}
                    >
                        Próxima
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </div>

                {/* Quick Nav */}
                <Card>
                    <CardContent className="p-3 lg:p-4">
                        <p className="mb-2 text-[11px] font-medium text-muted-foreground lg:text-xs">Navegação Rápida</p>
                        <div className="flex flex-wrap gap-1 lg:gap-1.5">
                            {simulation.questions.map((q, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goToQuestion(idx)}
                                    className={cn(
                                        'flex h-7 w-7 items-center justify-center rounded text-[10px] font-medium transition-all lg:h-8 lg:w-8 lg:rounded-md lg:text-xs',
                                        idx === currentIndex && 'bg-primary text-primary-foreground ring-2 ring-primary/30',
                                        idx !== currentIndex && q.isCorrect === true && 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
                                        idx !== currentIndex && q.isCorrect === false && 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
                                        idx !== currentIndex && q.userAnswer && q.isCorrect === undefined && 'bg-muted',
                                        idx !== currentIndex && !q.userAnswer && 'bg-background border hover:bg-muted/50',
                                    )}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
