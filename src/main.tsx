import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { initializeDatabase } from './db/database'

// Apply saved theme (class-based for Tailwind)
const savedDarkMode = localStorage.getItem('darkMode') === 'true';
if (savedDarkMode) {
    document.documentElement.classList.add('dark');
}

// Initialize database BEFORE rendering the app
initializeDatabase().then(() => {
    console.log('Database initialized');
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>,
    );
});
