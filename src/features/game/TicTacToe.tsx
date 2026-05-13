import React, { useState, useEffect } from 'react';
import { X, Circle, RotateCcw } from 'lucide-react';
import {
    createEmptyBoard,
    applyMove,
    getWinner,
    getWinningLine,
    getBestMove,
    PLAYERS,
    type Board
} from '../../core/gameLogic';

export const TicTacToe: React.FC = () => {
    const [theme, setTheme] = useState<'neon' | 'sunset' | 'classic'>('neon');
    const [board, setBoard] = useState<Board>(createEmptyBoard());
    const [isXNext, setIsXNext] = useState<boolean>(true);
    const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

    // Scoreboard State
    const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

    const winner = getWinner(board);
    const winLine = getWinningLine(board); // Get the [a, b, c] array

    // Update scores when game ends
    useEffect(() => {
        if (winner === 'X') setScores(s => ({ ...s, X: s.X + 1 }));
        if (winner === 'O') setScores(s => ({ ...s, O: s.O + 1 }));
        if (winner === 'draw') setScores(s => ({ ...s, draws: s.draws + 1 }));
    }, [winner]);

    // AI Logic
    useEffect(() => {
        if (!isXNext && !winner) {
            setIsAiThinking(true);
            const timer = setTimeout(() => {
                const aiMove = getBestMove(board, PLAYERS.O, "Impossible");
                if (aiMove !== null) {
                    setBoard(prev => applyMove(prev, aiMove, PLAYERS.O));
                    setIsXNext(true);
                }
                setIsAiThinking(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isXNext, board, winner]);

    const handleSquareClick = (index: number) => {
        if (board[index] || winner || isAiThinking) return;
        setBoard(prev => applyMove(prev, index, PLAYERS.X));
        setIsXNext(false);
    };

    return (
        <div data-theme={theme} className="flex flex-col items-center min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-6 transition-colors duration-500">

            <header className="w-full max-w-md flex flex-col items-center mb-10 mt-4">
                {/* Theme Switcher */}
                <div className="flex gap-3 mb-8 bg-[var(--text-main)]/5 p-1.5 rounded-full border border-[var(--text-main)]/10">
                    {(['neon', 'sunset', 'classic'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={`w-5 h-5 rounded-full border-2 transition-all ${theme === t ? 'scale-110 border-[var(--text-main)]' : 'border-transparent opacity-40'}`}
                            style={{ backgroundColor: t === 'neon' ? '#34d399' : t === 'sunset' ? '#fb923c' : '#3b82f6' }}
                        />
                    ))}
                </div>

                <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent leading-tight text-center drop-shadow-sm">
                    TIC TAC TOE
                </h1>
                <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.2em] text-[10px] mt-2">
                    {theme} edition
                </p>
            </header>

            {/* BOARD */}
            <main className="grid grid-cols-3 gap-4 bg-[var(--text-main)]/5 p-4 rounded-[2.5rem] border border-[var(--text-main)]/10 shadow-2xl backdrop-blur-xl mb-12">
                {board.map((cell, i) => {
                    const isWinningSquare = winLine?.includes(i);
                    return (
                        <button
                            key={i}
                            onClick={() => handleSquareClick(i)}
                            disabled={!!cell || !!winner || isAiThinking}
                            className={`
                group relative w-24 h-24 sm:w-28 sm:h-28 rounded-[1.5rem] bg-[var(--bg-main)] border border-[var(--text-main)]/10
                flex items-center justify-center transition-all duration-300
                ${isWinningSquare ? 'ring-4 ring-[var(--primary)]/50 bg-[var(--primary)]/10 scale-105' : 'hover:bg-[var(--text-main)]/5'}
              `}
                        >
                            {cell === 'X' && <X size={44} strokeWidth={3} className="text-[var(--primary)]" />}
                            {cell === 'O' && <Circle size={38} strokeWidth={3} className="text-[var(--secondary)]" />}

                            {!cell && !winner && !isAiThinking && (
                                <div className="opacity-0 group-hover:opacity-10 transition-opacity">
                                    {isXNext ? <X size={44} strokeWidth={3} className="text-[var(--text-main)]" /> : <Circle size={38} strokeWidth={3} className="text-[var(--text-main)]" />}
                                </div>
                            )}
                        </button>
                    );
                })}
            </main>

            <footer className="w-full max-w-xs flex flex-col items-center gap-8">
                {/* Scoreboard */}
                <div className="grid grid-cols-3 w-full bg-[var(--text-main)]/5 rounded-3xl border border-[var(--text-main)]/10 p-4">
                    <div className="flex flex-col items-center border-r border-[var(--text-main)]/10">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Player</span>
                        <span className="text-2xl font-black text-[var(--primary)]">{scores.X}</span>
                    </div>
                    <div className="flex flex-col items-center border-r border-[var(--text-main)]/10">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Draws</span>
                        <span className="text-2xl font-black">{scores.draws}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">AI</span>
                        <span className="text-2xl font-black text-[var(--secondary)]">{scores.O}</span>
                    </div>
                </div>

                <button
                    onClick={() => setBoard(createEmptyBoard())}
                    className="flex items-center gap-3 px-12 py-4 bg-[var(--btn-bg)] text-[var(--btn-text)] font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/5"
                >
                    <RotateCcw size={18} />
                    REMATCH
                </button>
            </footer>
        </div>
    );
};