/**
 * Tic-Tac-Toe domain logic
 */

export const PLAYERS = {
  X: 'X',
  O: 'O'
} as const;

export type PlayerMark = (typeof PLAYERS)[keyof typeof PLAYERS];
export type Cell = PlayerMark | null;
export type Board = readonly Cell[];

export function createEmptyBoard(): Board {
    return Array(9).fill(null);
}

export function isMoveLegal(board: Board, index: number): boolean {
    return index >= 0 && index < 9 && board[index] === null;
}

// Indices of the 8 possible winning lines
const WIN_LINES: readonly (readonly number[])[] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

export type GameOutcome = PlayerMark | "draw" | null;

export function getWinner(board: Board): GameOutcome {
    // Check for a winner
    for (const [a, b, c] of WIN_LINES) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Returns "X" or "O"
        }
    }

    // Check for a draw (if no nulls -> draw)
    if (!board.includes(null)) {
        return "draw";
    }

    // Game is still ongoing
    return null;
}