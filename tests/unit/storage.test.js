import { expect, it } from 'vitest';
import * as S from '../../src/storage.js';

const storage = initial => {
  const values = new Map(Object.entries(initial || {}));
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
};

it('loads a saved nonnegative integer high score', () => {
  expect(S.readHighScore(storage({ 'pang.highScore': '1200' }))).toBe(1200);
});

it('ignores malformed, negative, fractional, infinite and unsafe saved scores', () => {
  for (const value of ['nope', '-1', '3.5', 'Infinity', '9007199254740992', '']) {
    expect(S.readHighScore(storage({ 'pang.highScore': value }))).toBe(0);
  }
  expect(S.readHighScore(storage())).toBe(0);
});

it('falls back to zero when browser storage is unavailable or throws', () => {
  expect(S.readHighScore(undefined)).toBe(0);
  expect(S.readHighScore({ getItem() { throw new Error('Storage denied'); } })).toBe(0);
});

it('persists only safe nonnegative integer high scores', () => {
  const target = storage();
  expect(S.writeHighScore(target, 2400)).toBe(true);
  expect(S.readHighScore(target)).toBe(2400);
  expect(S.writeHighScore(target, -1)).toBe(false);
  expect(S.writeHighScore(undefined, 100)).toBe(false);
});
