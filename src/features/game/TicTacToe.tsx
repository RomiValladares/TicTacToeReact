import React, { useState, useEffect } from 'react';
import {
    createEmptyBoard,
    applyMove,
    getWinner,
    getBestMove,
    PLAYERS,
    type Board
} from '../../core/gameLogic';

import { X, Circle, RotateCcw } from 'lucide-react';

export const TicTacToe: React.FC = () => {
  const [theme, setTheme] = useState<'neon' | 'sunset' | 'classic'>('neon');
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  const winner = getWinner(board);

  useEffect(() => {
    if (!isXNext && !winner) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const aiMove = getBestMove(board, PLAYERS.O, "Impossible");
        if (aiMove !== null) {
          setBoard(prev => applyMove(prev, aiMove, PLAYERS.O));
          setIsXNext(true);
        }
        setIsAiThinking(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isXNext, board, winner]);

  const handleSquareClick = (index: number) => {
    if (board[index] || winner || isAiThinking) return;
    setBoard(prev => applyMove(prev, index, PLAYERS.X));
    setIsXNext(false);
  };

  return (
    <div data-theme={theme} className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-main)] text-slate-100 p-4 transition-colors duration-500">
      
      {/* Theme Switcher UI */}
      <div className="flex gap-4 mb-12 bg-slate-900/40 p-2 rounded-full border border-slate-800">
        {(['neon', 'sunset', 'classic'] as const).map((t) => (
          <button 
            key={t}
            onClick={() => setTheme(t)}
            className={`w-6 h-6 rounded-full border-2 transition-transform ${theme === t ? 'scale-125 border-white' : 'border-transparent opacity-50'}`}
            style={{ backgroundColor: t === 'neon' ? '#34d399' : t === 'sunset' ? '#fb923c' : '#3b82f6' }}
          />
        ))}
      </div>

      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent mb-2">
          Tic Tac Toe
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
          {theme} Edition
        </p>
      </div>

      {/* Board with Ghost Hovers */}
      <div className="grid grid-cols-3 gap-4 bg-slate-900/30 p-4 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleSquareClick(i)}
            disabled={!!cell || !!winner || isAiThinking}
            // "group" class enables the ghost hover effect
            className="group relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-center transition-all duration-200 hover:bg-slate-800/50 hover:scale-105 active:scale-95 disabled:hover:scale-100"
          >
            {/* The Marks (Icons instead of Text) */}
            {cell === 'X' && <X size={48} strokeWidth={3} className="text-[var(--primary)] drop-shadow-[0_0_8px_var(--primary)]" />}
            {cell === 'O' && <Circle size={40} strokeWidth={3} className="text-[var(--secondary)] drop-shadow-[0_0_8px_var(--secondary)]" />}

            {/* THE GHOST: Only visible on hover if cell is empty */}
            {!cell && !winner && !isAiThinking && (
              <div className="opacity-0 group-hover:opacity-20 transition-opacity duration-200">
                {isXNext ? <X size={48} strokeWidth={3} className="text-[var(--primary)]" /> : <Circle size={40} strokeWidth={3} className="text-[var(--secondary)]" />}
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center gap-8">
        <div className="text-xl font-bold tracking-tight">
          {winner ? (
            <span className="text-yellow-400">
              {winner === 'draw' ? "IT'S A DRAW" : `${winner} WINS`}
            </span>
          ) : (
            <span className="opacity-80">
              {isAiThinking ? "AI IS ANALYZING..." : `PLAYER ${isXNext ? 'X' : 'O'} TURN`}
            </span>
          )}
        </div>

        <button
          onClick={() => setBoard(createEmptyBoard())}
          className="group flex items-center gap-2 px-10 py-4 bg-slate-100 text-slate-950 font-black rounded-2xl hover:bg-white hover:-translate-y-1 transition-all"
        >
          <RotateCcw size={20} className="group-hover:rotate-[-45deg] transition-transform" />
          NEW GAME
        </button>
      </div>
    </div>
  );
};