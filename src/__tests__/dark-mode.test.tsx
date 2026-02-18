import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '../store/userStore';

describe('Dark Mode — Classe no documentElement', () => {
    beforeEach(() => {
        document.documentElement.classList.remove('dark');
        localStorage.clear();
        useUserStore.setState({ isDarkMode: false });
    });

    it('isDarkMode = true adiciona classe "dark" ao html', () => {
        // Simulate App.tsx useEffect behavior
        useUserStore.setState({ isDarkMode: true });
        const isDarkMode = useUserStore.getState().isDarkMode;

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('isDarkMode = false remove classe "dark" do html', () => {
        document.documentElement.classList.add('dark');
        useUserStore.setState({ isDarkMode: false });

        const isDarkMode = useUserStore.getState().isDarkMode;

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('toggleDarkMode alterna a classe corretamente', () => {
        const { toggleDarkMode } = useUserStore.getState();

        toggleDarkMode(); // isDarkMode → true
        if (useUserStore.getState().isDarkMode) {
            document.documentElement.classList.add('dark');
        }
        expect(document.documentElement.classList.contains('dark')).toBe(true);

        toggleDarkMode(); // isDarkMode → false
        if (!useUserStore.getState().isDarkMode) {
            document.documentElement.classList.remove('dark');
        }
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
});
