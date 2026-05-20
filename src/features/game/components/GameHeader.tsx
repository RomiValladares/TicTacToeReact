import { Volume2, VolumeX } from 'lucide-react';

import type { GameOutcome } from '../../../core/gameLogic';
import { THEME_IDS, surfaceMuted } from '../constants';
import type { ThemeId } from '../types';
import { GameStatus } from './GameStatus';
import { ThemeButton } from './ThemeButton';

type GameHeaderProps = {
    theme: ThemeId;
    onThemeChange: (theme: ThemeId) => void;
    isSoundOn: boolean;
    onSoundToggle: () => void;
    winner: GameOutcome;
    isAiThinking: boolean;
    isXNext: boolean;
};

export const GameHeader = ({
    theme,
    onThemeChange,
    isSoundOn,
    onSoundToggle,
    winner,
    isAiThinking,
    isXNext,
}: GameHeaderProps) => (
    <div className="flex w-full shrink-0 flex-col gap-1.5 md:gap-2">
        <header className="flex w-full items-center justify-between border-b border-(--text-main)/10 pb-3">
            <h1 className="bg-linear-to-br from-(--primary) to-(--secondary) bg-clip-text text-2xl font-black tracking-tighter text-transparent select-none">
                TIC TAC TOE
            </h1>
            <div className="flex items-center gap-3">
                <nav className={`${surfaceMuted} flex gap-2 rounded-full p-1`}>
                    {THEME_IDS.map((t) => (
                        <ThemeButton key={t} type={t} current={theme} onSelect={onThemeChange} />
                    ))}
                </nav>
                <button
                    type="button"
                    onClick={onSoundToggle}
                    className="cursor-pointer p-1 text-(--text-muted) transition-colors hover:text-(--primary)"
                    title={isSoundOn ? 'Mute Sound' : 'Unmute Sound'}
                >
                    {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
            </div>
        </header>

        <GameStatus winner={winner} isAiThinking={isAiThinking} isXNext={isXNext} />
    </div>
);
