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

export type DifficultyLevel = 'Easy' | 'Medium' | 'Impossible';

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
        // check that the first cell isn't empty, 
        // and that it matches the other two cells.
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
    // if line found, return the mark at that position ('X' or 'O')
    if (line) {
        return board[line[0]];
    }
    // Check for a draw (if no nulls -> draw)
    if (board.every(cell => cell !== null)) {
        return "draw";
    }
    // Game is still ongoing
    return null;
}

/**
 * Creates a NEW board with the new move applied.
 */
export function applyMove(board: Board, index: number, mark: PlayerMark): Board {
    const newBoard = [...board];
    newBoard[index] = mark;
    return newBoard;
}

const SCORES = {
    WIN: 10,
    LOSS: -10,
    DRAW: 0
} as const;

function minimax(
    board: Board,
    depth: number,
    isMaximizing: boolean,
    aiMark: PlayerMark,
    humanMark: PlayerMark
): number {
    const result = getWinner(board);

    if (result === aiMark) return SCORES.WIN - depth; // Subtract depth to prefer faster wins
    if (result === humanMark) return SCORES.LOSS + depth; // Add depth to delay losses
    if (result === "draw") return SCORES.DRAW;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                // Imagine playing here
                const nextBoard = applyMove(board, i, aiMark);
                const score = minimax(nextBoard, depth + 1, false, aiMark, humanMark);
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                const nextBoard = applyMove(board, i, humanMark);
                const score = minimax(nextBoard, depth + 1, true, aiMark, humanMark);
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

/**
 * called from UI
 */
export function getBestMove(board: Board, aiMark: PlayerMark, difficulty: DifficultyLevel): number | null {
    const emptyIndices = board
        .map((cell, index) => (cell === null ? index : null))
        .filter((index) => index !== null) as number[];

    // No moves left
    if (emptyIndices.length === 0) return null;

    if (difficulty === "Easy") {
        // just picks a random empty square
        const randomIndex = Math.floor(Math.random() * emptyIndices.length);
        return emptyIndices[randomIndex];
    }

    if (difficulty === "Medium") {
        // 30% chance to be lazy
        if (Math.random() < 0.3) {
            const randomIndex = Math.floor(Math.random() * emptyIndices.length);
            return emptyIndices[randomIndex];
        }
    }

    const humanMark: PlayerMark = aiMark === PLAYERS.X ? PLAYERS.O : PLAYERS.X;
    let bestScore = -Infinity;
    let move: number | null = null;

    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            const nextBoard = applyMove(board, i, aiMark);
            const score = minimax(nextBoard, 0, false, aiMark, humanMark);

            // Check if this specific cell intercepts an immediate human victory configuration
            const blocksImmediateHumanWin = getWinner(applyMove(board, i, humanMark)) === humanMark;

            // Update selection if a higher matrix score is found, OR if scores are tied 
            // but this move performs a critical defensive block.
            if (score > bestScore || (score === bestScore && blocksImmediateHumanWin && move === 0)) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}