import { expect, it } from 'vitest';
import { Game, LEVELS, WIDTH, FLOOR, makeBall, resolvePlatform, SPEEDS } from '../../src/engine.js';

it('preserves the faster-smaller horizontal speed hierarchy after energetic corner impacts', () => {
  const platform = { x: 100, y: 100, w: 100, h: 20 };
  for (const size of [2, 1, 0]) {
    const ball = makeBall(94, 94, size);
    ball.vy = 440;
    resolvePlatform(ball, platform);
    expect(ball.vx).toBeLessThan(0);
    expect(Math.abs(ball.vx)).toBeCloseTo(SPEEDS[size]);
  }
});

it.each(LEVELS.flatMap((_, level) => [0, 1, 2].map(size => ({ level, size }))))(
  'keeps size $size moving without penetration in actual arena $level',
  ({ level, size }) => {
    const game = new Game();
    game.start();
    game.loadLevel(level);
    game.invulnerable = 1000;
    game.balls = LEVELS[level].spawns.map(([x, y], index) => makeBall(x, y, size, index % 2 ? -1 : 1));
    const tracks = game.balls.map(ball => ({ minX: ball.x, maxX: ball.x, minY: ball.y, maxY: ball.y }));
    for (let frame = 0; frame < 600; frame++) {
      game.update(1 / 120);
      for (const [index, ball] of game.balls.entries()) {
        expect([ball.x, ball.y, ball.vx, ball.vy].every(Number.isFinite)).toBe(true);
        expect(ball.x).toBeGreaterThanOrEqual(ball.r - 0.01);
        expect(ball.x).toBeLessThanOrEqual(WIDTH - ball.r + 0.01);
        expect(ball.y).toBeGreaterThanOrEqual(ball.r - 0.01);
        expect(ball.y).toBeLessThanOrEqual(FLOOR - ball.r + 0.01);
        expect(Math.abs(ball.vx)).toBeCloseTo(SPEEDS[size]);
        for (const p of game.platforms) {
          const dx = ball.x - Math.max(p.x, Math.min(p.x + p.w, ball.x));
          const dy = ball.y - Math.max(p.y, Math.min(p.y + p.h, ball.y));
          expect(Math.hypot(dx, dy)).toBeGreaterThanOrEqual(ball.r - 0.01);
        }
        const track = tracks[index];
        track.minX = Math.min(track.minX, ball.x); track.maxX = Math.max(track.maxX, ball.x);
        track.minY = Math.min(track.minY, ball.y); track.maxY = Math.max(track.maxY, ball.y);
      }
    }
    expect(game.state).toBe('playing');
    expect(game.lives).toBe(3);
    for (const track of tracks) {
      expect(track.maxX - track.minX).toBeGreaterThan(30);
      expect(track.maxY - track.minY).toBeGreaterThan(15);
    }
  },
);
