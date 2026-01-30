import { Link, Outlet, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import {
    Home,
    PlusCircle,
    BarChart3,
    BookOpen,
    Moon,
    Sun,
    Menu,
    X,
    TrendingUp,
    Settings,
    History
} from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
    const { isDarkMode, toggleDarkMode } = useUserStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const isSimulationActive = location.pathname.includes('/simulado/') &&
        !location.pathname.includes('/novo') &&
        !location.pathname.includes('/resultado');

    const navItems = [
        { path: '/', icon: Home, label: 'Dashboard' },
        { path: '/simulado/novo', icon: PlusCircle, label: 'Novo Simulado' },
        { path: '/historico', icon: History, label: 'Histórico' },
        { path: '/estatisticas', icon: BarChart3, label: 'Estatísticas' },
        { path: '/plano-de-estudos', icon: BookOpen, label: 'Plano de Estudos' },
        { path: '/tendencias', icon: TrendingUp, label: 'Tendências' },
        { path: '/configuracoes', icon: Settings, label: 'Configurações' },
    ];

    // Hide sidebar during active simulation for focus
    if (isSimulationActive) {
        return (
            <main className="main-content" style={{ padding: 0 }}>
                <Outlet />
            </main>
        );
    }

    return (
        <div className="layout-with-sidebar md:flex min-h-screen bg-gray-50">
            {/* Mobile menu button */}
            <button
                className="btn btn-icon mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 100,
                    display: 'none',
                }}
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''} md:block md:w-72 md:shrink-0 md:h-screen md:sticky md:top-0 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out z-20`}
                style={{
                    width: '280px',
                    minWidth: '280px',
                    height: '100vh',
                    backgroundColor: '#ffffff',
                    borderRight: '1px solid #e5e7eb',
                    position: 'sticky',
                    top: 0
                }}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200" style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <h1 className="text-2xl font-bold text-gray-800" style={{ color: '#1f2937' }}>PsiqTítulo</h1>
                        <p className="text-sm text-gray-500" style={{ color: '#6b7280' }}>Estudos para Prova de Título</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`nav-item flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        backgroundColor: isActive ? '#eff6ff' : 'transparent',
                                        color: isActive ? '#1d4ed8' : '#4b5563',
                                        marginBottom: '4px',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <Icon size={20} className={`mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} style={{ marginRight: '12px', color: isActive ? '#1d4ed8' : '#9ca3af' }} />
                                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-200" style={{ borderTop: '1px solid #e5e7eb' }}>
                        <button
                            className="btn btn-ghost w-full flex items-center gap-2"
                            onClick={toggleDarkMode}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                width: '100%',
                                color: '#4b5563',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '8px'
                            }}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                            {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="main-content flex-1 min-w-0 p-8" style={{ flex: '1 1 0%', padding: '2rem', minWidth: 0 }}>
                <div className="container mx-auto">
                    <Outlet />
                </div>
            </main>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-menu-btn {
                        display: flex !important;
                    }
                }
            `}</style>
        </div>
    );
}
