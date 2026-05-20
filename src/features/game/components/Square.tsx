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
            group relative z-10 flex w-full aspect-square items-center justify-center rounded-3xl border-2 bg-(--text-main)/5 transition-colors duration-300
            ring-4 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-(--primary) focus-visible:ring-offset-4 focus-visible:ring-offset-(--bg-main)
            cursor-pointer disabled:cursor-not-allowed
            ${isWinning
                    ? 'border-(--primary)/50 bg-(--primary)/10 ring-(--primary)/50'
                    : 'border-(--text-main)/10 ring-transparent hover:bg-(--text-main)/15'}
        `}
        >
            {value === 'X' && (
                <X size={40} strokeWidth={3} className="icon-glow-primary h-[45%] w-[45%] text-(--primary)" />
            )}
            {value === 'O' && (
                <Circle size={34} strokeWidth={3} className="icon-glow-secondary h-[40%] w-[40%] text-(--secondary)" />
            )}

            {!value && (isXNext ? (
                <X
                    size={40}
                    strokeWidth={3}
                    className={`h-[45%] w-[45%] text-(--text-main) ${disabled ? 'opacity-0' : 'opacity-0 group-hover:opacity-20'}`}
                />
            ) : (
                <Circle
                    size={34}
                    strokeWidth={3}
                    className={`h-[40%] w-[40%] text-(--text-main) ${disabled ? 'opacity-0' : 'opacity-0 group-hover:opacity-20'}`}
                />
            ))}
        </button>
    ),
);

Square.displayName = 'Square';
