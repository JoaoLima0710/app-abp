import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulationStore } from '../store/simulationStore';
import { PsychiatryTheme, THEME_LABELS, THEME_COLORS } from '../types';
import {
    Play,
    Shuffle,
    Target,
    Loader2
} from 'lucide-react';

const QUESTION_COUNTS = [5, 10, 15, 20, 30, 50, 90];

export default function SimulationSetup() {
    const navigate = useNavigate();
    const { startSimulation, isLoading } = useSimulationStore();
    const [questionCount, setQuestionCount] = useState(10);
    const [focusTheme, setFocusTheme] = useState<PsychiatryTheme | 'all'>('all');
    const [mode, setMode] = useState<'mixed' | 'focused'>('mixed');

    const handleStart = async () => {
        const theme = mode === 'focused' && focusTheme !== 'all' ? focusTheme : undefined;
        await startSimulation(questionCount, theme);
        navigate('/simulado/active');
    };

    const themes = Object.entries(THEME_LABELS) as [PsychiatryTheme, string][];

    return (
        <div className="page animate-fade-in">
            <header className="page-header">
                <h1 className="page-title">Novo Simulado</h1>
                <p className="page-subtitle">
                    Configure seu simulado e comece a praticar
                </p>
            </header>

            <div style={{ maxWidth: 600 }}>
                {/* Question Count */}
                <section className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
                    <h3 className="card-title mb-4">Número de Questões</h3>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                            gap: 'var(--spacing-2)',
                        }}
                    >
                        {QUESTION_COUNTS.map((count) => (
                            <button
                                key={count}
                                className={`btn ${questionCount === count ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setQuestionCount(count)}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Mode Selection */}
                <section className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
                    <h3 className="card-title mb-4">Modo do Simulado</h3>
                    <div className="flex gap-3">
                        <button
                            className={`btn ${mode === 'mixed' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setMode('mixed')}
                            style={{ flex: 1 }}
                        >
                            <Shuffle size={20} />
                            Misto
                        </button>
                        <button
                            className={`btn ${mode === 'focused' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setMode('focused')}
                            style={{ flex: 1 }}
                        >
                            <Target size={20} />
                            Focado
                        </button>
                    </div>
                    <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-tertiary)',
                        marginTop: 'var(--spacing-3)',
                    }}>
                        {mode === 'mixed'
                            ? 'Questões de todas as áreas temáticas, simulando a prova real'
                            : 'Pratique uma área específica para reforçar o aprendizado'
                        }
                    </p>
                </section>

                {/* Theme Selection (only if focused mode) */}
                {mode === 'focused' && (
                    <section className="card animate-fade-in" style={{ marginBottom: 'var(--spacing-6)' }}>
                        <h3 className="card-title mb-4">Área Temática</h3>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: 'var(--spacing-2)',
                            }}
                        >
                            {themes.map(([key, label]) => (
                                <button
                                    key={key}
                                    className={`btn ${focusTheme === key ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setFocusTheme(key)}
                                    style={{
                                        justifyContent: 'flex-start',
                                        borderLeft: `4px solid ${THEME_COLORS[key]}`,
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* Summary & Start */}
                <section className="card" style={{
                    background: 'linear-gradient(135deg, var(--primary-50), var(--secondary-50))',
                    border: 'none',
                }}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, margin: 0 }}>
                                Resumo do Simulado
                            </h3>
                            <p style={{
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--text-secondary)',
                                margin: 'var(--spacing-1) 0 0 0',
                            }}>
                                {questionCount} questões • {mode === 'mixed' ? 'Todas as áreas' : THEME_LABELS[focusTheme as PsychiatryTheme] || 'Todas as áreas'}
                            </p>
                        </div>
                        <div style={{
                            padding: 'var(--spacing-3) var(--spacing-4)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            textAlign: 'center',
                        }}>
                            <div style={{
                                fontSize: 'var(--font-size-2xl)',
                                fontWeight: 700,
                                color: 'var(--primary-600)',
                            }}>
                                ~{Math.round(questionCount * 1.5)}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                                minutos
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary btn-lg w-full"
                        onClick={handleStart}
                        disabled={isLoading}
                        style={{ fontSize: 'var(--font-size-lg)' }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={24} className="animate-spin" />
                                Carregando...
                            </>
                        ) : (
                            <>
                                <Play size={24} />
                                Iniciar Simulado
                            </>
                        )}
                    </button>
                </section>
            </div>
        </div>
    );
}
