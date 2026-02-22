import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useUserStore } from './store/userStore';
import { useAuthStore } from './store/authStore';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { startAutoSync, onSyncStatus } from './db/cloudSync';
import LoginPage from './components/LoginPage';
import { Loader2 } from 'lucide-react';
import { AppErrorBoundary } from './components/ErrorBoundary';

// Lazy load heavy route components
const Dashboard = lazy(() => import('./components/Dashboard'));
const SimulationSetup = lazy(() => import('./components/SimulationSetup'));
const SimulationPage = lazy(() => import('./components/SimulationPage'));
const SimulationResults = lazy(() => import('./components/SimulationResults'));
const StatisticsPanel = lazy(() => import('./components/StatisticsPanel'));
const StudyPlan = lazy(() => import('./components/StudyPlan'));
const TrendsPage = lazy(() => import('./components/TrendsPage'));
const SettingsPage = lazy(() => import('./components/SettingsPage'));
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage'));
const FlashcardStudyPage = lazy(() => import('./pages/FlashcardStudyPage'));
const TimedExamPage = lazy(() => import('./components/TimedExamPage'));
const CoverageHeatmap = lazy(() => import('./components/CoverageHeatmap'));

// Eagerly loaded components for immediate interaction
import BlitzModePage from './pages/BlitzModePage';

const queryClient = new QueryClient();
function AppContent() {
    const { loadUserData, isDarkMode } = useUserStore();
    const { user, isInitialized, initialize } = useAuthStore();

    useEffect(() => {
        initialize();
        loadUserData();
        startAutoSync();

        // Listen for sync completions to update the UI (especially on first login/cross-device pull)
        const unsubscribe = onSyncStatus((status) => {
            if (status === 'success') {
                loadUserData(); // Reload Dexie data into Zustand memory
            }
        });

        return () => unsubscribe();
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
                <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
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
                        <Route path="/blitz" element={<BlitzModePage />} />
                        <Route path="/prova" element={<TimedExamPage />} />
                        <Route path="/cobertura" element={<CoverageHeatmap />} />
                        <Route path="/configuracoes" element={<SettingsPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </TooltipProvider>
        </QueryClientProvider>
    );
}

function App() {
    return (
        <AppErrorBoundary>
            <AppContent />
        </AppErrorBoundary>
    );
}

export default App;
