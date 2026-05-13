import React, { useState, useEffect } from 'react';
import { X, Circle, RotateCcw, Trophy } from 'lucide-react';
import {
    createEmptyBoard,
    applyMove,
    getWinner,
    getWinningLine,
    getBestMove,
    PLAYERS,
    type Board
} from '../../core/gameLogic';

const ThemeButton = ({ type, current, onSelect }: { type: 'neon' | 'sunset' | 'classic', current: string, onSelect: (t: any) => void }) => (
    <button
        onClick={() => onSelect(type)}
        className={`w-5 h-5 rounded-full border-2 transition-all ${current === type ? 'scale-110 border-(--text-main)' : 'border-transparent opacity-40 hover:opacity-100'}`}
        style={{ backgroundColor: type === 'neon' ? '#34d399' : type === 'sunset' ? '#fb923c' : '#3b82f6' }}
    />
);

const Square = ({ value, isWinning, isXNext, disabled, onClick }: { value: string | null, isWinning: boolean | undefined, isXNext: boolean, disabled: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            group relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-(--bg-main) border border-(--text-main)/10
            flex items-center justify-center transition-all duration-300
            ${isWinning ? 'ring-4 ring-(--primary)/50 bg-(--primary)/10 scale-105' : 'hover:bg-(--text-main)/5'}
        `}
    >
        {value === 'X' && <X size={44} strokeWidth={3} className="text-(--primary) animate-in zoom-in" />}
        {value === 'O' && <Circle size={38} strokeWidth={3} className="text-(--secondary) animate-in zoom-in" />}

        {!value && !disabled && (
            <div className="opacity-0 group-hover:opacity-10 transition-opacity">
                {isXNext ? <X size={44} strokeWidth={3} className="text-(--text-main)" /> : <Circle size={38} strokeWidth={3} className="text-(--text-main)" />}
            </div>
        )}
    </button>
);

const ScoreCard = ({ label, score, colorClass, isLast = false }: { label: string, score: number, colorClass: string, isLast?: boolean }) => (
    <div className={`flex flex-col items-center ${!isLast ? 'border-r border-(--text-main)/10' : ''}`}>
        <span className="text-[10px] font-bold text-(--text-muted) uppercase tracking-widest mb-1">{label}</span>
        <span className={`text-2xl font-black ${colorClass}`}>{score}</span>
    </div>
);

const GameStatus = ({ winner, isAiThinking, isXNext }: { winner: string | null, isAiThinking: boolean, isXNext: boolean }) => {
    if (winner === 'draw') {
        return (
            <div className="h-10 flex items-center">
                <span className="text-sm font-black tracking-[0.3em] text-(--text-muted) uppercase border-y border-white/5 py-1">
                    Settled in a Draw
                </span>
            </div>
        );
    }

    if (winner) {
        return (
            <div className="h-10 flex items-center gap-3 text-3xl font-black tracking-tighter text-(--primary) drop-shadow-[0_0_15px_var(--primary)]">
                <Trophy size={28} strokeWidth={2.5} />
                <span className="italic uppercase">{winner} Takes the Win</span>
            </div>
        );
    }

    return (
        <div className="h-10 flex items-center">
            <p className="text-(--text-muted) font-bold tracking-widest text-xs uppercase opacity-80">
                {isAiThinking ? "AI is calculating..." : `Current Turn: ${isXNext ? 'X' : 'O'}`}
            </p>
        </div>
    );
};

// --- Main Component ---

export const TicTacToe: React.FC = () => {
    const [theme, setTheme] = useState<'neon' | 'sunset' | 'classic'>('neon');
    const [board, setBoard] = useState<Board>(createEmptyBoard());
    const [isXNext, setIsXNext] = useState<boolean>(true);
    const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
    const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

    const winner = getWinner(board);
    const winLine = getWinningLine(board);

    useEffect(() => {
        if (winner === 'X') setScores(s => ({ ...s, X: s.X + 1 }));
        if (winner === 'O') setScores(s => ({ ...s, O: s.O + 1 }));
        if (winner === 'draw') setScores(s => ({ ...s, draws: s.draws + 1 }));
    }, [winner]);

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

    return (
        <div data-theme={theme} className="flex flex-col items-center min-h-screen bg-(--bg-main) text-(--text-main) p-6 transition-colors duration-500 font-sans">

            <header className="w-full max-w-md flex flex-col items-center mb-10 mt-4">
                <nav className="flex gap-3 mb-8 bg-(--text-main)/5 p-1.5 rounded-full border border-(--text-main)/10 backdrop-blur-md">
                    {(['neon', 'sunset', 'classic'] as const).map(t => (
                        <ThemeButton key={t} type={t} current={theme} onSelect={setTheme} />
                    ))}
                </nav>

                <h1 className="text-6xl font-black tracking-tighter bg-linear-to-br from-(--primary) to-(--secondary) bg-clip-text text-transparent leading-tight text-center drop-shadow-sm">
                    TIC TAC TOE
                </h1>
                <p className="text-(--text-muted) font-black uppercase tracking-[0.2em] text-[10px] mt-2">
                    {theme} edition
                </p>
            </header>

            <main className="grid grid-cols-3 gap-4 bg-(--text-main)/5 p-4 rounded-3xl border border-(--text-main)/10 shadow-2xl backdrop-blur-xl mb-12">
                {board.map((cell, i) => (
                    <Square
                        key={i}
                        value={cell}
                        isWinning={winLine?.includes(i)}
                        isXNext={isXNext}
                        disabled={!!cell || !!winner || isAiThinking}
                        onClick={() => {
                            setBoard(prev => applyMove(prev, i, PLAYERS.X));
                            setIsXNext(false);
                        }}
                    />
                ))}
            </main>

            <footer className="w-full max-w-xs flex flex-col items-center gap-8">
                <div className="grid grid-cols-3 w-full bg-(--text-main)/5 rounded-3xl border border-(--text-main)/10 p-4 backdrop-blur-md">
                    <ScoreCard label="Player" score={scores.X} colorClass="text-(--primary)" />
                    <ScoreCard label="Draws" score={scores.draws} colorClass="text-(--text-main)" />
                    <ScoreCard label="AI" score={scores.O} colorClass="text-(--secondary)" isLast />
                </div>

                <GameStatus winner={winner} isAiThinking={isAiThinking} isXNext={isXNext} />

                <button
                    onClick={() => setBoard(createEmptyBoard())}
                    className="flex items-center gap-3 px-12 py-4 bg-(--btn-bg) text-(--btn-text) font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                    <RotateCcw size={18} />
                    REMATCH
                </button>
            </footer>
        </div>
    );
};