import React, { useState, useEffect } from 'react';
import { X, Circle, RotateCcw, Volume2, VolumeX } from 'lucide-react';

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

type Difficulty = 'easy' | 'medium' | 'unbeatable';
const DIFFICULTY_LEVELS: Difficulty[] = ['easy', 'medium', 'unbeatable'];

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
        className={`h-5 w-5 rounded-full border-2 transition-all cursor-pointer ${current === type ? 'scale-110 border-(--text-main)' : 'border-transparent opacity-40 hover:opacity-100'}`}
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
            group relative z-10 flex w-full aspect-square items-center justify-center rounded-3xl border transition-all duration-300
            ${isWinning
                ? 'scale-105 bg-(--primary)/10 ring-4 ring-(--primary)/50'
                : 'border-(--text-main)/10 bg-(--text-main)/5 hover:bg-(--text-main)/15'}
        `}
    >
        {value === 'X' && (
            <X size={40} strokeWidth={3} className="icon-glow-primary text-(--primary) w-[45%] h-[45%]" />
        )}
        {value === 'O' && (
            <Circle size={34} strokeWidth={3} className="icon-glow-secondary text-(--secondary) w-[40%] h-[40%]" />
        )}

        {!value && !disabled && (
            <div className="opacity-0 transition-opacity group-hover:opacity-20 flex items-center justify-center w-full h-full">
                {isXNext ? (
                    <X size={40} strokeWidth={3} className="text-(--text-main) w-[45%] h-[45%]" />
                ) : (
                    <Circle size={34} strokeWidth={3} className="text-(--text-main) w-[40%] h-[40%]" />
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
        <span className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
            {label}
        </span>
        <span className={`text-xl font-black ${colorClass}`}>{score}</span>
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
            <div className="flex h-8 items-center justify-center">
                <span className="text-xs font-black uppercase tracking-widest text-(--text-muted)">
                    Settled in a Draw
                </span>
            </div>
        );
    }

    if (winner) {
        return (
            <div className="flex h-8 items-center justify-center">
                <span className={`text-xs font-black uppercase tracking-widest ${winner === 'X' ? 'text-(--primary) icon-glow-primary' : 'text-(--secondary) icon-glow-secondary'}`}>
                    {winner} Wins the Match
                </span>
            </div>
        );
    }

    return (
        <div className="flex h-8 items-center justify-center">
            <p className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isXNext ? 'text-(--primary)/70' : 'text-(--secondary)/70'}`}>
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
    const [difficulty, setDifficulty] = useState<Difficulty>('unbeatable');
    const [isSoundOn, setIsSoundOn] = useState<boolean>(true);

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
            className="relative flex min-h-screen flex-col items-center overflow-hidden bg-(--bg-main) p-6 font-sans text-(--text-main) transition-colors duration-500 justify-center"
        >
            <BackgroundAtmosphere />

            {/* Rigid max-w-xs layout wrapper to bound all items cleanly to the board footprint */}
            <div className="relative z-10 flex w-full max-w-xs flex-col gap-4 items-center">

                {/* HEADER UTILITIES */}
                <header className="flex w-full items-center justify-between border-b border-(--text-main)/10 pb-3">
                    <h1 className="bg-linear-to-br from-(--primary) to-(--secondary) bg-clip-text text-2xl font-black tracking-tighter text-transparent select-none">
                        TIC TAC TOE
                    </h1>
                    <div className="flex items-center gap-3">
                        <nav className={`${surfaceMuted} flex gap-2 rounded-full p-1`}>
                            {THEME_IDS.map((t) => (
                                <ThemeButton key={t} type={t} current={theme} onSelect={setTheme} />
                            ))}
                        </nav>
                        <button
                            type="button"
                            onClick={() => setIsSoundOn(!isSoundOn)}
                            className="p-1 text-(--text-muted) hover:text-(--primary) transition-colors cursor-pointer"
                            title={isSoundOn ? "Mute Sound" : "Unmute Sound"}
                        >
                            {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>
                    </div>
                </header>

                {/* METADATA STATUS ZONE */}
                <GameStatus winner={winner} isAiThinking={isAiThinking} isXNext={isXNext} />

                {/* GAME GRID */}
                <main className={`${surfaceMuted} grid grid-cols-3 gap-3 rounded-3xl p-3 shadow-2xl w-full`}>
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

                {/* REMATCH }
                <button
                    type="button"
                    onClick={() => setBoard(createEmptyBoard())}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--btn-bg) py-2.5 text-xs font-black tracking-widest text-(--btn-text) shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer uppercase"
                >
                    <RotateCcw size={14} strokeWidth={2.5} />
                    Rematch
                </button>

                {/* METRICS  */}
                <div className={`${surfaceMuted} grid w-full grid-cols-3 rounded-2xl p-3 shadow-sm`}>
                    <ScoreCard label="Player" score={scores.X} colorClass="text-(--primary)" />
                    <ScoreCard label="Draws" score={scores.draws} colorClass="text-(--text-main)" />
                    <ScoreCard label="AI" score={scores.O} colorClass="text-(--secondary)" isLast />
                </div>

                {/* LEVELS */}
                <div className="grid w-full grid-cols-3 p-1 bg-(--text-main)/5 rounded-xl border border-(--text-main)/10 text-center text-[10px] font-bold tracking-wider uppercase">
                    {DIFFICULTY_LEVELS.map((level) => (
                        <button
                            key={level}
                            type="button"
                            onClick={() => setDifficulty(level)}
                            className={`py-1.5 rounded-lg transition-all cursor-pointer ${difficulty === level
                                    ? 'bg-(--text-main)/10 text-(--text-main) font-black shadow-xs scale-[1.01]'
                                    : 'text-(--text-muted) hover:text-(--text-main)'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};