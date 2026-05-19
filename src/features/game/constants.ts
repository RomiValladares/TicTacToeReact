import type { Difficulty, ThemeId } from './types';

export const THEME_IDS: ThemeId[] = ['neon', 'sunset', 'classic'];

export const THEME_SWATCH: Record<ThemeId, string> = {
    neon: '#34d399',
    sunset: '#fb923c',
    classic: '#3b82f6',
};

export const DIFFICULTY_LEVELS: Difficulty[] = ['easy', 'medium', 'unbeatable'];

/** Shared frosted panels (nav / board / score strip). */
export const surfaceMuted =
    'border border-(--text-main)/10 bg-(--text-main)/5 backdrop-blur-md';
