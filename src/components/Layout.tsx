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
            <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''} animate-slide-in-left`}>
                <div className="sidebar-header" style={{ marginBottom: 'var(--spacing-8)', padding: 'var(--spacing-4) 0' }}>
                    <div className="flex items-center gap-3">
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, var(--primary-500), var(--secondary-500))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Brain size={24} color="white" />
                        </div>
                        <div>
                            <h1 className="text-h4 gradient-text-primary" style={{ margin: 0 }}>
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
                                    <item.icon size={20} />
                                    {item.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{
                    marginTop: 'auto',
                    paddingTop: 'var(--spacing-8)',
                    borderTop: '1px solid var(--border-color)',
                }}>
                    <button
                        className="btn btn-ghost w-full"
                        onClick={toggleDarkMode}
                        style={{ justifyContent: 'flex-start' }}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
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
