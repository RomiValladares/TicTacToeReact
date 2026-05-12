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

/**
 * Returns the indices of the winning line [a, b, c] or null.
 * We'll use this later to highlight the winning squares in the UI.
 */
export function getWinningLine(board: Board): readonly number[] | null {
    for (const [a, b, c] of WIN_LINES) {
        if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
            return [a, b, c];
        }
    }
    return null;
}

// Updated getWinner to be more robust
export function getWinner(board: Board): GameOutcome {
    // Check for a winner
    const line = getWinningLine(board);
    if (line) return board[line[0]];
    // Check for a draw (if no nulls -> draw)
    if (board.every(cell => cell !== null)) {
        return "draw";
    }
    // Game is still ongoing
    return null;
}
///

/**
 * Creates a NEW board with the new move applied.
 */
export function applyMove(board: Board, index: number, mark: PlayerMark): Board {
    const newBoard = [...board];
    newBoard[index] = mark;
    return newBoard;
}


