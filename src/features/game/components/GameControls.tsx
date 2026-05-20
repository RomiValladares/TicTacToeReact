import type { RefObject } from 'react';
import { RotateCcw } from 'lucide-react';

import type { GameOutcome } from '../../../core/gameLogic';
import { DIFFICULTY_LEVELS, surfaceMuted } from '../constants';
import type { Difficulty } from '../types';
import { ScoreCard } from './ScoreCard';

type Scores = { X: number; O: number; draws: number };

type GameControlsProps = {
    winner: GameOutcome;
    scores: Scores;
    difficulty: Difficulty;
    rematchBtnRef: RefObject<HTMLButtonElement | null>;
    onRematch: () => void;
    onResetAll: () => void;
    onDifficultyChange: (difficulty: Difficulty) => void;
};

export const GameControls = ({
    winner,
    scores,
    difficulty,
    rematchBtnRef,
    onRematch,
    onResetAll,
    onDifficultyChange,
}: GameControlsProps) => (
    <div className="flex w-full shrink-0 flex-col gap-4 md:gap-5">
        <button
            ref={rematchBtnRef}
            type="button"
            onClick={onRematch}
            className={`group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-black tracking-widest uppercase outline-hidden transition-all duration-300
                ${winner
                    ? 'scale-100 border-transparent bg-(--text-main) text-(--bg-main) shadow-lg'
                    : 'border-(--primary)/20 bg-(--primary)/10 text-(--primary) hover:border-(--primary)/40 hover:bg-(--primary)/20'
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

        <div className="relative mb-2 w-full">
            <div className={`${surfaceMuted} grid w-full grid-cols-3 rounded-2xl p-3 pb-5 shadow-sm`}>
                <ScoreCard label="Player" score={scores.X} colorClass="text-(--primary)" />
                <ScoreCard label="Draws" score={scores.draws} colorClass="text-(--text-main)" />
                <ScoreCard label="AI" score={scores.O} colorClass="text-(--secondary)" isLast />
            </div>

            <button
                type="button"
                onClick={onResetAll}
                className="absolute -bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-(--text-main)/10 bg-(--text-main)/10 px-4 py-1 text-[9px] font-black uppercase tracking-widest text-(--text-main) shadow-sm backdrop-blur-md transition-all hover:border-(--text-main)/30 hover:bg-(--text-main)/20"
            >
                Reset
            </button>
        </div>

        <div className="relative grid w-full grid-cols-3 overflow-hidden rounded-xl border border-(--text-main)/10 bg-(--text-main)/5 p-1 text-center text-[10px] font-bold tracking-wider uppercase">
            <div
                aria-hidden
                className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-lg bg-(--text-main)/10 shadow-xs transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none dark:bg-(--text-main)/15"
                style={{
                    width: 'calc((100% - 0.5rem) / 3)',
                    transform: `translateX(calc(${DIFFICULTY_LEVELS.indexOf(difficulty)} * 100%))`,
                }}
            />
            {DIFFICULTY_LEVELS.map((level) => {
                const isActive = difficulty === level;
                return (
                    <button
                        key={level}
                        type="button"
                        onClick={() => onDifficultyChange(level)}
                        className={`relative z-10 cursor-pointer rounded-lg py-1.5 transition-colors duration-300 ${isActive
                            ? 'font-black text-(--text-main)'
                            : 'text-(--text-muted) hover:text-(--text-main)'
                            }`}
                    >
                        {level}
                    </button>
                );
            })}
        </div>
    </div>
);
