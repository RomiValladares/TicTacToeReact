import React, { useState, useEffect } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import {
    createEmptyBoard,
    applyMove,
    getWinner,
    getWinningLine,
    getBestMove,
    PLAYERS,
    type Board,
} from '../../core/gameLogic';
import { BackgroundAtmosphere } from './components/BackgroundAtmosphere';

type ThemeId = 'neon' | 'sunset' | 'classic';
type Difficulty = 'easy' | 'medium' | 'unbeatable';

const THEME_IDS: ThemeId[] = ['neon', 'sunset', 'classic'];
const DIFFICULTY_LEVELS: Difficulty[] = ['easy', 'medium', 'unbeatable'];

const THEME_SWATCH: Record<ThemeId, string> = {
    neon: '#34d399',
    sunset: '#fb923c',
    classic: '#3b82f6',
};

const surfaceMuted = 'border border-(--text-main)/10 bg-(--text-main)/5 backdrop-blur-md';

const ThemeButton = ({
    type,
    current,
    onSelect,
}: {
    type: ThemeId;
    current: ThemeId;
    onSelect: (t: ThemeId) => void;
}) => (
    <button
        type="button"
        onClick={() => onSelect(type)}
        className={`h-5 w-5 rounded-full border-2 transition-all cursor-pointer ${current === type ? 'scale-110 border-(--text-main)' : 'border-transparent opacity-40 hover:opacity-100'}`}
        style={{ backgroundColor: THEME_SWATCH[type] }}
    />
);

export const TicTacToePreview: React.FC = () => {
    const [board, setBoard] = useState<Board>(createEmptyBoard());
    const [isXNext, setIsXNext] = useState<boolean>(true);
    const [theme, setTheme] = useState<ThemeId>('neon');
    const [difficulty, setDifficulty] = useState<Difficulty>('unbeatable');
    const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
    const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

    const winner = getWinner(board);
    const winLine = getWinningLine(board);
    const isDraw = !winner && board.every((cell) => cell !== null);
    const isAiThinking = !isXNext && !winner && !isDraw;

    useEffect(() => {
        if (winner) {
            setScores((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
        } else if (isDraw) {
            setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
        }
    }, [winner, isDraw]);

    useEffect(() => {
        if (isAiThinking) {
            const timer = setTimeout(() => {
                // Future integration: pass difficulty parameter to getBestMove if logic supports it
                const aiMove = getBestMove(board, PLAYERS.O);
                if (aiMove !== null) {
                    setBoard((prev) => applyMove(prev, aiMove, PLAYERS.O));
                    setIsXNext(true);
                }
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isAiThinking, board, difficulty]);

    return (
        <div data-theme={theme} className="relative flex flex-col items-center min-h-screen bg-(--bg-main) text-(--text-main) p-6 transition-colors duration-500 font-sans overflow-hidden justify-center">
            <BackgroundAtmosphere />

            <div className="relative z-10 w-full max-w-md flex flex-col gap-5 items-center">

                {/* 1. HEADER ZONE */}
                <header className="w-full flex items-center justify-between border-b border-(--text-main)/10 pb-4">
                    <h1 className="text-xl font-black tracking-wider text-(--primary) title-glow-primary select-none">
                        TIC-TAC-TOE
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2 bg-(--text-main)/5 p-1.5 rounded-full border border-(--text-main)/10">
                            {THEME_IDS.map((t) => (
                                <ThemeButton key={t} type={t} current={theme} onSelect={setTheme} />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsSoundOn(!isSoundOn)}
                            className="p-1 text-(--text-muted) hover:text-(--primary) transition-colors cursor-pointer"
                            title={isSoundOn ? "Mute Sound" : "Unmute Sound"}
                        >
                            {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>
                    </div>
                </header>

                {/* 2. DIFFICULTY SELECTOR ZONE */}
                <div className="w-full grid grid-cols-3 p-1 bg-(--text-main)/5 rounded-xl border border-(--text-main)/10 text-center text-[10px] font-black tracking-wider uppercase">
                    {DIFFICULTY_LEVELS.map((level) => (
                        <button
                            key={level}
                            type="button"
                            onClick={() => setDifficulty(level)}
                            className={`py-2 rounded-lg transition-all cursor-pointer ${difficulty === level
                                    ? 'bg-(--btn-bg) text-(--btn-text) shadow-md scale-[1.02]'
                                    : 'text-(--text-muted) hover:text-(--text-main)'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                {/* 3. STATUS ZONE */}
                <div className="text-center h-8 flex items-center justify-center font-bold text-(--text-muted) tracking-wide text-xs uppercase">
                    {winner ? (
                        <span className="text-(--primary)">Winner: {winner}</span>
                    ) : isDraw ? (
                        <span>It's a Draw</span>
                    ) : isAiThinking ? (
                        <span className="animate-pulse">AI is thinking...</span>
                    ) : (
                        <span>Your Turn (X)</span>
                    )}
                </div>

                {/* 4. INTERACTIVE ZONE (BOARD) */}
                <main className="grid grid-cols-3 gap-3 w-full aspect-square max-w-[340px]">
                    {board.map((cell, i) => {
                        const isWinningSquare = winLine?.includes(i) ?? false;
                        return (
                            <button
                                key={i}
                                type="button"
                                disabled={!!cell || !!winner || isAiThinking}
                                onClick={() => {
                                    setBoard((prev) => applyMove(prev, i, PLAYERS.X));
                                    setIsXNext(false);
                                }}
                                className={`aspect-square rounded-2xl border transition-all flex items-center justify-center text-3xl font-black cursor-pointer
                                    ${cell ? 'bg-(--text-main)/5' : 'bg-transparent hover:bg-(--text-main)/5'}
                                    ${isWinningSquare ? 'border-(--primary) bg-(--primary)/10 text-(--primary) scale-[0.98]' : 'border-(--text-main)/10'}
                                    ${cell === 'X' && !isWinningSquare ? 'text-(--primary)' : ''}
                                    ${cell === 'O' && !isWinningSquare ? 'text-(--secondary)' : ''}
                                `}
                            >
                                {cell}
                            </button>
                        );
                    })}
                </main>

                {/* 5. DATA ZONE (SCORES) */}
                <section className={`${surfaceMuted} grid grid-cols-3 w-full rounded-2xl p-4 text-center mt-1`}>
                    <div>
                        <div className="text-[10px] text-(--text-muted) font-black tracking-wider uppercase">Player</div>
                        <div className="text-lg font-black text-(--primary)">{scores.X}</div>
                    </div>
                    <div className="border-x border-(--text-main)/10">
                        <div className="text-[10px] text-(--text-muted) font-black tracking-wider uppercase">Draws</div>
                        <div className="text-lg font-black text-(--text-main)">{scores.draws}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-(--text-muted) font-black tracking-wider uppercase">AI</div>
                        <div className="text-lg font-black text-(--secondary)">{scores.O}</div>
                    </div>
                </section>

                {/* 6. ACTION ZONE */}
                <footer className="w-full flex justify-center pt-1">
                    <button
                        type="button"
                        onClick={() => setBoard(createEmptyBoard())}
                        className="w-full sm:w-auto px-12 py-3.5 bg-(--btn-bg) text-(--btn-text) font-black tracking-wider text-xs rounded-xl transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer uppercase"
                    >
                        <RotateCcw size={14} />
                        Rematch
                    </button>
                </footer>

            </div>
        </div>
    );
};