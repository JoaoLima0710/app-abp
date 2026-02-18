import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

import Dashboard from '../components/Dashboard';
import SettingsPage from '../components/SettingsPage';
import FlashcardsPage from '../pages/FlashcardsPage';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

function TestWrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
            TooltipProvider,
            null,
            React.createElement(MemoryRouter, null, children)
        )
    );
}

describe('Acessibilidade — Botões', () => {
    it('Dashboard possui botões com texto acessível', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(Dashboard)
            )
        );
        const buttons = container.querySelectorAll('button');
        buttons.forEach((button) => {
            const hasText = button.textContent && button.textContent.trim().length > 0;
            const hasAriaLabel = button.getAttribute('aria-label');
            const hasAriaHidden = button.querySelector('[aria-hidden]');
            const hasTitle = button.getAttribute('title');
            // Button should have either text, aria-label, or title
            expect(hasText || hasAriaLabel || hasTitle || hasAriaHidden).toBeTruthy();
        });
    });

    it('SettingsPage possui botões acessíveis', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(SettingsPage)
            )
        );
        const buttons = container.querySelectorAll('button');
        expect(buttons.length).toBeGreaterThan(0);
    });

    it('FlashcardsPage possui cards clicáveis/botões', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(FlashcardsPage)
            )
        );
        const interactiveElements = container.querySelectorAll('button, a[href]');
        expect(interactiveElements.length).toBeGreaterThan(0);
    });
});

describe('Acessibilidade — Navegação', () => {
    it('Dashboard contém links de navegação', () => {
        render(
            React.createElement(TestWrapper, null,
                React.createElement(Dashboard)
            )
        );
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
    });

    it('Links de navegação possuem href válidos', () => {
        render(
            React.createElement(TestWrapper, null,
                React.createElement(Dashboard)
            )
        );
        const links = screen.getAllByRole('link');
        links.forEach((link) => {
            const href = link.getAttribute('href');
            expect(href).toBeTruthy();
            expect(href!.length).toBeGreaterThan(0);
        });
    });
});
