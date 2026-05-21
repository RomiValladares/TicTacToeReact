import { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';
import { GameControls } from './components/GameControls';
import { GameGrid } from './components/GameGrid';
import { GameHeader } from './components/GameHeader';
import { GameStatus } from './components/GameStatus';
import { usePersistedSettings } from './hooks/usePersistedSettings';
import { useGameSession } from './hooks/useGameSession';
import { useGridKeyboard } from './hooks/useGridKeyboard';
import { useStableViewportHeight } from './hooks/useStableViewportHeight';

export function TicTacToe() {
    const {
        theme,
        setTheme,
        difficulty,
        setDifficulty,
        isSoundOn,
        toggleSound,
        isOnboardingVisible,
        dismissOnboarding,
    } = usePersistedSettings();

    const stableViewportHeight = useStableViewportHeight();

    const squareRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const { setSquareRef, recordInteraction } = useGridKeyboard({
        squareRefs,
        onDismissOnboarding: dismissOnboarding,
    });

    const handleSquarePlayed = useCallback(
        (index: number) => {
            recordInteraction(index);
            dismissOnboarding();
        },
        [recordInteraction, dismissOnboarding],
    );

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
        onSquarePlayed: handleSquarePlayed,
    });

    useEffect(() => {
        if (!isOnboardingVisible) return;

        const timeoutId = window.setTimeout(dismissOnboarding, 4000);

        const dismissOnInteraction = () => dismissOnboarding();

        window.addEventListener('click', dismissOnInteraction);
        window.addEventListener('keydown', dismissOnInteraction);
        window.addEventListener('focusin', dismissOnInteraction);

        return () => {
            window.clearTimeout(timeoutId);
            window.removeEventListener('click', dismissOnInteraction);
            window.removeEventListener('keydown', dismissOnInteraction);
            window.removeEventListener('focusin', dismissOnInteraction);
        };
    }, [isOnboardingVisible, dismissOnboarding]);

    return (
        <main
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
                        onSoundToggle={toggleSound}
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
                        isOnboardingVisible={isOnboardingVisible}
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
        </main>
    );
}
