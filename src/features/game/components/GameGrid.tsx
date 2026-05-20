import { motion } from 'framer-motion';

import type { Board, GameOutcome } from '../../../core/gameLogic';
import { surfaceMuted } from '../constants';
import { Square } from './Square';

type GameGridProps = {
    board: Board;
    winner: GameOutcome;
    winningSquares: Set<number> | null;
    isXNext: boolean;
    isAiThinking: boolean;
    showTooltip: boolean;
    setSquareRef: (index: number) => (el: HTMLButtonElement | null) => void;
    onSquareClick: (index: number) => void;
};

export const GameGrid = ({
    board,
    winner,
    winningSquares,
    isXNext,
    isAiThinking,
    showTooltip,
    setSquareRef,
    onSquareClick,
}: GameGridProps) => (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center justify-center md:flex-none">
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
            className={`${surfaceMuted} grid aspect-square w-full min-h-0 max-h-[min(100%,calc(var(--stable-vh)-13rem))] max-w-full shrink grid-cols-3 gap-2 rounded-3xl p-2 shadow-2xl focus-visible:outline-hidden sm:gap-3 sm:p-3`}
        >
            {board.map((cell, i) => (
                <Square
                    key={i}
                    ref={setSquareRef(i)}
                    value={cell}
                    isWinning={winningSquares?.has(i) ?? false}
                    isXNext={isXNext}
                    disabled={!!cell || !!winner || isAiThinking}
                    onClick={() => onSquareClick(i)}
                />
            ))}
        </main>
    </div>
);
