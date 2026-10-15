# Independent review TDD evidence

## RED — corner-impact speed hierarchy

Command: `npm test -- tests/unit/physics-review.test.js`

Actual result: exit 1; 1 test failed in 1 file (Vitest 5.0.4).

The test `preserves the faster-smaller horizontal speed hierarchy after energetic corner impacts` failed at `expect(Math.abs(ball.vx)).toBeCloseTo(SPEEDS[size])`:

    AssertionError: expected 439.9999999999999 to be close to 110,
    received difference is 329.9999999999999, but expected 0.005

This exposed a genuine gameplay defect: platform corner reflection could convert a large ball's vertical speed into horizontal speed greater than the specified smaller-ball horizontal speeds. The regression was written and observed failing before the production correction.

The independent replay command `node scripts/audit-physics.mjs` already passed 1,200 physics steps in each of all five actual arenas before this regression was added, checking finite coordinates, walls/floor/ceiling, absence of persistent platform penetration, and horizontal/vertical motion. It did not assert speed hierarchy; the new focused test closes that gap.

## GREEN — corner-impact speed hierarchy

After the observed failure, `resolvePlatform` was changed to restore the ball size's nominal horizontal speed after a platform impact while preserving its reflected direction. This also retains the anti-zero-horizontal-speed recovery.

Actual verification:

- `npm test -- tests/unit/physics-review.test.js`: exit 0, 1 test passed in 1 file.
- `npm test`: exit 0, 13 tests passed in 2 files at this stage.
- `node scripts/audit-physics.mjs`: exit 0, all five real levels passed another 1,200-step replay each.

No production correction preceded the regression's observed RED run.
