import { Component, ErrorInfo, ReactNode } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

// Function component wrapper to use hooks (like useNavigate) inside the class component
export function AppErrorBoundary({ children }: Props) {
    const navigate = useNavigate();
    return <ErrorBoundary navigate={navigate}>{children}</ErrorBoundary>;
}

class ErrorBoundary extends Component<Props & { navigate: ReturnType<typeof useNavigate> }, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Um erro foi capturado pelo Error Boundary:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    private handleGoHome = () => {
        this.setState({ hasError: false, error: null });
        this.props.navigate('/dashboard');
    };

    public render() {
        if (this.state.hasError) {
            return (
                <AppLayout title="Erro Inesperado" subtitle="Algo deu errado">
                    <div className="flex flex-col items-center justify-center p-8 lg:p-16 text-center h-[60vh]">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-sm dark:bg-red-900/30 dark:text-red-400">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Ops! Ocorreu um problema.</h2>
                        <p className="text-muted-foreground mb-8 max-w-md">
                            Ocasionalmente o aplicativo pode encontrar um erro durante a renderização.
                            Você pode tentar recarregar a página ou voltar para o painel principal.
                        </p>

                        {/* Optional: Error details for debugging */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-4 mb-8 p-4 bg-muted/50 rounded-lg text-left overflow-auto max-w-full text-xs text-red-500 font-mono border border-red-200/50">
                                {this.state.error.toString()}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <Button onClick={this.handleReset} className="w-full sm:w-auto gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Recarregar Página
                            </Button>
                            <Button onClick={this.handleGoHome} variant="outline" className="w-full sm:w-auto gap-2">
                                <Home className="w-4 h-4" />
                                Voltar ao Início
                            </Button>
                        </div>
                    </div>
                </AppLayout>
            );
        }

        return this.props.children;
    }
}
