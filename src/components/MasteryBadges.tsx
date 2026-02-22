import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Shield, Lock, Award, Medal } from "lucide-react";
import { THEME_LABELS } from '../types';

interface MasteryBadgesProps {
    statsByTheme: Record<string, { total: number; correct: number; accuracy: number; questionsSeen: number; }>;
}

export function MasteryBadges({ statsByTheme }: MasteryBadgesProps) {

    // Sort themes by accuracy so the "best" badges appear first
    const sortedThemes = Object.entries(statsByTheme)
        .filter(([_, data]) => data.questionsSeen > 0) // Only show themes they've actually practiced
        .sort((a, b) => b[1].accuracy - a[1].accuracy);

    const getBadgeStatus = (accuracy: number, questionsSeen: number) => {
        if (questionsSeen < 10) return { tier: 'locked', icon: Lock, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Em Progresso (Mín. 10 Qs)' };
        if (accuracy >= 80) return { tier: 'gold', icon: Trophy, color: 'text-amber-700 dark:text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30', label: 'Domínio Ouro' };
        if (accuracy >= 65) return { tier: 'silver', icon: Award, color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-500/10 border-slate-500/30', label: 'Domínio Prata' };
        return { tier: 'bronze', icon: Star, color: 'text-orange-800 dark:text-orange-500', bg: 'bg-orange-700/10 border-orange-700/30', label: 'Domínio Bronze' };
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
                    <Medal className="w-5 h-5 text-primary" />
                    Insígnias de Maestria
                </CardTitle>
                <CardDescription>
                    Conquiste Ouro estudando pelo menos 10 questões de um tema com +80% de acerto.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {sortedThemes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-xl border border-dashed">
                        <Shield className="w-12 h-12 text-muted-foreground/50 mb-3" />
                        <p className="text-sm text-muted-foreground">Termine seu primeiro simulado para desbloquear insígnias!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sortedThemes.map(([theme, data]) => {
                            const status = getBadgeStatus(data.accuracy, data.questionsSeen);
                            const Icon = status.icon;

                            return (
                                <div
                                    key={theme}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${status.bg} ${status.tier === 'locked' ? 'opacity-70 grayscale' : 'hover:scale-105 shadow-sm'}`}
                                >
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-background shadow-inner ${status.tier !== 'locked' && 'ring-2 ring-primary/20'}`}>
                                        <Icon className={`w-6 h-6 ${status.color}`} />
                                    </div>
                                    <h4 className="text-xs font-bold text-center line-clamp-2 min-h-[32px] mb-1">
                                        {THEME_LABELS[theme as keyof typeof THEME_LABELS] || theme}
                                    </h4>
                                    <Badge variant="outline" className={`text-[9px] mb-2 ${status.color}`}>
                                        {status.label}
                                    </Badge>
                                    <div className="w-full flex items-center gap-2">
                                        <Progress value={data.accuracy} className="h-1.5 flex-1" />
                                        <span className="text-[10px] font-medium">{data.accuracy.toFixed(0)}%</span>
                                    </div>
                                    <div className="text-[9px] text-muted-foreground mt-1 text-center w-full">
                                        {data.correct}/{data.questionsSeen} Acertos
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
