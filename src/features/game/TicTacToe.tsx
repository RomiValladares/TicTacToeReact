import React, { useEffect, useRef } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';
import { ThemeButton } from './components/ThemeButton';
import { Square } from './components/Square';
import { ScoreCard } from './components/ScoreCard';
import { GameStatus } from './components/GameStatus';
import { THEME_IDS, DIFFICULTY_LEVELS, surfaceMuted } from './constants';
import { usePersistedSettings } from './hooks/usePersistedSettings';
import { useGameSession } from './hooks/useGameSession';
import { useGridKeyboard } from './hooks/useGridKeyboard';
import { useStableViewportHeight } from './hooks/useStableViewportHeight';

export const TicTacToe: React.FC = () => {
    const {
        theme,
        setTheme,
        difficulty,
        setDifficulty,
        isSoundOn,
        setIsSoundOn,
        showTooltip,
        dismissTooltip,
    } = usePersistedSettings();

    const stableViewportHeight = useStableViewportHeight();
    const squareRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const { setSquareRef, recordInteraction } = useGridKeyboard({
        squareRefs,
        onDismissTooltip: dismissTooltip,
    });

    const {
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
    } = useGameSession({
        difficulty,
        isSoundOn,
        onSquarePlayed: (index) => {
            recordInteraction(index);
            dismissTooltip();
        },
    });

    useEffect(() => {
        if (!showTooltip) return;

        const timeoutId = window.setTimeout(dismissTooltip, 4000);

        const dismissOnInteraction = () => dismissTooltip();

        window.addEventListener('click', dismissOnInteraction);
        window.addEventListener('keydown', dismissOnInteraction);
        window.addEventListener('focusin', dismissOnInteraction);

        return () => {
            window.clearTimeout(timeoutId);
            window.removeEventListener('click', dismissOnInteraction);
            window.removeEventListener('keydown', dismissOnInteraction);
            window.removeEventListener('focusin', dismissOnInteraction);
        };
    }, [showTooltip, dismissTooltip]);

    return (
        <div
            className="fixed inset-x-0 top-0 z-0 flex w-full flex-col items-center justify-center overflow-hidden border-2 border-red-500 bg-(--bg-main) p-4 font-sans text-(--text-main)"
            style={{ height: stableViewportHeight }}
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
                    delay: 0.15,
                }}
                className="relative z-10 flex w-[92%] max-w-[420px] flex-col items-center gap-4 border-2 border-blue-500"
            >
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
                            title={isSoundOn ? 'Mute Sound' : 'Unmute Sound'}
                        >
                            {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        </button>
                    </div>
                </header>

                <GameStatus winner={winner} isAiThinking={isAiThinking} isXNext={isXNext} />

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
                        className={`${surfaceMuted} grid grid-cols-3 gap-3 rounded-3xl border-2 border-green-500 p-3 shadow-2xl w-full focus-visible:outline-hidden`}
                    >
                        {board.map((cell, i) => (
                            <Square
                                key={i}
                                ref={setSquareRef(i)}
                                value={cell}
                                isWinning={winningSquares?.has(i) ?? false}
                                isXNext={isXNext}
                                disabled={!!cell || !!winner || isAiThinking}
                                onClick={() => handleSquareClick(i)}
                            />
                        ))}
                    </main>
                </div>

                <button
                    ref={rematchBtnRef}
                    type="button"
                    onClick={rematch}
                    className={`group flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black tracking-widest uppercase transition-all duration-300 cursor-pointer outline-hidden border
                        ${winner
                            ? 'bg-(--text-main) text-(--bg-main) border-transparent shadow-lg scale-100'
                            : 'bg-(--primary)/10 text-(--primary) border-(--primary)/20 hover:bg-(--primary)/20 hover:border-(--primary)/40'
                        }
                        focus-visible:ring-2 ${winner ? 'focus-visible:ring-(--primary) focus-visible:ring-offset-4 focus-visible:ring-offset-(--bg-main)' : 'focus-visible:ring-(--primary)/50'}`}
                >
                    <div
                        className={`transition-transform duration-700 ease-out 
                        ${winner
                                ? '-rotate-360'
                                : 'group-hover:-rotate-360 group-focus-visible:-rotate-360'
                            }`}
                    >
                        <RotateCcw size={14} strokeWidth={2.5} />
                    </div>
                    Rematch
                </button>

                <div className="relative w-full mb-2 mt-1">
                    <div className={`${surfaceMuted} grid w-full grid-cols-3 rounded-2xl p-3 pb-5 shadow-sm`}>
                        <ScoreCard label="Player" score={scores.X} colorClass="text-(--primary)" />
                        <ScoreCard label="Draws" score={scores.draws} colorClass="text-(--text-main)" />
                        <ScoreCard label="AI" score={scores.O} colorClass="text-(--secondary)" isLast />
                    </div>

                    <button
                        type="button"
                        onClick={resetAll}
                        className="absolute -bottom-2.5 left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full border border-(--text-main)/10 bg-(--text-main)/10 px-4 py-1 text-[9px] font-black uppercase tracking-widest text-(--text-main) shadow-sm backdrop-blur-md transition-all hover:border-(--text-main)/30 hover:bg-(--text-main)/20 cursor-pointer z-10"
                    >
                        Reset
                    </button>
                </div>

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
