import { describe, it, expect } from 'vitest';
import { createEmptyBoard, isMoveLegal } from './gameLogic';

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
});