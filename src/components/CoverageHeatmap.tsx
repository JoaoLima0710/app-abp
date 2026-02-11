import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import { THEME_LABELS, THEME_COLORS, PsychiatryTheme } from '../types';
import { db } from '../db/database';
import { Map } from 'lucide-react';

interface CoverageData {
    theme: PsychiatryTheme;
    label: string;
    color: string;
    totalQuestions: number;
    answeredQuestions: number;
    correctAnswers: number;
    coverage: number; // 0-100
    accuracy: number; // 0-100
}

export default function CoverageHeatmap() {
    const { progress } = useUserStore();
    const [coverageData, setCoverageData] = useState<CoverageData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const allQuestions = await db.questions.toArray();

            // Group questions by theme
            const byTheme: Record<string, { total: number; ids: Set<string> }> = {};
            for (const q of allQuestions) {
                if (!byTheme[q.theme]) byTheme[q.theme] = { total: 0, ids: new Set() };
                byTheme[q.theme].total++;
                byTheme[q.theme].ids.add(q.id);
            }

            // Get answered question IDs from simulations
            const sims = await db.simulations.toArray();
            const answeredByTheme: Record<string, { answered: Set<string>; correct: number }> = {};

            for (const sim of sims) {
                for (const sq of sim.questions) {
                    if (!sq.userAnswer) continue;
                    const q = allQuestions.find(x => x.id === sq.questionId);
                    if (!q) continue;
                    if (!answeredByTheme[q.theme]) answeredByTheme[q.theme] = { answered: new Set(), correct: 0 };
                    answeredByTheme[q.theme].answered.add(sq.questionId);
                    if (sq.isCorrect) answeredByTheme[q.theme].correct++;
                }
            }

            const data: CoverageData[] = Object.entries(byTheme).map(([theme, { total }]) => {
                const answered = answeredByTheme[theme]?.answered.size || 0;
                const correct = answeredByTheme[theme]?.correct || 0;
                return {
                    theme: theme as PsychiatryTheme,
                    label: THEME_LABELS[theme as PsychiatryTheme] || theme,
                    color: THEME_COLORS[theme as PsychiatryTheme] || '#888',
                    totalQuestions: total,
                    answeredQuestions: answered,
                    correctAnswers: correct,
                    coverage: total > 0 ? (answered / total) * 100 : 0,
                    accuracy: answered > 0 ? (correct / answered) * 100 : 0,
                };
            });

            data.sort((a, b) => a.coverage - b.coverage); // weakest coverage first
            setCoverageData(data);
            setIsLoading(false);
        })();
    }, [progress]);

    if (isLoading) {
        return (
            <div className="page animate-fade-in" style={{ textAlign: 'center', paddingTop: 'var(--spacing-8)' }}>
                <p>Carregando dados de cobertura...</p>
            </div>
        );
    }

    const overallCoverage = coverageData.length > 0
        ? coverageData.reduce((sum, d) => sum + d.coverage, 0) / coverageData.length
        : 0;

    return (
        <div className="page animate-fade-in">
            <header className="page-header">
                <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                    <Map size={28} />
                    Mapa de Cobertura Temática
                </h1>
                <p className="page-subtitle">
                    Visualize quais temas ainda precisam ser estudados
                </p>
            </header>

            {/* Overall coverage */}
            <div className="card" style={{ marginBottom: 'var(--spacing-6)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--primary-600)' }}>
                    {overallCoverage.toFixed(0)}%
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    Cobertura Geral
                </div>
                <div style={{
                    marginTop: 'var(--spacing-3)', height: 8, background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-full)', overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%', width: `${overallCoverage}%`,
                        background: 'linear-gradient(90deg, var(--primary-400), var(--primary-600))',
                        borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease',
                    }} />
                </div>
            </div>

            {/* Theme heatmap grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
                {coverageData.map((d) => (
                    <div
                        key={d.theme}
                        className="card"
                        style={{
                            borderLeft: `4px solid ${d.color}`,
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Background fill representing coverage */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, bottom: 0,
                            width: `${d.coverage}%`,
                            background: `${d.color}15`,
                            transition: 'width 0.5s ease',
                        }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h4 style={{ fontWeight: 600, marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)' }}>
                                {d.label}
                            </h4>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                                    {d.answeredQuestions}/{d.totalQuestions} questões
                                </span>
                                <span style={{
                                    fontSize: 'var(--font-size-sm)', fontWeight: 700,
                                    color: d.coverage > 70 ? 'var(--success-600)'
                                        : d.coverage > 40 ? 'var(--warning-600)'
                                            : 'var(--error-600)',
                                }}>
                                    {d.coverage.toFixed(0)}%
                                </span>
                            </div>
                            <div style={{
                                height: 6, background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-full)', overflow: 'hidden',
                            }}>
                                <div style={{
                                    height: '100%', width: `${d.coverage}%`,
                                    background: d.color, borderRadius: 'var(--radius-full)',
                                    transition: 'width 0.5s ease',
                                }} />
                            </div>
                            {d.answeredQuestions > 0 && (
                                <div style={{ marginTop: 'var(--spacing-2)', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                                    Acurácia: {d.accuracy.toFixed(0)}%
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
