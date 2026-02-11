import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import {
    Home,
    PlusCircle,
    BarChart3,
    BookOpen,
    Moon,
    Sun,
    Brain,
    Menu,
    X,
    TrendingUp,
    Settings
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
        { path: '/flashcards', icon: Brain, label: 'Flashcards' },
        { path: '/simulado/novo', icon: PlusCircle, label: 'Novo Simulado' },
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
        <div className="layout-with-sidebar">
            {/* Mobile menu button */}
            <button
                className="btn btn-icon mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile overlay backdrop */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
                <div className="sidebar-header" style={{ marginBottom: 'var(--spacing-6)', padding: 'var(--spacing-3) 0' }}>
                    <div className="flex items-center gap-3">
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Brain size={22} color="white" />
                        </div>
                        <div>
                            <h1 className="text-h4 gradient-text-primary" style={{ margin: 0, fontSize: '1.1rem' }}>
                                PsiqTítulo
                            </h1>
                            <p className="text-caption" style={{ color: 'var(--text-tertiary)', margin: 0 }}>
                                Prova de Título ABP
                            </p>
                        </div>
                    </div>
                </div>

                <nav>
                    <ul className="nav-list">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `nav-item ${isActive ? 'nav-item--active' : ''}`
                                    }
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{
                    marginTop: 'auto',
                    paddingTop: 'var(--spacing-6)',
                    borderTop: '1px solid var(--border-color)',
                }}>
                    <button
                        className="btn btn-ghost w-full"
                        onClick={toggleDarkMode}
                        style={{ justifyContent: 'flex-start', fontSize: 'var(--font-size-sm)' }}
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="main-content">
                <div className="container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
