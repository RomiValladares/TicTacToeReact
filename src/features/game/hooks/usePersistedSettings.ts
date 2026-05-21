import { useState, useEffect, useCallback } from 'react';
import { safeStorage } from '../utils/safeStorage';
import type { Difficulty, ThemeId } from '../types';

export function usePersistedSettings() {
    const [theme, setTheme] = useState<ThemeId>(
        () => safeStorage.getItem('tictactoe-theme', 'neon') as ThemeId,
    );

    const [difficulty, setDifficulty] = useState<Difficulty>(
        () => safeStorage.getItem('tictactoe-difficulty', 'unbeatable') as Difficulty,
    );

    const [isSoundOn, setIsSoundOn] = useState<boolean>(
        () => safeStorage.getItem('tictactoe-sound', 'true') !== 'false',
    );

    const [isOnboardingVisible, setIsOnboardingVisible] = useState(
        () => safeStorage.getItem('tictactoe-onboarded', 'false') === 'false',
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        safeStorage.setItem('tictactoe-theme', theme);
    }, [theme]);

    useEffect(() => {
        safeStorage.setItem('tictactoe-difficulty', difficulty);
    }, [difficulty]);

    useEffect(() => {
        safeStorage.setItem('tictactoe-sound', String(isSoundOn));
    }, [isSoundOn]);

    const toggleSound = useCallback(() => {
        setIsSoundOn((on) => !on);
    }, []);

    const dismissOnboarding = useCallback(() => {
        setIsOnboardingVisible((visible) => {
            if (visible) {
                safeStorage.setItem('tictactoe-onboarded', 'true');
            }
            return false;
        });
    }, []);

    return {
        theme,
        setTheme,
        difficulty,
        setDifficulty,
        isSoundOn,
        toggleSound,
        isOnboardingVisible,
        dismissOnboarding,
    };
}
