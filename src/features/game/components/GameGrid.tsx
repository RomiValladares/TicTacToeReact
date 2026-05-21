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
    <div className="relative w-full shrink-0">
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
        <main className={`${surfaceMuted} grid aspect-square w-full grid-cols-3 gap-3 md:gap-4 p-3 rounded-3xl`}>
            {board.map((cell, i) => (
                <Square
                    key={i}
                    index={i}
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
