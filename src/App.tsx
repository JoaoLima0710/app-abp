import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, ErrorInfo } from 'react';
import { useUserStore } from './store/userStore';
import { useAuthStore } from './store/authStore';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { startAutoSync } from './db/cloudSync';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import SimulationSetup from './components/SimulationSetup';
import SimulationPage from './components/SimulationPage';
import SimulationResults from './components/SimulationResults';
import StatisticsPanel from './components/StatisticsPanel';
import StudyPlan from './components/StudyPlan';
import TrendsPage from './components/TrendsPage';
import SettingsPage from './components/SettingsPage';
import FlashcardsPage from './pages/FlashcardsPage';
import FlashcardStudyPage from './pages/FlashcardStudyPage';
import TimedExamPage from './components/TimedExamPage';
import CoverageHeatmap from './components/CoverageHeatmap';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("🔴 APP CRASH:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center">
                    <div className="rounded-xl bg-white p-6 shadow-xl max-w-2xl w-full border border-red-100">
                        <h1 className="mb-4 text-2xl font-bold text-red-600">Erro Fatal na Aplicação</h1>
                        <p className="mb-6 text-sm text-slate-600">
                            Por favor, tire um print desta tela e envie para análise.
                        </p>

                        <div className="mb-4 overflow-auto rounded bg-slate-900 p-4 text-left text-xs text-red-400 max-h-64">
                            <p className="font-bold">{this.state.error?.toString()}</p>
                            <pre className="mt-2 opacity-80">{this.state.error?.stack}</pre>
                        </div>

                        {this.state.errorInfo && (
                            <div className="overflow-auto rounded bg-slate-900 p-4 text-left text-[10px] text-slate-300 max-h-48">
                                <pre>{this.state.errorInfo.componentStack}</pre>
                            </div>
                        )}

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 rounded-lg bg-primary px-6 py-2 text-white font-medium hover:bg-primary/90"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function AppContent() {
    const { loadUserData, isDarkMode } = useUserStore();
    const { user, isInitialized, initialize } = useAuthStore();

    useEffect(() => {
        initialize();
        loadUserData();
        startAutoSync();
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    // Show loading while checking auth state
    if (!isInitialized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Not logged in → show login page
    if (!user) {
        return <LoginPage />;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/simulado" element={<SimulationSetup />} />
                    <Route path="/simulado/active" element={<SimulationPage />} />
                    <Route path="/simulado/:id/resultado" element={<SimulationResults />} />
                    <Route path="/estatisticas" element={<StatisticsPanel />} />
                    <Route path="/plano" element={<StudyPlan />} />
                    <Route path="/tendencias" element={<TrendsPage />} />
                    <Route path="/flashcards" element={<FlashcardsPage />} />
                    <Route path="/flashcards/estudo" element={<FlashcardStudyPage />} />
                    <Route path="/prova" element={<TimedExamPage />} />
                    <Route path="/cobertura" element={<CoverageHeatmap />} />
                    <Route path="/configuracoes" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </TooltipProvider>
        </QueryClientProvider>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <AppContent />
        </ErrorBoundary>
    );
}

export default App;
