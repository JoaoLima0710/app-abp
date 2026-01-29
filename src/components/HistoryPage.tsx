import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSimulations } from '../db/database';
import { Simulation, THEME_LABELS, THEME_COLORS } from '../types';
import {
    Clock,
    Calendar,
    Target,
    ChevronRight,
    Search,
    Filter,
    ArrowLeft
} from 'lucide-react';

export default function HistoryPage() {
    const navigate = useNavigate();
    const [simulations, setSimulations] = useState<Simulation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTheme, setFilterTheme] = useState<string>('all');

    useEffect(() => {
        const loadSims = async () => {
            setIsLoading(true);
            const data = await getAllSimulations();
            setSimulations(data);
            setIsLoading(false);
        };
        loadSims();
    }, []);

    const filteredSimulations = simulations.filter(sim => {
        const matchesSearch = sim.questionCount.toString().includes(searchTerm);
        const matchesTheme = filterTheme === 'all' || sim.focusTheme === filterTheme;
        return matchesSearch && matchesTheme;
    });

    return (
        <div className="page animate-fade-in">
            <header className="page-header flex items-center justify-between">
                <div>
                    <button
                        className="btn btn-ghost mb-2 -ml-2 p-1"
                        onClick={() => navigate('/')}
                    >
                        <ArrowLeft size={20} />
                        Voltar
                    </button>
                    <h1 className="page-title">Histórico de Simulados</h1>
                    <p className="page-subtitle">Revise seu desempenho em sessões anteriores</p>
                </div>
            </header>

            {/* Filters */}
            <div className="card mb-6 p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por n° de questões..."
                            className="input w-full pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="min-w-[200px] relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={18} />
                        <select
                            className="input w-full pl-10"
                            value={filterTheme}
                            onChange={(e) => setFilterTheme(e.target.value)}
                        >
                            <option value="all">Todos os Temas</option>
                            {Object.entries(THEME_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
                    <p className="text-secondary">Carregando histórico...</p>
                </div>
            ) : filteredSimulations.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {filteredSimulations.map((sim) => (
                        <div
                            key={sim.id}
                            className="card card-interactive flex items-center justify-between p-4"
                            onClick={() => navigate(`/simulado/${sim.id}/resultado`)}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 'var(--radius-lg)',
                                        background: sim.stats.accuracy >= 70
                                            ? 'var(--success-100)'
                                            : sim.stats.accuracy >= 50
                                                ? 'var(--warning-100)'
                                                : 'var(--error-100)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: sim.stats.accuracy >= 70
                                            ? 'var(--success-700)'
                                            : sim.stats.accuracy >= 50
                                                ? 'var(--warning-700)'
                                                : 'var(--error-700)',
                                        fontWeight: 700,
                                        fontSize: 'var(--font-size-sm)'
                                    }}
                                >
                                    {sim.stats.accuracy.toFixed(0)}%
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-primary">
                                            {sim.questionCount} Questões
                                        </span>
                                        {sim.focusTheme && (
                                            <span className="theme-tag">
                                                <span
                                                    className="theme-tag-dot"
                                                    style={{ background: THEME_COLORS[sim.focusTheme] }}
                                                />
                                                {THEME_LABELS[sim.focusTheme]}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-tertiary">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(sim.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {new Date(sim.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Target size={14} />
                                            {sim.stats.correct} acertos
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="text-tertiary" size={20} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 card">
                    <Clock size={48} className="mx-auto text-tertiary mb-4 opacity-20" />
                    <p className="text-secondary mb-2">Nenhum simulado encontrado</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/simulado/novo')}
                    >
                        Iniciar Primeiro Simulado
                    </button>
                </div>
            )}
        </div>
    );
}
