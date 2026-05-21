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
            const nextHeight = readViewportHeight();
            setHeight(nextHeight);
            document.documentElement.style.setProperty('--stable-vh', `${nextHeight}px`);
            lastWidth = window.innerWidth;
        };

        syncHeight();

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
            document.documentElement.style.removeProperty('--stable-vh');
        };
    }, []);

    return height;
}
