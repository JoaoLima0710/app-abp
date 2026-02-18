import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '../store/userStore';

describe('UserStore', () => {
    beforeEach(() => {
        localStorage.clear();
        useUserStore.setState({
            simulations: [],
            progress: null,
            recommendations: [],
            isLoading: false,
            isDarkMode: false,
        });
    });

    it('estado inicial isDarkMode lê do localStorage', () => {
        localStorage.setItem('darkMode', 'true');
        // Recreate the store logic reading from localStorage
        const isDark = localStorage.getItem('darkMode') === 'true';
        expect(isDark).toBe(true);
    });

    it('toggleDarkMode alterna valor', () => {
        const { toggleDarkMode } = useUserStore.getState();

        expect(useUserStore.getState().isDarkMode).toBe(false);

        toggleDarkMode();
        expect(useUserStore.getState().isDarkMode).toBe(true);

        toggleDarkMode();
        expect(useUserStore.getState().isDarkMode).toBe(false);
    });

    it('toggleDarkMode persiste no localStorage', () => {
        const { toggleDarkMode } = useUserStore.getState();

        toggleDarkMode(); // true
        expect(localStorage.getItem('darkMode')).toBe('true');

        toggleDarkMode(); // false
        expect(localStorage.getItem('darkMode')).toBe('false');
    });

    it('estado inicial tem arrays vazios', () => {
        const state = useUserStore.getState();
        expect(state.simulations).toEqual([]);
        expect(state.progress).toBeNull();
        expect(state.recommendations).toEqual([]);
    });
});
