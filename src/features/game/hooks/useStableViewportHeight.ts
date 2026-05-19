import { useEffect, useState } from 'react';

function readViewportHeight(): number {
    return window.innerHeight;
}

/**
 * Freezes layout height for the game shell. iOS browsers change `dvh` when the
 * address bar shows or hides; we only recalculate on orientation / width changes.
 */
export function useStableViewportHeight(): number {
    const [height, setHeight] = useState(readViewportHeight);

    useEffect(() => {
        let lastWidth = window.innerWidth;

        const syncHeight = () => {
            setHeight(readViewportHeight());
            lastWidth = window.innerWidth;
        };

        const onResize = () => {
            if (window.innerWidth !== lastWidth) {
                syncHeight();
            }
        };

        window.addEventListener('orientationchange', syncHeight);
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('orientationchange', syncHeight);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return height;
}
