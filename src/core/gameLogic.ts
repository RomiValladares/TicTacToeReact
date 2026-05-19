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

export function getGameState(board: Board): {
    winner: GameOutcome;
    winLine: readonly number[] | null;
} {
    const winLine = getWinningLine(board);
    if (winLine) {
        return { winner: board[winLine[0]], winLine };
    }
    if (board.every((cell) => cell !== null)) {
        return { winner: "draw", winLine: null };
    }
    return { winner: null, winLine: null };
}

export function getWinner(board: Board): GameOutcome {
    return getGameState(board).winner;
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
    for (let i = 0; i < 9; i++) {
        if (board[i] === null && getWinner(applyMove(board, i, aiMark)) === aiMark) {
            return i;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (board[i] === null && getWinner(applyMove(board, i, humanMark)) === humanMark) {
            return i;
        }
    }
    let bestScore = -Infinity;
    let move: number | null = null;
    for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
            const nextBoard = applyMove(board, i, aiMark);
            const score = minimax(nextBoard, 0, false, aiMark, humanMark);
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}
