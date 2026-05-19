import type { ThemeId } from '../types';
import { THEME_SWATCH } from '../constants';

type ThemeButtonProps = {
    type: ThemeId;
    current: ThemeId;
    onSelect: (t: ThemeId) => void;
};

export const ThemeButton = ({ type, current, onSelect }: ThemeButtonProps) => (
    <button
        type="button"
        onClick={() => onSelect(type)}
        className={`h-5 w-5 rounded-full border-2 transition-all cursor-pointer ${current === type ? 'scale-110 border-(--text-main)' : 'border-transparent opacity-40 hover:opacity-100'}`}
        style={{ backgroundColor: THEME_SWATCH[type] }}
    />
);
