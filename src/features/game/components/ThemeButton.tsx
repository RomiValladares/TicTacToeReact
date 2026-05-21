import type { ThemeId } from '../types';
import { THEME_SWATCH } from '../constants';

type ThemeButtonProps = {
    type: ThemeId;
    current: ThemeId;
    onSelect: (t: ThemeId) => void;
};

const THEME_LABEL: Record<ThemeId, string> = {
    neon: 'Neon',
    sunset: 'Sunset',
    classic: 'Classic',
};

export const ThemeButton = ({ type, current, onSelect }: ThemeButtonProps) => {
    const isSelected = current === type;

    return (
        <button
            type="button"
            onClick={() => onSelect(type)}
            aria-label={`${THEME_LABEL[type]} theme${isSelected ? ', selected' : ''}`}
            aria-pressed={isSelected}
            className={`h-5 w-5 rounded-full border-2 transition-all cursor-pointer ${isSelected ? 'scale-110 border-(--text-main)' : 'border-transparent opacity-40 hover:opacity-100'}`}
            style={{ backgroundColor: THEME_SWATCH[type] }}
        />
    );
};
