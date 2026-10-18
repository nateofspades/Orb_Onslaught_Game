# Aurora Field Study — private preparation

This is the existing game, edited in place on a private local preparation branch, not recreated. “Aurora Field Study” / “FIELD” are neutral internal working labels, not a cleared or published brand. No new public deployment, repository rename or push is authorized by this checkout.

![Private local gameplay](assets/screenshots/gameplay.png)

## Retained original design and focused changes

The custom parka/visor explorer, aurora ribbons, snowy mountains/pines, frozen observation base, orbit-marked spheres, particle palette and all five source-defined platform layouts are retained. The existing screenshot and Canvas source were inspected before choosing a narrow visual change: the pointed upward harpoon head becomes a circular light pulse with a travelling dashed tether. This changes drawing only; the shot still follows the exact existing collision line, speed, cooldown and platform blocking rules. No new art/audio dependency or mechanics system was introduced.

The five retained sectors are First light, The crossing, Twin peaks, Skyline and Aurora. Large spheres split twice; small spheres disappear. Existing score, three lives, timers, invulnerability, pause, game-over, sector-clear, victory and restart behavior are unchanged. `src/engine.js`, `src/music.js`, `src/layout.js`, `src/storage.js` and `style.css` remain byte-identical to baseline `2e00cd379887a1f180d459b5724a3a97e8d50551`.

## Controls and continuity

- A/D or left/right arrows move; hold Space or FIRE to emit upward pulses.
- Touch: hold a direction and FIRE together with separate fingers.
- P / Esc or the pause control pauses/resumes; R or restart starts a fresh run.
- Music on/off restores or mutes the same transport. Explicit gameplay pause suspends audio; resume continues the same context/position. Restart, menus, sector changes and resizing do not replace the transport.

Legacy `pang.highScore` and `pang.music` keys are intentionally preserved, not used as new branding. Existing data survives same-origin reloads. A different deployment origin does not automatically inherit localStorage; cross-origin transfer needs a separate consented, tested design.

## Music and chain of title

“Polar Circuit” and its playback implementation are unchanged. The existing [music provenance](docs/music-provenance.md) records the author's original-composition/repository-owned assertions; they are not independent musicological or ownership clearance. That document explicitly asserts no separate open-source license. No general code/art repository license was found. This is a chain-of-title/documentation gap to resolve with the requesting owner, **not** a finding that the requester lacks rights in their own work. No license has been invented or added.

## Local development and private verification

This static project has no production build step or runtime packages. Node.js 22.22 or newer is required by the existing project.

```sh
npm ci
PORT=4193 npm run dev
npm test
npm run test:e2e
npm run test:all
```

Private Playwright uses `http://127.0.0.1:4193`, explicit `PORT=4193`, one worker and **no server reuse**. The original server on 4173 must remain untouched. Existing manual browser contexts explicitly receive baseURL and tests navigate relative to it; an added test reads the exact served renderer back and compares it with this worktree's file, preventing false verification of an old checkout. All preparation test/server/browser execution must hold `/root/arcade-migration-audit/preparation/test.lock` with `flock`.

Existing coverage includes real simultaneous two-finger touch, keyboard/fire/restart, Web Audio gain and lifecycle, preference persistence, denied storage/audio, DPR/layout and nine sizes. Added preparation coverage checks neutral presentation, actual pulse drawing/render purity, isolated server configuration, legacy records, six orientation/state cases and captures of all five sectors. Required viewports: 1920×1080, 1366×768, 768×1024, 390×844, 320×568 and 844×390. Screenshots use the real application/renderer with a paused browser clock and explicitly seeded level/player data, not fabricated images.

Exact execution outcomes, commands, local commit and unresolved findings are in `/root/arcade-migration-audit/preparation/orb-results.json` and `orb-report.md`. This test inventory is not itself a pass claim. See [private migration notes](docs/private-migration.md) for proposed-brand separation and release gates.
