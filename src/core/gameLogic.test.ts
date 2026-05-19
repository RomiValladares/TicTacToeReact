import { describe, it, expect } from 'vitest';
import {
    createEmptyBoard,
    isMoveLegal,
    getWinner,
    getGameState,
    getBestMove,
    PLAYERS,
    type Board,
} from './gameLogic';

describe('createEmptyBoard', () => {
    it('returns 9 null cells', () => {
        const board = createEmptyBoard();
        expect(board).toHaveLength(9);
        expect(board.every(cell => cell === null)).toBe(true);
    });
});

describe('isMoveLegal', () => {
    it('allows empty in-bounds cells and rejects out of bounds', () => {
        const board = createEmptyBoard();
        expect(isMoveLegal(board, 0)).toBe(true);
        expect(isMoveLegal(board, 10)).toBe(false);
    });
});

describe('getGameState', () => {
    it('returns winner and winLine in one pass', () => {
        const board: Board = ['X', 'X', 'X', null, 'O', null, null, null, 'O'];
        const { winner, winLine } = getGameState(board);
        expect(winner).toBe('X');
        expect(winLine).toEqual([0, 1, 2]);
    });
});

describe('getWinner', () => {
    it.each([
        ['horizontal X', ['X', 'X', 'X', null, 'O', null, null, null, 'O'] as Board, 'X'],
        ['vertical O', ['O', 'O', 'X', 'O', 'X', 'X', 'O', 'X', 'X'] as Board, 'O'],
        ['diagonal X', ['X', 'O', null, 'O', 'X', null, null, null, 'X'] as Board, 'X'],
    ])('detects %s win', (_, board, winner) => {
        expect(getWinner(board)).toBe(winner);
    });
    
    it('returns draw when the board is full with no winner', () => {
        const board: Board = [
            'X', 'O', 'X',
            'X', 'O', 'O',
            'O', 'X', 'X',
        ];
        expect(getWinner(board)).toBe('draw');
    });
});

describe('getBestMove (Impossible)', () => {
    it('completes its own win', () => {
        const board: Board = [
            'X', 'X', null,
            'O', 'O', null,
            null, null, null,
        ];
        expect(getBestMove(board, PLAYERS.X, 'Impossible')).toBe(2);
    });

    it('blocks opponent win', () => {
        const board: Board = [
            'X', 'X', null,
            'O', null, null,
            null, null, null,
        ];
        expect(getBestMove(board, PLAYERS.O, 'Impossible')).toBe(2);
    });

    it('wins immediately when a win is available', () => {
        const board: Board = [
            'X', 'X', null,
            'O', 'O', null,
            null, null, null,
        ];
        expect(getBestMove(board, PLAYERS.O, 'Impossible')).toBe(5);
    });

    it('blocks fork when multiple defensive moves are optimal', () => {
        const board: Board = [
            null, null, 'O',
            null, 'X', 'X',
            null, 'X', 'O',
        ];
        const aiMove = getBestMove(board, PLAYERS.O, 'Impossible');
        expect([1, 3]).toContain(aiMove);
    });

    it('takes an immediate win over a block', () => {
        const board: Board = [
            'O', 'O', null,
            null, 'X', null,
            'X', 'X', null,
        ];
        expect(getBestMove(board, PLAYERS.O, 'Impossible')).toBe(2);
    });
});