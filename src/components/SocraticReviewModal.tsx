import { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Question } from '../types';

interface Message {
    role: 'user' | 'ai';
    content: string;
}

interface SocraticReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: Question | null;
    userWrongAnswerId: string | undefined;
}

export function SocraticReviewModal({ isOpen, onClose, question, userWrongAnswerId }: SocraticReviewModalProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial contextualization when opening the modal
    useEffect(() => {
        if (isOpen && question) {
            setMessages([]);
            startSocraticReview(question);
        }
    }, [isOpen, question]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const formatContext = (q: Question, wrongAnswerId: string | undefined, history: Message[]) => {
        const wrongOption = wrongAnswerId ? q.options[wrongAnswerId as keyof typeof q.options] : undefined;
        let ctx = `A questão era:\n"${q.statement}"\n\n`;
        ctx += `As alternativas eram:\n`;
        Object.entries(q.options).forEach(([key, value]) => {
            ctx += `- ${key}: ${value}\n`;
        });
        ctx += `\nO aluno escolheu a alternativa incorreta: "${wrongOption || 'Não respondeu'}"\n\n`;

        if (history.length > 0) {
            ctx += `=== HISTÓRICO DO CHAT ATÉ AGORA ===\n`;
            history.forEach(m => {
                ctx += `${m.role === 'ai' ? 'Tutor' : 'Aluno'}: ${m.content}\n`;
            });
            ctx += `\nResponda à última mensagem do Aluno mantendo a postura socrática.`;
        }

        return ctx;
    };

    const callApi = async (ctx: string, qText: string = "Revisão de Questão") => {
        setLoading(true);

        if (!navigator.onLine) {
            setLoading(false);
            return "Desculpe, você parece estar offline. Conecte-se à internet para conversar com o Tutor Socrático.";
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'guided_review',
                    question: qText,
                    context: ctx
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) throw new Error('Erro na API');
            const data = await res.json();
            return data.response;
        } catch (error: any) {
            console.error(error);
            if (error.name === 'AbortError') {
                return "O servidor do tutor demorou muito para responder (Timeout). Por favor, tente novamente em alguns instantes.";
            }
            return "Desculpe, ocorreu um erro ao conectar com o tutor. Tente novamente.";
        } finally {
            setLoading(false);
        }
    };

    const startSocraticReview = async (q: Question) => {
        const ctx = formatContext(q, userWrongAnswerId, []);
        const response = await callApi(ctx, q.statement);
        setMessages([{ role: 'ai', content: response }]);
    };

    const handleSend = async () => {
        if (!input.trim() || !question) return;

        const newUserMsg: Message = { role: 'user', content: input };
        const newHistory = [...messages, newUserMsg];
        setMessages(newHistory);
        setInput('');

        const ctx = formatContext(question, userWrongAnswerId, newHistory);
        const aiResponse = await callApi(ctx, question.statement);

        setMessages([...newHistory, { role: 'ai', content: aiResponse }]);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border-2 rounded-xl bg-card"
                >
                    <Card className="w-full h-full flex flex-col border-0 shadow-none rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/50 py-3 px-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <CardTitle className="text-base font-bold">Tutor Socrático</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={onClose}>
                                <X className="w-5 h-5" />
                            </Button>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-hidden p-0 bg-background/50">
                            <ScrollArea className="h-[60vh] p-4 lg:p-6">
                                <div className="space-y-4">
                                    {/* Question Context Bubble */}
                                    <div className="bg-muted p-4 rounded-xl text-xs md:text-sm text-muted-foreground border border-border/50 shadow-inner">
                                        <span className="font-bold text-foreground block mb-2">Revisando a Questão:</span>
                                        {question.statement}
                                    </div>

                                    {/* Chat Messages */}
                                    {messages.map((m, i) => (
                                        <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground border'}`}>
                                                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                            </div>
                                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-card border rounded-tl-none'}`}>
                                                {m.role === 'user' ? (
                                                    m.content
                                                ) : (
                                                    <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-muted prose-pre:text-muted-foreground">
                                                        <ReactMarkdown>{m.content}</ReactMarkdown>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {loading && (
                                        <div className="flex gap-3 flex-row animate-in fade-in zoom-in-95 duration-200">
                                            <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground border">
                                                <Bot className="w-4 h-4" />
                                            </div>
                                            <div className="bg-card border rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center justify-center gap-1.5 h-[44px]">
                                                <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>
                        </CardContent>

                        <CardFooter className="border-t p-3 bg-card">
                            <form
                                className="flex w-full items-center gap-2"
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Responda ou faça uma pergunta..."
                                    className="flex-1 bg-muted/50 focus-visible:ring-1"
                                    disabled={loading}
                                />
                                <Button size="icon" onClick={handleSend} disabled={!input.trim() || loading} className="shrink-0 rounded-full w-10 h-10 shadow-sm hover:shadow active:scale-95 transition-all">
                                    <Send className="w-4 h-4 ml-0.5" />
                                </Button>
                            </form>
                        </CardFooter>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
