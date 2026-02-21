import { useRef, useState } from 'react';
import { exportData, importData } from '../utils/backup';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckCircle2, AlertTriangle, Download, Upload, Sun, Moon, Cloud, LogOut, Info, User } from 'lucide-react';
import { getUserId } from '@/lib/supabaseClient';

export default function SettingsPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const { isDarkMode, toggleDarkMode } = useUserStore();
    const { user, signOut } = useAuthStore();

    const handleExport = async () => {
        try {
            setLoading(true);
            await exportData();
            setStatus({ type: 'success', message: 'Backup gerado com sucesso!' });
        } catch {
            setStatus({ type: 'error', message: 'Erro ao gerar backup.' });
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Yield main thread to allow button UI update (fixes INP block)
        setTimeout(async () => {
            if (!confirm('ATENÇÃO: Importar dados irá substituir seu progresso atual. Deseja continuar?')) {
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            try {
                setLoading(true);
                await importData(file);
                setStatus({ type: 'success', message: 'Dados restaurados com sucesso! Recarregando...' });
                setTimeout(() => window.location.reload(), 2000);
            } catch {
                setStatus({ type: 'error', message: 'Arquivo inválido ou corrompido.' });
            } finally {
                setLoading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        }, 10);
    };

    const handleSignOut = async () => {
        // Yield main thread to allow button UI update (fixes INP block)
        setTimeout(async () => {
            if (confirm('Tem certeza que deseja sair? Seus dados locais serão mantidos.')) {
                await signOut();
            }
        }, 10);
    };

    return (
        <AppLayout title="Configurações" subtitle="Preferências e dados">
            <div className="max-w-2xl space-y-4 lg:space-y-6">
                {/* Account */}
                <Card>
                    <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                        <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                            <User className="h-4 w-4 text-primary" />
                            Conta
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                        {user ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    {user.user_metadata?.avatar_url ? (
                                        <img
                                            src={user.user_metadata.avatar_url}
                                            alt="Avatar"
                                            className="h-10 w-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <User className="h-5 w-5" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">
                                            {user.user_metadata?.full_name || 'Usuário'}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-2 text-[11px] text-green-700 dark:bg-green-950/30 dark:text-green-400">
                                    <Cloud className="h-3.5 w-3.5 shrink-0" />
                                    Sincronização ativa — dados salvos na nuvem
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-2 text-[10px] text-slate-500 font-mono break-all dark:bg-slate-900 dark:text-slate-400">
                                    <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                    ID: {getUserId()}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5 text-[11px] text-red-600 hover:text-red-700 dark:text-red-400 lg:text-sm"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="h-3.5 w-3.5" />
                                    Sair da conta
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-xs text-muted-foreground">Não conectado</p>
                                <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-2 text-[10px] text-slate-500 font-mono break-all dark:bg-slate-900 dark:text-slate-400">
                                    <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                                    ID Local: {getUserId()}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Appearance */}
                <Card>
                    <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                        <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                            {isDarkMode ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
                            Aparência
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 lg:px-6 lg:pb-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="dark-mode" className="text-xs lg:text-sm">Modo Escuro</Label>
                            <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                        </div>
                    </CardContent>
                </Card>

                {/* Data Management */}
                <Card>
                    <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                        <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                            <Download className="h-4 w-4 text-primary" />
                            Gerenciamento de Dados
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4 pb-4 lg:px-6 lg:pb-6">
                        <p className="text-[11px] text-muted-foreground lg:text-xs">
                            Seus dados são salvos no navegador e sincronizados com a nuvem. Faça backups regulares para segurança extra.
                        </p>

                        {status && (
                            <div className={`flex items-center gap-2 rounded-lg p-3 text-[11px] lg:text-sm ${status.type === 'success'
                                ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                                : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                                }`}>
                                {status.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
                                {status.message}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 lg:gap-3">
                            <Button variant="outline" className="gap-1.5 text-[11px] lg:text-sm" onClick={handleExport} disabled={loading}>
                                <Download className="h-3.5 w-3.5" />
                                {loading ? 'Processando...' : 'Exportar Backup'}
                            </Button>

                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".json"
                                    ref={fileInputRef}
                                    onChange={handleImport}
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                    disabled={loading}
                                />
                                <Button className="pointer-events-none gap-1.5 text-[11px] lg:text-sm" disabled={loading}>
                                    <Upload className="h-3.5 w-3.5" />
                                    {loading ? 'Restaurando...' : 'Restaurar Dados'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* About */}
                <Card>
                    <CardHeader className="px-4 pb-2 pt-4 lg:px-6 lg:pb-3 lg:pt-6">
                        <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                            <Info className="h-4 w-4 text-primary" />
                            Sobre
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 px-4 pb-4 text-[11px] text-muted-foreground lg:px-6 lg:pb-6 lg:text-xs">
                        <p><strong>Versão:</strong> 1.1.0 (PWA + Cloud Sync)</p>
                        <p><strong>Desenvolvido para:</strong> Preparação Prova de Título ABP</p>
                        <p>As questões são baseadas nas referências bibliográficas oficiais e provas antigas.</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
