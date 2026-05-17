import React, { useState, useEffect } from 'react';
import { X, Circle, RotateCcw, Trophy } from 'lucide-react';
import {
    createEmptyBoard,
    applyMove,
    getWinner,
    getWinningLine,
    getBestMove,
    PLAYERS,
    type Board,
    type Cell,
} from '../../core/gameLogic';
import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';

type ThemeId = 'neon' | 'sunset' | 'classic';

const THEME_IDS: ThemeId[] = ['neon', 'sunset', 'classic'];

const THEME_SWATCH: Record<ThemeId, string> = {
    neon: '#34d399',
    sunset: '#fb923c',
    classic: '#3b82f6',
};

/** Shared frosted panels (nav / board / score strip). */
const surfaceMuted = 'border border-(--text-main)/10 bg-(--text-main)/5 backdrop-blur-md';

const ThemeButton = ({
    type,
    current,
    onSelect,
}: {
    type: ThemeId;
    current: ThemeId;
    onSelect: (t: ThemeId) => void;
}) => (
    <button
        type="button"
        onClick={() => onSelect(type)}
        className={`h-5 w-5 rounded-full border-2 transition-all ${current === type ? 'scale-110 border-(--text-main)' : 'border-transparent opacity-40 hover:opacity-100'}`}
        style={{ backgroundColor: THEME_SWATCH[type] }}
    />
);

type SquareProps = {
    value: Cell;
    isWinning: boolean;
    isXNext: boolean;
    disabled: boolean;
    onClick: () => void;
};

const Square = ({ value, isWinning, isXNext, disabled, onClick }: SquareProps) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`
            group relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl border transition-all duration-300 sm:h-28 sm:w-28
            ${isWinning
                ? 'scale-105 bg-(--primary)/10 ring-4 ring-(--primary)/50'
                : 'border-(--text-main)/10 bg-(--text-main)/5 hover:bg-(--text-main)/15'}
        `}
    >
        {value === 'X' && (
            <X size={44} strokeWidth={3} className="icon-glow-primary text-(--primary)" />
        )}
        {value === 'O' && (
            <Circle size={38} strokeWidth={3} className="icon-glow-secondary text-(--secondary)" />
        )}

        {!value && !disabled && (
            <div className="opacity-0 transition-opacity group-hover:opacity-20">
                {isXNext ? (
                    <X size={44} strokeWidth={3} className="text-(--text-main)" />
                ) : (
                    <Circle size={38} strokeWidth={3} className="text-(--text-main)" />
                )}
            </div>
        )}
    </button>
);

const ScoreCard = ({
    label,
    score,
    colorClass,
    isLast = false,
}: {
    label: string;
    score: number;
    colorClass: string;
    isLast?: boolean;
}) => (
    <div className={`flex flex-col items-center ${!isLast ? 'border-r border-(--text-main)/10' : ''}`}>
        <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
            {label}
        </span>
        <span className={`text-2xl font-black ${colorClass}`}>{score}</span>
    </div>
);

const GameStatus = ({
    winner,
    isAiThinking,
    isXNext,
}: {
    winner: string | null;
    isAiThinking: boolean;
    isXNext: boolean;
}) => {
    if (winner === 'draw') {
        return (
            <div className="flex h-10 items-center">
                <span className="border-y border-(--text-main)/10 py-1 text-sm font-black uppercase tracking-[0.3em] text-(--text-muted)">
                    Settled in a Draw
                </span>
            </div>
        );
    }

    if (winner) {
        return (
            <div className="title-glow-primary flex h-10 items-center gap-3 text-3xl font-black tracking-tighter text-(--primary)">
                <Trophy size={28} strokeWidth={2.5} />
                <span className="italic uppercase">{winner} Takes the Win</span>
            </div>
        );
    }

    return (
        <div className="flex h-10 items-center">
            <p className="text-xs font-bold uppercase tracking-widest text-(--text-muted) opacity-80">
                {isAiThinking ? 'AI is calculating...' : `Current Turn: ${isXNext ? 'X' : 'O'}`}
            </p>
        </div>
    );
};

