export const safeStorage = {
    getItem: (key: string, fallback: string): string => {
        try {
            return localStorage.getItem(key) || fallback;
        } catch {
            return fallback;
        }
    },
    setItem: (key: string, value: string): void => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn(`Storage write blocked for key "${key}":`, e);
        }
    },
};
