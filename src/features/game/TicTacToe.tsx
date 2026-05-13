import React, { useState, useEffect } from 'react';
import { 
  createEmptyBoard, 
  applyMove, 
  getWinner, 
  getBestMove, 
  PLAYERS, 
  type Board 
} from '../../core/gameLogic';

export const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  
  const winner = getWinner(board);

  // AI Turn Logic
  useEffect(() => {
    if (!isXNext && !winner) {
      setIsAiThinking(true);
      
      // Artificial delay to make the AI feel like it's "thinking"
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
    // Block clicks if: square is taken, game is over, or AI is thinking
    if (board[index] || winner || isAiThinking) return;

    setBoard(prev => applyMove(prev, index, PLAYERS.X));
    setIsXNext(false);
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setIsXNext(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Tic Tac Toe
        </h1>
        <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">
          Impossible Edition
        </p>
      </div>

      {/* The Board */}
      <div className="grid grid-cols-3 gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 shadow-2xl">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleSquareClick(i)}
            disabled={!!cell || !!winner || isAiThinking}
            className={`
              w-20 h-20 sm:w-24 sm:h-24 rounded-xl text-4xl font-bold transition-all duration-200
              flex items-center justify-center
              ${!cell && !winner ? 'hover:bg-slate-800 hover:scale-105 active:scale-95' : ''}
              ${cell === 'X' ? 'text-emerald-400 bg-slate-800/50 shadow-[0_0_20px_rgba(52,211,153,0.1)]' : 'text-cyan-400'}
              ${!cell ? 'bg-slate-900' : ''}
            `}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Game Status & Controls */}
      <div className="mt-10 flex flex-col items-center gap-6">
        <div className="text-xl font-medium">
          {winner ? (
            <span className="text-yellow-400 animate-pulse">
              {winner === 'draw' ? "It's a Draw" : `Winner: ${winner}`}
            </span>
          ) : (
            <span className={`${isXNext ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {isAiThinking ? "AI is thinking..." : `Next Move: ${isXNext ? 'X' : 'O'}`}
            </span>
          )}
        </div>

        <button
          onClick={resetGame}
          className="px-8 py-3 bg-slate-100 text-slate-950 font-bold rounded-full hover:bg-white hover:-translate-y-0.5 transition-all active:translate-y-0"
        >
          New Game
        </button>
      </div>
    </div>
  );
};