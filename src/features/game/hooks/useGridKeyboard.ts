import { useEffect, useRef, useCallback, type RefObject } from 'react';

const ARROW_STEP: Record<string, number> = {
    ArrowRight: 1,
    ArrowLeft: -1,
    ArrowDown: 3,
    ArrowUp: -3,
};

type UseGridKeyboardOptions = {
    squareRefs: RefObject<(HTMLButtonElement | null)[]>;
    onDismissOnboarding: () => void;
};

export function useGridKeyboard({ squareRefs, onDismissOnboarding }: UseGridKeyboardOptions) {
    const lastInteractionRef = useRef(4);

    const setSquareRef = useCallback(
        (index: number) => (el: HTMLButtonElement | null) => {
            squareRefs.current[index] = el;
        },
        [squareRefs],
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const buttons = squareRefs.current;

            if (/^[1-9]$/.test(e.key)) {
                const targetIndex = parseInt(e.key, 10) - 1;
                const targetButton = buttons[targetIndex];
                if (targetButton && !targetButton.disabled) {
                    e.preventDefault();
                    targetButton.focus();
                    targetButton.click();
                    lastInteractionRef.current = targetIndex;
                }
                return;
            }

            const step = ARROW_STEP[e.key];
            if (step === undefined) return;

            e.preventDefault();
            onDismissOnboarding();

            const active = document.activeElement;
            let currentIndex = buttons.findIndex((btn) => btn === active);

            if (currentIndex === -1) {
                currentIndex = lastInteractionRef.current;
            }

            let targetIndex = currentIndex;
            let nextIndex = currentIndex;

            while (step !== 0) {
                nextIndex = (nextIndex + step + 9) % 9;
                if (nextIndex === currentIndex) break;

                if (buttons[nextIndex] && !buttons[nextIndex]!.disabled) {
                    targetIndex = nextIndex;
                    break;
                }
            }

            if (buttons[targetIndex]?.disabled) {
                targetIndex = buttons.findIndex((btn) => btn && !btn.disabled);
            }

            if (targetIndex !== -1 && buttons[targetIndex]) {
                buttons[targetIndex]!.focus();
                lastInteractionRef.current = targetIndex;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [squareRefs, onDismissOnboarding]);

    const recordInteraction = useCallback((index: number) => {
        lastInteractionRef.current = index;
    }, []);

    return { setSquareRef, recordInteraction };
}
