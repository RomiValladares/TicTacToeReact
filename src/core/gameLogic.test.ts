import { describe, it, expect } from 'vitest';
import { createEmptyBoard, isMoveLegal, getWinner, type Board } from './gameLogic';

describe('gameLogic', () => {
    it('creates an empty board of 9 null cells', () => {
        const board = createEmptyBoard();
        expect(board).toHaveLength(9);
        expect(board.every(cell => cell === null)).toBe(true);
    });

    it('validates legal and illegal moves', () => {
        const board = createEmptyBoard();
        expect(isMoveLegal(board, 0)).toBe(true);
        expect(isMoveLegal(board, 10)).toBe(false);
    });

    it('identifies a horizontal win for X', () => {
        const board: Board = [
            'X', 'X', 'X',
            null, 'O', null,
            null, null, 'O'
        ];
        expect(getWinner(board)).toBe('X');
    });

    it('identifies a draw', () => {
        const board: Board = [
            'X', 'O', 'X',
            'X', 'O', 'O',
            'O', 'X', 'X'
        ];
        expect(getWinner(board)).toBe('draw');
    });
});
