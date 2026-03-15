import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useAiTutor } from '../hooks/useAiTutor';
import { THEME_LABELS } from '../types';
import { db } from '../db/database';
import { Bot, X, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export function GlobalAiTutor() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const { progress } = useUserStore();
    const { askAi, isLoading } = useAiTutor();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isOpen, isLoading]);

    const handleSend = async () => {
        if (!message.trim() || isLoading) return;

        const userMsg = message.trim();
        setMessage('');

        // Fetch exactly what the user got wrong recently
        const fetchRecentMistakesText = async () => {
            try {
                const simulations = await db.simulations.toArray();
                simulations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                
                const missedIds: string[] = [];
                for (const sim of simulations) {
                    if (!sim.completedAt) continue;
                    for (const q of sim.questions) {
                        if (q.isCorrect === false && q.userAnswer) {
                            missedIds.push(q.questionId);
                        }
                    }
                    if (missedIds.length >= 40) break;
                }

                if (missedIds.length === 0) return 'O aluno ainda não tem erros recentes registrados.';

                const questions = await db.questions.where('id').anyOf(missedIds).toArray();
                let text = '';
                questions.slice(0, 40).forEach((q, idx) => {
                    const themeName = THEME_LABELS[q.theme as keyof typeof THEME_LABELS] || q.theme;
                    text += `${idx + 1}. [${themeName} - ${q.subtheme}] Falhou na questão: "${q.statement}". A resposta correta era: "${q.options[q.correctAnswer]}".\n`;
                });
                
                // Truncate at ~6000 chars to avoid blowing up the LLM context window limits
                if(text.length > 6000) {
                    text = text.substring(0, 6000) + '\n...[Lista truncada por limite de texto]';
                }
                
                return text;
            } catch (err) {
                console.error(err);
                return 'Houve um erro ao buscar o histórico de questões.';
            }
        };

        // Add user msg to UI immediately
        const updatedHistory: ChatMessage[] = [...history, { role: 'user', content: userMsg }];
        setHistory(updatedHistory);

        try {
            // Build the intelligent context string
            const weakThemes = progress?.trends?.weakThemes?.map(t => THEME_LABELS[t] || t).join(', ') || 'Nenhum identificado ainda';
            const strongThemes = progress?.trends?.strongThemes?.map(t => THEME_LABELS[t] || t).join(', ') || 'Nenhum identificado ainda';
            const accuracy = progress?.overallAccuracy ? progress.overallAccuracy.toFixed(0) + '%' : '0%';
            const totalQuestions = progress?.totalQuestionsAnswered || 0;
            const totalSimulations = progress?.totalSimulations || 0;
            
            let detailedStats = '';
            if (progress?.byTheme) {
                Object.entries(progress.byTheme).forEach(([themeKey, data]) => {
                    if (!data) return;
                    const themeName = THEME_LABELS[themeKey as keyof typeof THEME_LABELS] || themeKey;
                    detailedStats += `- ${themeName}: ${data.accuracy.toFixed(0)}% de acerto.`;
                    
                    if (data.subthemeStats) {
                        const worstSubthemes = Object.entries(data.subthemeStats)
                            .filter(([_, stats]) => stats.errors > 0)
                            .sort((a, b) => b[1].errors - a[1].errors)
                            .map(([name, stats]) => `${name} (${stats.errors}/${stats.total} erros)`)
                            .slice(0, 3);
                            
                        if (worstSubthemes.length > 0) {
                            detailedStats += ` Subtemas críticos: ${worstSubthemes.join(', ')}.`;
                        }
                    }
                    detailedStats += '\n';
                });
            }
            
            const recentMistakesText = await fetchRecentMistakesText();

            let promptContext = `Contexto de Desempenho do Aluno:
- Aluno já respondeu ${totalQuestions} questões em ${totalSimulations} simulados.
- Acerto Geral Atual: ${accuracy}
- Pontos Fortes: ${strongThemes}
- Pontos Fracos (Matérias Críticas): ${weakThemes}

Estatísticas Detalhadas por Tema e Subtema (USE ISSO PARA BASEAR SUAS RECOMENDAÇÕES):
${detailedStats || 'Ainda não há dados detalhados. O aluno é novo.'}

Últimas 40 Questões Que o Aluno Errou nos Simulados (Exame Cirúrgico das Falhas Teóricas):
${recentMistakesText}

Histórico da Conversa:
`;
            
            // Append the last 6 messages to provide conversational context to the LLM
            const recentHistory = updatedHistory.slice(-6);
            recentHistory.forEach(msg => {
                promptContext += `${msg.role === 'user' ? 'Aluno' : 'Tutor'}: ${msg.content}\n`;
            });

            promptContext += `
INSTRUÇÃO DE PERSONA: Você é um Mentor Acadêmico e Tutor Socrático de Psiquiatria.
Sua postura DEPENDE da intenção do aluno na nova mensagem (abaixo):

1. **Se o aluno pedir DIRECIONAMENTO DE ESTUDOS** (ex: "O que devo estudar?", "Quais meus pontos fracos?", "Me passe um roteiro"):
   - Aja como um Coordenador Pedagógico.
   - Analise o Dossiê e os Pontos Fracos dele.
   - Recomende **exatamente 2 a 3 Subtemas ou Tópicos específicos**.
   - SEJA DIRETO E ESTRUTURADO. Faça uma lista com bullets curtos.
   - **REGRA DE OURO:** NUNCA EXPLIQUE a teoria ou responda a matéria clínica nesta fase. O aluno só quer saber ONDE no índice/livro ele tem que focar. Diga algo como: "Baseado no seu dossiê, notei falhas recentes. Seu foco de estudo hoje deve ser: \n- Antidepressivos Tricíclicos (Toxicidade)\n- Lítio (Manejo Renal)".
   - Não se alongue. Menos é mais.

2. **Se o aluno fizer uma PERGUNTA TEÓRICA CLÍNICA** (ex: "Me explica a esquizofrenia", "Qual a diferença entre X e Y?"):
   - Aja como um Tutor Socrático.
   - Responda de forma clara e didática.
   - Use o Dossiê dele de forma sutil para conectar a sua explicação com os erros que ele já cometeu no passado, ajudando a fechar lacunas direcionadas.
`;

            const response = await askAi(userMsg, promptContext, 'explain');

            setHistory(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            console.error('Failed to get AI response:', error);
            // Revert message addition or show error state if needed
            setHistory(prev => [...prev, { role: 'assistant', content: '❌ Desculpe, ocorreu um erro ao se comunicar com a IA. Tente novamente em instantes.' }]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8">
            {/* Chat Window */}
            {isOpen && (
                <Card className="mb-4 w-[calc(100vw-2rem)] max-w-[380px] shadow-2xl flex flex-col h-[500px] max-h-[70vh] origin-bottom-right animate-in fade-in zoom-in duration-200">
                    <CardHeader className="p-3 lg:p-4 border-b bg-primary/5 flex flex-row items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/20 p-1.5 rounded-full text-primary">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold">Tutor IA Psiquiatria</CardTitle>
                                <p className="text-[10px] text-muted-foreground">Tire dúvidas gerais e peça explicações</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                        <ScrollArea className="flex-1 p-3 lg:p-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {history.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3 pt-8 pb-4 opacity-70">
                                        <Sparkles className="w-8 h-8 text-primary/60" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Como posso ajudar?</p>
                                            <p className="text-[11px] text-muted-foreground px-4">
                                                Me pergunte sobre critérios diagnósticos do DSM-5, psicofarmacologia ou qualquer área da Psiquiatria.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    history.map((msg, i) => (
                                        <div key={i} className={cn("flex flex-col gap-1 max-w-[85%]", msg.role === 'user' ? "items-end self-end ml-auto" : "items-start")}>
                                            <span className="text-[10px] text-muted-foreground px-1">
                                                {msg.role === 'user' ? 'Você' : 'Tutor IA'}
                                            </span>
                                            <div className={cn(
                                                "rounded-2xl px-3 py-2 text-sm",
                                                msg.role === 'user' ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted border rounded-tl-sm"
                                            )}>
                                                {msg.role === 'assistant' ? (
                                                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 text-[13px] leading-relaxed">
                                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    msg.content
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                                {isLoading && (
                                    <div className="flex flex-col gap-1 items-start max-w-[85%]">
                                        <span className="text-[10px] text-muted-foreground px-1">Tutor IA</span>
                                        <div className="rounded-2xl rounded-tl-sm bg-muted border px-4 py-3 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-3 border-t bg-background">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2 items-end relative"
                            >
                                <Textarea 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ex: Quais os critérios do DSM para Esquizofrenia?"
                                    className="min-h-[44px] max-h-[120px] resize-none pb-2 pr-10 text-sm rounded-xl"
                                    rows={1}
                                    disabled={isLoading}
                                />
                                <Button 
                                    type="submit" 
                                    size="icon" 
                                    className="absolute right-1.5 bottom-1.5 h-8 w-8 rounded-lg shrink-0" 
                                    disabled={!message.trim() || isLoading}
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </Button>
                            </form>
                            <p className="text-[9px] text-center text-muted-foreground mt-2">
                                A IA acessa suas estatísticas reais para focar as explicações.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Floating FAB */}
            <Button
                size="lg"
                className={cn(
                    "h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center p-0",
                    isOpen ? "opacity-0 scale-50 pointer-events-none" : "opacity-100 scale-100 hover:scale-110 hover:shadow-xl"
                )}
                onClick={() => setIsOpen(true)}
            >
                <Bot className="h-6 w-6 sm:h-7 sm:w-7" />
            </Button>
        </div>
    );
}
