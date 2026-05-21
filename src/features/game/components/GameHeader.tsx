import { Volume2, VolumeX } from 'lucide-react';

import { THEME_IDS, surfaceMuted } from '../constants';
import type { ThemeId } from '../types';
import { ThemeButton } from './ThemeButton';

type GameHeaderProps = {
    theme: ThemeId;
    onThemeChange: (theme: ThemeId) => void;
    isSoundOn: boolean;
    onSoundToggle: () => void;
};

export const GameHeader = ({
    theme,
    onThemeChange,
    isSoundOn,
    onSoundToggle,
}: GameHeaderProps) => (
    <header className="flex w-full shrink-0 items-center justify-between border-b border-(--text-main)/10 pb-3">
        <h1 className="bg-linear-to-br from-(--primary) to-(--secondary) bg-clip-text text-2xl font-black tracking-tighter text-transparent select-none">
            TIC TAC TOE
        </h1>
        <div className="flex items-center gap-3">
            <nav aria-label="Theme" className={`${surfaceMuted} flex gap-2 rounded-full p-1`}>
                {THEME_IDS.map((t) => (
                    <ThemeButton key={t} type={t} current={theme} onSelect={onThemeChange} />
                ))}
            </nav>
            <button
                type="button"
                onClick={onSoundToggle}
                aria-label={isSoundOn ? 'Mute sound' : 'Unmute sound'}
                className="cursor-pointer p-1 text-(--text-muted) transition-colors hover:text-(--primary)"
            >
                {isSoundOn ? <Volume2 aria-hidden size={18} /> : <VolumeX aria-hidden size={18} />}
            </button>
        </div>
    </header>
);
