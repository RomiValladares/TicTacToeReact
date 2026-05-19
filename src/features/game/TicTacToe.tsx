import React, { useState, useEffect, useRef } from 'react';
import { X, Circle, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { playSound } from './soundEffects';
import { motion } from 'framer-motion';

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

const safeStorage = {
    getItem: (key: string, fallback: string): string => {
        try {
            return localStorage.getItem(key) || fallback;
        } catch (e) {
            return fallback; // Graceful degradation if cookies/storage are blocked
        }
    },
    setItem: (key: string, value: string): void => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            // Silently fail so the app keeps running smoothly
            console.warn(`Storage write blocked for key "${key}":`, e);
        }
    }
};

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
            focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-4 focus-visible:ring-offset-(--bg-main)
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
        <motion.span
            key={score}
            initial={{ scale: 1.5, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`text-xl font-black ${colorClass}`}
        >
            {score}
        </motion.span>
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
    const [theme, setTheme] = useState<ThemeId>(() => {
        return safeStorage.getItem('tictactoe-theme', 'neon') as ThemeId;
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const [difficulty, setDifficulty] = useState<Difficulty>(() => {
        return safeStorage.getItem('tictactoe-difficulty', 'unbeatable') as Difficulty;
    });

    const [isSoundOn, setIsSoundOn] = useState<boolean>(() => {
        return safeStorage.getItem('tictactoe-sound', 'true') !== 'false';
    });

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

    const [board, setBoard] = useState<Board>(createEmptyBoard());
    const [isXNext, setIsXNext] = useState(true);
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

    const winner = getWinner(board);
    const winLine = getWinningLine(board);

    const [showTooltip, setShowTooltip] = useState(() => {
        //TODO: This tooltip is meant to be a one-time onboarding nudge for new users, not quite happy with UI yet
        return safeStorage.getItem('tictactoe-onboarded', 'false') === 'false';
    });

    const dismissTooltip = () => {
        if (showTooltip) {
            setShowTooltip(false);
            safeStorage.setItem('tictactoe-onboarded', 'true');
        }
    };

    useEffect(() => {
        if (!winner) return;

        // Play end game chime
        if (isSoundOn) {
            playSound(winner === 'draw' ? 'draw' : 'win');
        }

        setScores((s) => {
            if (winner === 'X') return { ...s, X: s.X + 1 };
            if (winner === 'O') return { ...s, O: s.O + 1 };
            if (winner === 'draw') return { ...s, draws: s.draws + 1 };
            return s;
        });

        // Autofocus the Rematch button instantly when the game resolves
        rematchBtnRef.current?.focus();
    }, [winner, isSoundOn]);

    useEffect(() => {
        if (!isXNext && !winner) {
            setIsAiThinking(true);
            const timer = setTimeout(() => {
                const engineDifficulty =
                    difficulty === 'unbeatable' ? 'Impossible' :
                        difficulty === 'medium' ? 'Medium' : 'Easy';

                const aiMove = getBestMove(board, PLAYERS.O, engineDifficulty);

                if (aiMove !== null) {
                    setBoard((prev) => applyMove(prev, aiMove, PLAYERS.O));
                    if (isSoundOn) playSound('clickO');
                    setIsXNext(true);
                }
                setIsAiThinking(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isXNext, board, winner, isSoundOn, difficulty]);


    const gridRef = useRef<HTMLDivElement>(null);
    const rematchBtnRef = useRef<HTMLButtonElement>(null);
    const lastInteractionRef = useRef<number>(4); // Ghost memory tracker

    // Global Keyboard Engine (Numbers + Arrows + Focus Recovery)
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            const buttons = gridRef.current?.querySelectorAll<HTMLButtonElement>('button');
            if (!buttons) return;

            const buttonsArray = Array.from(buttons);

            // 1. DIRECT NUMBER INPUT (1-9)
            if (/^[1-9]$/.test(e.key)) {
                const targetIndex = parseInt(e.key, 10) - 1;
                const targetButton = buttonsArray[targetIndex];

                if (targetButton && !targetButton.disabled) {
                    e.preventDefault();
                    targetButton.focus();
                    targetButton.click();
                    lastInteractionRef.current = targetIndex; // Update ghost memory
                }
                return;
            }

            // 2. ARROW KEY TRAVERSAL
            let step = 0;
            switch (e.key) {
                case 'ArrowRight': step = 1; break;
                case 'ArrowLeft': step = -1; break;
                case 'ArrowDown': step = 3; break;
                case 'ArrowUp': step = -3; break;
                default: return; // Ignore all other keys
            }

            e.preventDefault();
            dismissTooltip();

            const active = document.activeElement as HTMLButtonElement;
            let currentIndex = buttonsArray.indexOf(active);

            // FOCUS RECOVERY: If focus dropped to body (-1), resume from ghost memory
            if (currentIndex === -1) {
                currentIndex = lastInteractionRef.current;
            }

            let targetIndex = currentIndex;
            let nextIndex = currentIndex;

            // Find the next available square in the requested direction
            while (step !== 0) {
                nextIndex = (nextIndex + step + 9) % 9;
                if (nextIndex === currentIndex) break;

                if (!buttonsArray[nextIndex].disabled) {
                    targetIndex = nextIndex;
                    break;
                }
            }

            // Fallback: If calculation lands on a disabled square somehow, find any open square
            if (buttonsArray[targetIndex]?.disabled) {
                targetIndex = buttonsArray.findIndex(b => !b.disabled);
            }

            // Apply the focus and save location
            if (targetIndex !== -1) {
                buttonsArray[targetIndex]?.focus();
                lastInteractionRef.current = targetIndex;
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    return (
        <div
            // data-theme={theme}
            className="relative flex min-h-screen flex-col items-center overflow-hidden bg-(--bg-main) p-6 font-sans text-(--text-main) justify-center"
        >
            <BackgroundAtmosphere />

            <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 160,
                    damping: 16,
                    mass: 0.9,
                    delay: 0.15
                }}
                className="relative z-10 flex w-full max-w-xs sm:max-w-sm md:max-w-md flex-col gap-4 items-center"
            >
                {/* HEADER */}
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

                {/* METADATA */}
                <GameStatus winner={winner} isAiThinking={isAiThinking} isXNext={isXNext} />

                {/* GAME GRID */}
                <div className="relative w-full">
                    {showTooltip && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute -top-12 right-2 z-50 flex items-center gap-2 rounded-xl bg-(--primary) px-3 py-2 text-[10px] font-black uppercase tracking-widest text-(--bg-main) shadow-lg"
                        >
                            <span>Try using Arrow Keys or 1-9</span>
                            <div className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 bg-(--primary)" />
                        </motion.div>
                    )}
                    <main
                        ref={gridRef}
                        className={`${surfaceMuted} grid grid-cols-3 gap-3 rounded-3xl p-3 shadow-2xl w-full focus-visible:outline-hidden`}
                    >
                        {board.map((cell, i) => (
                            <Square
                                key={i}
                                value={cell}
                                isWinning={winLine?.includes(i) ?? false}
                                isXNext={isXNext}
                                disabled={!!cell || !!winner || isAiThinking}
                                onClick={() => {
                                    if (isSoundOn) playSound('clickX');

                                    setBoard((prev) => applyMove(prev, i, PLAYERS.X));
                                    dismissTooltip();
                                    setIsXNext(false);

                                    lastInteractionRef.current = i;
                                }}
                            />
                        ))}
                    </main>
                </div>
                {/* REMATCH */}
                <button
                    ref={rematchBtnRef}
                    type="button"
                    onClick={() => {
                        setBoard(createEmptyBoard());
                        setIsXNext(true);
                        setIsAiThinking(false);
                    }}
                    className={`group flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer outline-hidden border
                        ${!!winner
                            ? 'bg-(--text-main) text-(--bg-main) border-transparent shadow-lg scale-100'
                            : 'bg-(--primary)/10 text-(--primary) border-(--primary)/20 hover:bg-(--primary)/20 hover:border-(--primary)/40'
                        }
                        focus-visible:ring-2 ${!!winner ? 'focus-visible:ring-(--primary) focus-visible:ring-offset-4 focus-visible:ring-offset-(--bg-main)' : 'focus-visible:ring-(--primary)/50'}`}
                >
                    {/* Full counter-clockwise 360 spin so the icon never stops upside down */}
                    <div className={`transition-transform duration-700 ease-out 
                        ${!!winner
                            ? '-rotate-360'
                            : 'group-hover:-rotate-360 group-focus-visible:-rotate-360'
                        }`}
                    >
                        <RotateCcw size={14} strokeWidth={2.5} />
                    </div>
                    Rematch
                </button>

                {/* METRICS */}
                <div className="relative w-full mb-2 mt-1">
                    <div className={`${surfaceMuted} grid w-full grid-cols-3 rounded-2xl p-3 pb-5 shadow-sm`}>
                        <ScoreCard label="Player" score={scores.X} colorClass="text-(--primary)" />
                        <ScoreCard label="Draws" score={scores.draws} colorClass="text-(--text-main)" />
                        <ScoreCard label="AI" score={scores.O} colorClass="text-(--secondary)" isLast />
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setScores({ X: 0, O: 0, draws: 0 });
                            setBoard(createEmptyBoard());
                            setIsXNext(true);
                            setIsAiThinking(false);
                        }}
                        className="absolute -bottom-2.5 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full border border-(--text-main)/10 bg-(--text-main)/10 px-4 py-1 text-[9px] font-black uppercase tracking-widest text-(--text-main) shadow-sm backdrop-blur-md transition-all hover:border-(--text-main)/30 hover:bg-(--text-main)/20 cursor-pointer z-10"
                    >
                        Reset
                    </button>
                </div>
                {/* DIFFICULTY SELECT */}
                <div className="grid w-full grid-cols-3 p-1 bg-(--text-main)/5 rounded-xl border border-(--text-main)/10 text-center text-[10px] font-bold tracking-wider uppercase overflow-hidden">
                    {DIFFICULTY_LEVELS.map((level) => {
                        const isActive = difficulty === level;
                        return (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setDifficulty(level)}
                                className={`relative py-1.5 rounded-lg transition-colors duration-300 cursor-pointer ${isActive
                                    ? 'text-(--text-main) font-black'
                                    : 'text-(--text-muted) hover:text-(--text-main)'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeDifficultyIndicator"
                                        className="absolute inset-0 bg-(--text-main)/10 dark:bg-(--text-main)/15 rounded-lg shadow-xs"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{level}</span>
                            </button>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};
