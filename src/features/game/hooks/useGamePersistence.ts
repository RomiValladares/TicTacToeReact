import { useState, useCallback } from 'react';
import { safeStorage } from '../utils/safeStorage';

const SCORES_KEY = 'tictactoe-scores';

export type Scores = { X: number; O: number; draws: number };

const DEFAULT_SCORES: Scores = { X: 0, O: 0, draws: 0 };

function parseScores(raw: string): Scores {
    try {
        const parsed = JSON.parse(raw) as Partial<Scores>;
        if (
            typeof parsed.X === 'number' &&
            typeof parsed.O === 'number' &&
            typeof parsed.draws === 'number'
        ) {
            return { X: parsed.X, O: parsed.O, draws: parsed.draws };
        }
    } catch {
        // fall through to default
    }
    return DEFAULT_SCORES;
}

function readScores(): Scores {
    return parseScores(safeStorage.getItem(SCORES_KEY, JSON.stringify(DEFAULT_SCORES)));
}

function writeScores(scores: Scores): void {
    safeStorage.setItem(SCORES_KEY, JSON.stringify(scores));
}

export function useGamePersistence() {
    const [scores, setScoresState] = useState<Scores>(readScores);

    const setScores = useCallback((updater: Scores | ((prev: Scores) => Scores)) => {
        setScoresState((prev) => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            writeScores(next);
            return next;
        });
    }, []);

    const resetScores = useCallback(() => {
        setScoresState(() => {
            writeScores(DEFAULT_SCORES);
            return DEFAULT_SCORES;
        });
    }, []);

    return { scores, setScores, resetScores };
}
