import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { initializeDatabase } from './db/database'

// Initialize database on app load
initializeDatabase().then(() => {
    console.log('Database initialized');
});

// Apply saved theme
const savedTheme = localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)
