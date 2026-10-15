# Pang

**[Play Pang · Aurora Expedition](https://nateofspades.github.io/pang_game/)**

An original Canvas arcade expedition. Split bouncing spheres with upward harpoons, dodge the fragments, and clear five aurora-lit sectors.

## Play

- Move: A / D or ← / →. Fire: hold Space.
- P / Esc: pause or resume. R: restart the expedition.
- Three lives; each sector has its own timer. Small spheres move faster.
- Platforms block harpoons. Clear every sphere to continue.

## Develop

Node.js 22.22+; no runtime packages or build step.

```sh
npm ci
npx playwright install chromium
npm run dev
npm test
npm run test:e2e
```

Open http://127.0.0.1:4173. Static HTML, CSS and vanilla JavaScript; Canvas 2D art. Vitest and Playwright are the only direct development dependencies.

## Verification

Sequential test-first evidence is in [docs/tdd-log.md](docs/tdd-log.md). Independent corner-speed regression evidence: [docs/tdd-review.md](docs/tdd-review.md). The DOM-independent engine is exported for deterministic browser fixtures; there is no cheat UI.

Future changes must run relevant Vitest **and** Playwright suites, commit meaningful changes with the repository-local Nathan Burns author, push main, verify the exact remote commit and live Pages bytes. No empty commits.

AGENTS.md creation was blocked by approval enforcement in this environment; no bypass was attempted.