export const TicTacToe: React.FC = () => {
    const [theme, setTheme] = useState<ThemeId>('neon');
    const [board, setBoard] = useState<Board>(createEmptyBoard());
    const [isXNext, setIsXNext] = useState(true);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

    const winner = getWinner(board);
    const winLine = getWinningLine(board);

    useEffect(() => {
        if (!winner) return;
        setScores((s) => {
            if (winner === 'X') return { ...s, X: s.X + 1 };
            if (winner === 'O') return { ...s, O: s.O + 1 };
            if (winner === 'draw') return { ...s, draws: s.draws + 1 };
            return s;
        });
    }, [winner]);

    useEffect(() => {
        if (!isXNext && !winner) {
            setIsAiThinking(true);
            const timer = setTimeout(() => {
                const aiMove = getBestMove(board, PLAYERS.O, 'Impossible');
                if (aiMove !== null) {
                    setBoard((prev) => applyMove(prev, aiMove, PLAYERS.O));
                    setIsXNext(true);
                }
                setIsAiThinking(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isXNext, board, winner]);

    return (
        <div
            data-theme={theme}
            className="relative flex min-h-screen flex-col items-center overflow-hidden bg-(--bg-main) p-6 font-sans text-(--text-main) transition-colors duration-500"
        >
            <BackgroundAtmosphere />
            <div className="relative z-10 flex w-full flex-col items-center">
                <header className="mb-10 mt-4 flex w-full max-w-md flex-col items-center">
                    <nav className={`${surfaceMuted} mb-8 flex gap-3 rounded-full p-1.5`}>
                        {THEME_IDS.map((t) => (
                            <ThemeButton key={t} type={t} current={theme} onSelect={setTheme} />
                        ))}
                    </nav>

                    <h1 className="bg-linear-to-br from-(--primary) to-(--secondary) bg-clip-text text-center text-6xl font-black leading-tight tracking-tighter text-transparent drop-shadow-sm">
                        TIC TAC TOE
                    </h1>
                    <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-(--text-muted)">
                        {theme} edition
                    </p>
                </header>

                <main
                    className={`${surfaceMuted} mb-12 grid grid-cols-3 gap-4 rounded-3xl p-4 shadow-2xl backdrop-blur-xl`}
                >
                    {board.map((cell, i) => (
                        <Square
                            key={i}
                            value={cell}
                            isWinning={winLine?.includes(i) ?? false}
                            isXNext={isXNext}
                            disabled={!!cell || !!winner || isAiThinking}
                            onClick={() => {
                                setBoard((prev) => applyMove(prev, i, PLAYERS.X));
                                setIsXNext(false);
                            }}
                        />
                    ))}
                </main>

                <footer className="flex w-full max-w-xs flex-col items-center gap-8">
                    <div className={`${surfaceMuted} grid w-full grid-cols-3 rounded-3xl p-4`}>
                        <ScoreCard label="Player" score={scores.X} colorClass="text-(--primary)" />
                        <ScoreCard label="Draws" score={scores.draws} colorClass="text-(--text-main)" />
                        <ScoreCard label="AI" score={scores.O} colorClass="text-(--secondary)" isLast />
                    </div>

                    <GameStatus winner={winner} isAiThinking={isAiThinking} isXNext={isXNext} />

                    <button
                        type="button"
                        onClick={() => {
                            setBoard(createEmptyBoard());
                            setIsXNext(true);        // Restores turn sequence to Player
                            setIsAiThinking(false);  // Stop any pending async state trigger
                        }}
                        className="flex items-center gap-3 rounded-2xl bg-(--btn-bg) px-12 py-4 font-black text-(--btn-text) shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                        <RotateCcw size={18} />
                        REMATCH
                    </button>
                </footer>
            </div>
        </div>
    );
};
