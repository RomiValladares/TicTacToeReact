/**
 * Tic-Tac-Toe domain logic
 */

export type PlayerMark = "X" | "O";
export type Cell = PlayerMark | null;
export type Board = readonly Cell[];

export function createEmptyBoard(): Board {
  return Array(9).fill(null);
}

export function isMoveLegal(board: Board, index: number): boolean {
  return index >= 0 && index < 9 && board[index] === null;
}