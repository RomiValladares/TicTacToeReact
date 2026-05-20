import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';
import { GameControls } from './components/GameControls';
import { GameGrid } from './components/GameGrid';
import { GameHeader } from './components/GameHeader';
import { GameStatus } from './components/GameStatus';
import { usePersistedSettings } from './hooks/usePersistedSettings';
import { useGameSession } from './hooks/useGameSession';
import { useGridKeyboard } from './hooks/useGridKeyboard';
import { useStableViewportHeight } from './utils/useStableViewportHeight';

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
            className="fixed inset-x-0 top-0 z-0 flex w-full flex-col overflow-hidden bg-(--bg-main) px-5 py-2 font-sans text-(--text-main) md:items-center md:justify-center md:p-6"
            style={{
                height: stableViewportHeight,
                ['--stable-vh' as string]: `${stableViewportHeight}px`,
            }}
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
                className="relative z-10 flex h-full w-full min-h-0 flex-col justify-center gap-4 md:h-auto md:max-w-md md:gap-5"
            >
                <div className="flex w-full shrink-0 flex-col">
                    <GameHeader
                        theme={theme}
                        onThemeChange={setTheme}
                        isSoundOn={isSoundOn}
                        onSoundToggle={() => setIsSoundOn(!isSoundOn)}
                    />

                    <div className="my-5 shrink-0">
                        <GameStatus
                            winner={winner}
                            isAiThinking={isAiThinking}
                            isXNext={isXNext}
                        />
                    </div>

                    <GameGrid
                        board={board}
                        winner={winner}
                        winningSquares={winningSquares}
                        isXNext={isXNext}
                        isAiThinking={isAiThinking}
                        showTooltip={showTooltip}
                        setSquareRef={setSquareRef}
                        onSquareClick={handleSquareClick}
                    />
                </div>

                <GameControls
                    winner={winner}
                    scores={scores}
                    difficulty={difficulty}
                    rematchBtnRef={rematchBtnRef}
                    onRematch={rematch}
                    onResetAll={resetAll}
                    onDifficultyChange={setDifficulty}
                />
            </motion.div>
        </div>
    );
};
