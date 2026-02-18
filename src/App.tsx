import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from './store/userStore';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const queryClient = new QueryClient();

function App() {
    const { loadUserData, isDarkMode } = useUserStore();

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

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

export default App;
