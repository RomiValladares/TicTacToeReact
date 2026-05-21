import { forwardRef } from 'react';
import { X, Circle } from 'lucide-react';
import type { Cell } from '../../../core/gameLogic';

export type SquareProps = {
    index: number;
    value: Cell;
    isWinning: boolean;
    isXNext: boolean;
    isDisabled: boolean;
    onClick: () => void;
};

function getSquareAriaLabel(
    index: number,
    value: Cell,
    isWinning: boolean,
    isXNext: boolean,
    isDisabled: boolean,
): string {
    const position = index + 1;

    if (value === 'X') {
        return `Square ${position}, X${isWinning ? ', winning square' : ''}`;
    }
    if (value === 'O') {
        return `Square ${position}, O${isWinning ? ', winning square' : ''}`;
    }
    if (isDisabled) {
        return `Square ${position}, empty, unavailable`;
    }
    return `Square ${position}, empty, play ${isXNext ? 'X' : 'O'}`;
}

export const Square = forwardRef<HTMLButtonElement, SquareProps>(
    ({ index, value, isWinning, isXNext, isDisabled, onClick }, ref) => (
        <button
            ref={ref}
            type="button"
            onClick={onClick}
            disabled={isDisabled}
            aria-label={getSquareAriaLabel(index, value, isWinning, isXNext, isDisabled)}
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
                <X aria-hidden size={40} strokeWidth={3} className="icon-glow-primary h-[45%] w-[45%] text-(--primary)" />
            )}
            {value === 'O' && (
                <Circle aria-hidden size={34} strokeWidth={3} className="icon-glow-secondary h-[40%] w-[40%] text-(--secondary)" />
            )}

            {!value && (isXNext ? (
                <X
                    aria-hidden
                    size={40}
                    strokeWidth={3}
                    className={`h-[45%] w-[45%] text-(--text-main) opacity-0 ${isDisabled ? '' : 'group-hover:opacity-20'}`}
                />
            ) : (
                <Circle
                    aria-hidden
                    size={34}
                    strokeWidth={3}
                    className={`h-[40%] w-[40%] text-(--text-main) opacity-0 ${isDisabled ? '' : 'group-hover:opacity-20'}`}
                />
            ))}
        </button>
    ),
);

Square.displayName = 'Square';
