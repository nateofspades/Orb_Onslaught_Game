# Orb Onslaught

[Play Orb Onslaught](https://nateofspades.github.io/Orb_Onslaught_Game/)

Split orbit-marked spheres beneath the aurora. Guide a parka-clad polar explorer through five timed sectors with three lives, upward ring pulses and platform-blocked shots. This is the existing game's history-preserving, owner-authorized final release identity, superseding the historical private preparation hold.

![Orb Onslaught active gameplay](assets/screenshots/gameplay.png)

## Retained original design and focused changes

The custom parka/visor explorer, aurora ribbons, snowy mountains/pines, frozen observation base, orbit-marked spheres, particle palette and all five source-defined platform layouts are retained. The existing screenshot and Canvas source were inspected before choosing a narrow visual change: the pointed upward harpoon head becomes a circular light pulse with a travelling dashed tether. This changes drawing only; the shot still follows the exact existing collision line, speed, cooldown and platform blocking rules. No new art/audio dependency or mechanics system was introduced.

The five sectors are First light (open field), The crossing (central ledge), Twin peaks (offset ledges), Skyline (three staggered ledges) and Aurora (elevated center). Large spheres split into medium spheres, then small ones; small spheres disappear. Hits award 100/200/300 points by size. Avoid collisions and clear each sector before its timer expires; losing a life resets its timer. Three lives, invulnerability, sector-clear, victory and restart behavior are retained. Engine, music, layout, storage and stylesheet remain unchanged from baseline `2e00cd379887a1f180d459b5724a3a97e8d50551`.

## Controls and continuity

- A/D or left/right arrows move; hold Space or FIRE to emit upward pulses.
- Touch: hold a direction and FIRE together with separate fingers.
- P / Esc or the pause control pauses/resumes; R or restart starts a fresh run.
- Music on/off restores or mutes the same transport. Explicit gameplay pause suspends audio; resume continues the same context/position. Restart, menus, sector changes and resizing do not replace the transport.
- Start expedition begins play; Next sector advances after clearing; Try again / Play again resets after defeat / victory. The ? button opens instructions and pauses an active expedition.
- Music begins after a keyboard, pointer or touch gesture. The on/off preference persists. There is no volume slider or gameplay SFX; system/browser output controls set listening volume.

Legacy `pang.highScore` and `pang.music` keys are intentionally preserved, not used as new branding. Existing data survives same-origin reloads. A different deployment origin does not automatically inherit localStorage; cross-origin transfer needs a separate consented, tested design.

## Music and chain of title

“Polar Circuit” and its playback implementation are unchanged. The existing [music provenance](docs/music-provenance.md) records the author's original-composition/repository-owned assertions; they are not independent musicological or ownership clearance. That document explicitly asserts no separate open-source license. No general code/art repository license was found. This is a chain-of-title/documentation gap to resolve with the requesting owner, **not** a finding that the requester lacks rights in their own work. No license has been invented or added.

## Technologies and local development

HTML Canvas 2D, CSS, native ES modules, Web Audio and guarded localStorage power the static game. Node's HTTP server is development-only; Vitest and Playwright are development dependencies. There is no production build step or runtime package/CDN. Use Node.js 22.22 or newer.

```sh
npm ci
PORT=4193 npm run dev
npm test -- --maxWorkers=1
npm run test:e2e -- --workers=1
npm run test:all
```

Private Playwright uses `http://127.0.0.1:4193`, explicit `PORT=4193`, one worker and **no server reuse**. The original server on 4173 must remain untouched. Existing manual browser contexts explicitly receive baseURL and tests navigate relative to it; an added test reads the exact served renderer back and compares it with this worktree's file, preventing false verification of an old checkout. All preparation test/server/browser execution must hold `/root/arcade-migration-audit/preparation/test.lock` with `flock`.

Existing coverage includes real simultaneous two-finger touch, keyboard/fire/restart, Web Audio gain and lifecycle, preference persistence, denied storage/audio, DPR/layout and nine sizes. Added preparation coverage checks neutral presentation, actual pulse drawing/render purity, isolated server configuration, legacy records, six orientation/state cases and captures of all five sectors. Required viewports: 1920×1080, 1366×768, 768×1024, 390×844, 320×568 and 844×390. Screenshots use the real application/renderer with a paused browser clock and explicitly seeded level/player data, not fabricated images.

## Release verification and rights

Final release execution evidence is retained outside the repository in `/root/arcade-final-migration/orbonslaughtgame/`: RED/GREEN identity logs, full unit/browser logs, final screenshots, review, remote/CI/Pages readbacks and result/report. The initial release run passed 64 unit tests and 39 browser tests with no skips. Six viewport captures and all five sectors were actually inspected. The README image is an actual application capture with deterministic test-clock gameplay, not an illustration. Final exact counts and SHA belong to the external result, not historical logs.

Coverage includes keyboard and simultaneous touch, score/lives/collisions/progression, game-over/victory, pause/restart/help, storage denials and legacy same-origin path continuity. Real native AudioContext tests measure signal, clock advancement/freeze, gain and one context/timer through mute, pause, restart and rotation. Mocked lifecycle tests remain separately useful. Emulated Chromium desktop/mobile is not a physical-device or other-browser guarantee; physical-speaker loudness and commercial music-corpus comparison remain unverified. Seeded transition tests are not a complete human-played campaign.

No general open-source code/art license is granted by this repository. Existing authorship/provenance notices are preserved; public availability alone is not permission to reuse the work. See [IP audit](docs/IP_AUDIT.md), [dependency inventory](docs/source-phase-inventory.md) and [music provenance](docs/music-provenance.md). The audit rates the inspected expression Low apparent concern with explicit provenance/comparison uncertainties, not legal clearance. Seek qualified legal advice before commercial reliance. Historical preparation notes remain historical; the owner's final release authorization supersedes their publication hold and candidate-name plans.
