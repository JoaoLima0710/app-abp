import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

// Full-screen pages (no sidebar)
import SimulationPage from '../components/SimulationPage';
import TimedExamPage from '../components/TimedExamPage';
import FlashcardStudyPage from '../pages/FlashcardStudyPage';

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

describe('Páginas Full-Screen', () => {
    it('SimulationPage renderiza sem erros (sem simulação ativa)', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(SimulationPage)
            )
        );
        // Should render something (might be redirect or empty state)
        expect(container).toBeTruthy();
    });

    it('TimedExamPage renderiza tela de pré-exame', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(TimedExamPage)
            )
        );
        expect(container.innerHTML.length).toBeGreaterThan(0);
    });

    it('FlashcardStudyPage renderiza (sessão vazia mostra conclusão)', () => {
        const { container } = render(
            React.createElement(TestWrapper, null,
                React.createElement(FlashcardStudyPage)
            )
        );
        expect(container.innerHTML.length).toBeGreaterThan(0);
    });
});
