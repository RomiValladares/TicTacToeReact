import { describe, it, expect } from 'vitest';
import { createEmptyBoard, isMoveLegal, getWinner, type Board } from './gameLogic';
import { getBestMove, PLAYERS } from './gameLogic';

describe('gameLogic - Core Rules', () => {
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
        ]; // Ensure all 9 spots are strings, no 'null' here!
        expect(getWinner(board)).toBe('draw');
    });

});

describe('gameLogic - AI Intelligence (Minimax)', () => {
    it('AI picks the winning move immediately', () => {
        const board: Board = [
            'X', 'X', null, // X needs to play at index 2 to win
            'O', 'O', null,
            null, null, null
        ];
        // If AI is 'X', it should definitely pick index 2
        expect(getBestMove(board, PLAYERS.X, "Impossible")).toBe(2);
    });

    it('AI blocks a human win', () => {
        const board: Board = [
            'X', 'X', null, // Human 'X' needs index 2 to win
            null, 'O', null, // AI 'O' is in the middle, no win possible
            null, null, null
        ];
        // AI 'O' has no immediate win, so it MUST pick index 2 to block 'X'
        expect(getBestMove(board, PLAYERS.O, "Impossible")).toBe(2);
    });
});