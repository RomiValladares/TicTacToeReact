import { forwardRef } from 'react';
import { X, Circle } from 'lucide-react';
import type { Cell } from '../../../core/gameLogic';

export type SquareProps = {
    value: Cell;
    isWinning: boolean;
    isXNext: boolean;
    disabled: boolean;
    onClick: () => void;
};

export const Square = forwardRef<HTMLButtonElement, SquareProps>(
    ({ value, isWinning, isXNext, disabled, onClick }, ref) => (
        <button
            ref={ref}
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
    ),
);

Square.displayName = 'Square';
