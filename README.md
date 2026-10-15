# Pang: Aurora Expedition

**Live game:** https://nateofspades.github.io/pang_game/

![Pang active gameplay on desktop](assets/screenshots/gameplay.png)

A fast Canvas arcade expedition: split bouncing spheres with upward harpoons, dodge the fragments, and clear five aurora-lit sectors before time expires.

## Features

- Five increasingly difficult sectors with platforms, timers, particles, scoring, three lives, and temporary invulnerability.
- Large spheres split into faster medium and small spheres; the smallest disappear.
- Responsive high-DPI Canvas that always preserves the complete 840:450 arena without cropping or distortion.
- Persistent local high score and music preference.
- Start, pause/resume, restart, game-over, level-clear, and victory states without resetting the music transport.
- Large touch controls with independent pointer tracking for simultaneous movement and firing.

## Controls

Clear every sphere before the timer expires. Avoid touching spheres; a hit costs one life and briefly grants invulnerability. Platforms stop harpoons and redirect spheres.

### Desktop keyboard

- Move: **A / D** or **← / →**
- Fire: hold **Space**
- Pause/resume: **P** or **Esc**
- Restart: **R** or the restart button

### Mobile and touch

- Hold the large **←** or **→** thumb target with one finger.
- Hold **FIRE** with another finger to move and shoot at the same time.
- Pause and restart use the two smaller center buttons in portrait.
- In short landscape, movement remains on the left, FIRE on the right, and music/help remain centered and reachable.

Touch actions are captured by the controls to prevent page scrolling while playing. Orientation changes preserve the current game and music state.

## Music

**Polar Circuit** is an original fast-paced retro-arcade instrumental composed programmatically for this project. Its 64-step melody, bass line, pulse percussion, and arrangement are generated in `src/music.js` using Web Audio oscillators; it contains no samples, recordings, third-party music, or adapted melodies.

Music begins only after a browser interaction. **Music on/off** changes gain without rebuilding or rewinding the transport, and the preference is saved in localStorage. The single music engine continues across menus, pause, restart, game over, sector changes, resize, and orientation changes; background visibility interruptions suspend and resume the same transport. Gameplay intentionally has no scoring, collision, clear, or button sound effects.

See [music provenance](docs/music-provenance.md) for the authorship and licensing record.

## Local setup

Requires Node.js 22.22 or newer. There are no runtime packages or build step.

```sh
npm ci
npx playwright install chromium
npm run dev
```

Open http://127.0.0.1:4173.

## Tests

```sh
npm test
npm run test:e2e
npm run test:all
```

Vitest covers game rules, physics, persistence, the music transport/composition helpers, and responsive layout calculations. Playwright uses one browser worker and covers keyboard controls, real two-finger touch, music lifecycle and preference, visibility interruption, denied storage/audio, game states, console/network failures, DPR rendering, overflow, target sizing, and these required viewports:

- 1920×1080 desktop
- 1366×768 laptop
- 768×1024 tablet portrait
- 390×844 mobile portrait
- 320×568 small mobile portrait
- 844×390 mobile landscape

GitHub Actions runs both Vitest and Playwright for pushes to `main` and pull requests.

## Technology

HTML5, CSS, vanilla ES modules, Canvas 2D, Web Audio, localStorage, Vitest, Playwright, and GitHub Actions/Pages.

## Verification

Sequential test-first evidence from the original game foundation is in [docs/tdd-log.md](docs/tdd-log.md). Independent corner-speed regression evidence is in [docs/tdd-review.md](docs/tdd-review.md). The DOM-independent engine remains exported for deterministic fixtures; there is no cheat UI.

Future changes follow [AGENTS.md](AGENTS.md). No empty commits or rewritten history.
