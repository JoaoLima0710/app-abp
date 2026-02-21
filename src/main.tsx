import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './utils/chunkErrorHandler'
import { initializeDatabase } from './db/database'

// Apply saved theme (class-based for Tailwind)
const savedDarkMode = localStorage.getItem('darkMode') === 'true';
if (savedDarkMode) {
    document.documentElement.classList.add('dark');
}

// Initialize database BEFORE rendering the app
initializeDatabase()
    .then(() => {
        console.log('Database initialized');
        ReactDOM.createRoot(document.getElementById('root')!).render(
            <React.StrictMode>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </React.StrictMode>,
        );
    })
    .catch((err) => {
        console.error('Fatal Error during database initialization:', err);
        document.getElementById('root')!.innerHTML = `
            <div style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; color: #333 text-align: center;">
                <h1 style="color: #ef4444; font-size: 1.5rem;">Erro de Inicialização do Banco de Dados</h1>
                <p>O aplicativo não conseguiu carregar o banco de dados local. Isso geralmente ocorre devido a restrições do navegador (ex: Modo Privado restrito) ou falha no download do pacote inicial de questões.</p>
                <div style="background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; color: #ef4444; font-size: 0.875rem; overflow: auto; margin-top: 1rem; text-align: left;">
                    <strong>Detalhes do erro:</strong><br/>
                    ${err?.message || String(err)}
                </div>
                <button onclick="window.location.reload()" style="margin-top: 1.5rem; background: #4f46e5; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500;">
                    Tentar Novamente
                </button>
            </div>
        `;
    });
