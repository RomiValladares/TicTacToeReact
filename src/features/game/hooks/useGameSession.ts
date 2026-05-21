import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    createEmptyBoard,
    applyMove,
    getGameState,
    getBestMove,
    PLAYERS,
    type Board,
    type DifficultyLevel,
    type GameOutcome,
} from '../../../core/gameLogic';
import { playSound } from '../soundEffects';
import type { Difficulty } from '../types';
import { useGamePersistence } from './useGamePersistence';

function toEngineDifficulty(difficulty: Difficulty): DifficultyLevel {
    if (difficulty === 'unbeatable') return 'Impossible';
    if (difficulty === 'medium') return 'Medium';
    return 'Easy';
}

type UseGameSessionOptions = {
    difficulty: Difficulty;
    isSoundOn: boolean;
    onSquarePlayed?: (index: number) => void;
};

export function useGameSession({ difficulty, isSoundOn, onSquarePlayed }: UseGameSessionOptions) {
    const [board, setBoard] = useState<Board>(() => createEmptyBoard());
    //fixes a bug in Vercel
    const latestBoard = useRef(board);
    useEffect(() => {
        latestBoard.current = board;
    }, [board]);

    const [isXNext, setIsXNext] = useState(true);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const { scores, setScores, resetScores } = useGamePersistence();

    const rematchBtnRef = useRef<HTMLButtonElement>(null);
    const resolvedWinnerRef = useRef<GameOutcome>(null);

    const { winner, winLine } = useMemo(() => getGameState(board), [board]);
    const winningSquares = useMemo(
        () => (winLine ? new Set(winLine) : null),
        [winLine],
    );

    useEffect(() => {
        if (!winner) {
            resolvedWinnerRef.current = null;
            return;
        }
        if (resolvedWinnerRef.current === winner) return;
        resolvedWinnerRef.current = winner;

        if (isSoundOn) {
            playSound(winner === 'draw' ? 'draw' : 'win');
        }

        setScores((s) => {
            if (winner === 'X') return { ...s, X: s.X + 1 };
            if (winner === 'O') return { ...s, O: s.O + 1 };
            if (winner === 'draw') return { ...s, draws: s.draws + 1 };
            return s;
        });

        rematchBtnRef.current?.focus();
    }, [winner, isSoundOn]);

    useEffect(() => {
        if (!isXNext && !winner) {
            setIsAiThinking(true);

            const timer = setTimeout(() => {
                const engineDifficulty = toEngineDifficulty(difficulty);
                const aiMove = getBestMove(board, PLAYERS.O, engineDifficulty);

                if (aiMove !== null) {
                    if (isSoundOn) playSound('clickO');
                    setBoard(applyMove(board, aiMove, PLAYERS.O));
                    setIsXNext(true);
                }

                setIsAiThinking(false);
            }, 600);

            return () => clearTimeout(timer);
        }

        setIsAiThinking(false);
    }, [isXNext, winner, difficulty, isSoundOn, board]);

    const handleSquareClick = useCallback(
        (index: number) => {
            if (isSoundOn) playSound('clickX');
            setBoard((prev) => applyMove(prev, index, PLAYERS.X));
            setIsXNext(false);
            onSquarePlayed?.(index);
        },
        [isSoundOn, onSquarePlayed],
    );

    const rematch = useCallback(() => {
        setBoard(createEmptyBoard());
        setIsXNext(true);
        setIsAiThinking(false);
    }, []);

    const resetAll = useCallback(() => {
        resetScores();
        rematch();
    }, [rematch, resetScores]);

    return {
        board,
        winner,
        winningSquares,
        isXNext,
        isAiThinking,
        scores,
        rematchBtnRef,
        handleSquareClick,
        rematch,
        resetAll,
    };
}
