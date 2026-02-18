import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

// Pages with AppLayout (sidebar)
import Dashboard from '../components/Dashboard';
import SimulationSetup from '../components/SimulationSetup';
import StatisticsPanel from '../components/StatisticsPanel';
import StudyPlan from '../components/StudyPlan';
import TrendsPage from '../components/TrendsPage';
import SettingsPage from '../components/SettingsPage';
import FlashcardsPage from '../pages/FlashcardsPage';
import CoverageHeatmap from '../components/CoverageHeatmap';

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

describe('Renderização de Páginas com AppLayout', () => {
    it('Dashboard renderiza sem erros', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(Dashboard)
            )
        );
        expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('SimulationSetup renderiza sem erros', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(SimulationSetup)
            )
        );
        expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('StatisticsPanel renderiza sem erros', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(StatisticsPanel)
            )
        );
        expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('StudyPlan renderiza sem erros', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(StudyPlan)
            )
        );
        expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('TrendsPage renderiza sem erros', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(TrendsPage)
            )
        );
        expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('SettingsPage renderiza sem erros', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(SettingsPage)
            )
        );
        expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('FlashcardsPage renderiza sem erros', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(FlashcardsPage)
            )
        );
        expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('CoverageHeatmap renderiza sem erros', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(CoverageHeatmap)
            )
        );
        expect(container.innerHTML.length).toBeGreaterThan(0);
    });
});

describe('Dashboard — Elementos UI essenciais', () => {
    it('contém links de navegação', () => {
        render(
            React.createElement(TestWrapper, null,
                React.createElement(Dashboard)
            )
        );
        // Should have navigation links in the sidebar
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
    });
});

describe('SettingsPage — Elementos UI essenciais', () => {
    it('contém controles de configuração', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(SettingsPage)
            )
        );
        // Should have buttons
        const buttons = container.querySelectorAll('button');
        expect(buttons.length).toBeGreaterThan(0);
    });
});
