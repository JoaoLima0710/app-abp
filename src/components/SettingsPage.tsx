import { useRef, useState } from 'react';
import { exportData, importData } from '../utils/backup';
import { Settings, Download, Upload, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        try {
            setLoading(true);
            await exportData();
            setStatus({ type: 'success', message: 'Backup gerado com sucesso!' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Erro ao gerar backup.' });
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm('ATENÇÃO: Importar dados irá substituir seu progresso atual. Deseja continuar?')) {
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        try {
            setLoading(true);
            await importData(file);
            setStatus({ type: 'success', message: 'Dados restaurados com sucesso! Recarregue a página.' });
            setTimeout(() => window.location.reload(), 2000);
        } catch (error) {
            setStatus({ type: 'error', message: 'Arquivo inválido ou corrompido.' });
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="page animate-fade-in">
            <header className="page-header">
                <h1 className="page-title">
                    <Settings size={32} style={{ marginRight: 12 }} />
                    Configurações
                </h1>
                <p className="page-subtitle">
                    Gerencie seus dados e preferências
                </p>
            </header>

            <div className="card">
                <h3 className="card-title mb-4">Gerenciamento de Dados</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-6)' }}>
                    Seus dados são salvos automaticamente no navegador. Para garantir que você não perca seu progresso
                    caso limpe o cache, ou para usar em outro dispositivo, faça backups regulares.
                </p>

                {status && (
                    <div style={{
                        padding: 'var(--spacing-4)',
                        background: status.type === 'success' ? 'var(--success-50)' : 'var(--error-50)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--spacing-6)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)',
                        color: status.type === 'success' ? 'var(--success-700)' : 'var(--error-700)',
                    }}>
                        {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                        {status.message}
                    </div>
                )}

                <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                    <button
                        className="btn btn-secondary btn-lg"
                        onClick={handleExport}
                        disabled={loading}
                    >
                        <Download size={20} />
                        {loading ? 'Processando...' : 'Exportar Backup'}
                    </button>

                    <div style={{ position: 'relative' }}>
                        <input
                            type="file"
                            accept=".json"
                            ref={fileInputRef}
                            onChange={handleImport}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer',
                            }}
                            disabled={loading}
                        />
                        <button
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                            style={{ pointerEvents: 'none' }}
                        >
                            <Upload size={20} />
                            {loading ? 'Restaurando...' : 'Restaurar Dados'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: 'var(--spacing-6)' }}>
                <h3 className="card-title mb-4">Sobre o App</h3>
                <div className="flex flex-col gap-2" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    <p><strong>Versão:</strong> 1.0.0 (PWA)</p>
                    <p><strong>Desenvolvido para:</strong> Preparação Prova de Título ABP</p>
                    <p>As questões são baseadas nas referências bibliográficas oficiais e provas antigas.</p>
                </div>
            </div>
        </div>
    );
}
