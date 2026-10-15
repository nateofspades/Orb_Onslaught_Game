// Independent replay against every real level: no scripted hits, no altered geometry.
import assert from 'node:assert/strict';
import { Game, LEVELS, WIDTH, FLOOR, SPEEDS } from '../src/engine.js';

const report = [];
for (let level = 0; level < LEVELS.length; level++) {
  const game = new Game();
  game.start();
  game.loadLevel(level);
  game.invulnerable = 1000; // isolate arena physics from player/life interactions
  const tracks = game.balls.map(ball => ({ minX: ball.x, maxX: ball.x, minY: ball.y, maxY: ball.y }));
  let maxSpeed = 0;
  for (let frame = 0; frame < 1200; frame++) {
    game.update(1 / 120);
    assert.equal(game.state, 'playing', `Level ${level + 1} unexpectedly stopped`);
    assert.equal(game.balls.length, tracks.length, 'Balls changed without any harpoon');
    for (const [index, ball] of game.balls.entries()) {
      assert.ok([ball.x, ball.y, ball.vx, ball.vy].every(Number.isFinite), `Level ${level + 1} has non-finite motion`);
      assert.ok(Math.abs(Math.abs(ball.vx) - SPEEDS[ball.size]) < 0.01, `Level ${level + 1} violated size-dependent horizontal speed`);
      assert.ok(ball.x >= ball.r - 0.01 && ball.x <= WIDTH - ball.r + 0.01, `Level ${level + 1} escaped horizontal walls`);
      assert.ok(ball.y >= ball.r - 0.01 && ball.y <= FLOOR - ball.r + 0.01, `Level ${level + 1} escaped ceiling/floor`);
      for (const platform of game.platforms) {
        const closestX = Math.max(platform.x, Math.min(platform.x + platform.w, ball.x));
        const closestY = Math.max(platform.y, Math.min(platform.y + platform.h, ball.y));
        assert.ok(Math.hypot(ball.x - closestX, ball.y - closestY) >= ball.r - 0.01, `Level ${level + 1}, ball ${index}: persistent platform penetration`);
      }
      const track = tracks[index];
      track.minX = Math.min(track.minX, ball.x); track.maxX = Math.max(track.maxX, ball.x);
      track.minY = Math.min(track.minY, ball.y); track.maxY = Math.max(track.maxY, ball.y);
      maxSpeed = Math.max(maxSpeed, Math.hypot(ball.vx, ball.vy));
    }
  }
  for (const track of tracks) {
    assert.ok(track.maxX - track.minX > 50, `Level ${level + 1} has a horizontally trapped ball`);
    assert.ok(track.maxY - track.minY > 20, `Level ${level + 1} has a vertically trapped ball`);
  }
  report.push({ level: level + 1, name: LEVELS[level].name, simulatedSeconds: 10, physicsSteps: 1200, balls: tracks.length, maximumObservedSpeed: maxSpeed, tracks });
}
console.log(JSON.stringify({ status: 'passed', report }, null, 2));
