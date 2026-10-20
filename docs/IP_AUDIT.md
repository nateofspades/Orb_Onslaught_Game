# Orb Onslaught — intellectual-property audit

## Status, scope and conclusion

**Final release engineering audit, 2026-10-20; not legal clearance.** Final identity: **Orb Onslaught**, repository `nateofspades/Orb_Onslaught_Game`, profile `orbonslaughtgame`. The owner explicitly authorizes release, superseding the historical private hold. The source-phase observations below are preserved as a dated baseline; the final-execution addendum governs current identity and validation. External result.json/report.md record exact reviewed/final SHA and remote gates, avoiding a self-referential commit hash inside this document.

**Preliminary rating: Low apparent concern for the specifically inspected source, art and asset presentation, with unresolved provenance and incomplete audiovisual comparison.** There is no identified copied commercial sprite, recording, logo or scenic bitmap in the runtime inventory. This is not a determination of non-infringement, trademark availability, chain of title, or originality. Retained genre structure and broad character/ball/shooting arrangement still warrant total-expression consideration; music was read but not listened to or compared against a commercial soundtrack corpus. Nothing found here calls for discarding the prepared polar design or changing functional splitting mechanics. Missing general open-source licensing is not evidence the requesting owner lacks rights to publish their own work.

## Repository provenance and relevant history

Inspected worktree: `/root/arcade-migration-prep/orbsplittergame`. Original `/root/pang_game` and shared Git storage must remain intact. Current origin read locally: `https://github.com/nateofspades/pang_game.git`; no network mutation performed. Snapshot HEAD: `f068db5dbc8e69252a87add37daa51a9d96082a7`. Original main baseline: `2e00cd379887a1f180d459b5724a3a97e8d50551`.

The reverse Git log, initial renderer and relevant prepared/mobile/audio diffs were inspected:

- `e4d5381` introduces the aurora foundation, including the same polygon mountain coordinates, pine silhouettes, parka/visor figure and orbit-marked orbs. These elements predate this migration; they were not newly substituted here.
- `e3a73ef` completes responsive audio/score persistence; `730b082` records denied-storage/audio handling.
- `57f7b81` adds continuous music and responsive control/layout architecture; `3ed17b1` records controls/music provenance.
- `432ca74`, `5f5fa4d`, `acd8e68`, `0ca4e33` preserve available/nonoverlapping secondary landscape controls, including very narrow layouts; `0036ee9` addresses touch activation.
- `43e6368` and `2e00cd3` strengthen gain recovery and initial mobile viewport sizing, and suspend/resume music with game pause. Preserve these improvements.
- Prepared `f068db5` removes activated Pang branding in favor of temporary private labels, changes the triangular harpoon head into concentric pulse rings and travelling dashed tether, and adds isolated verification. Only drawing/wording changed, not authoritative shot geometry.

All visible authors are Nathan Burns; most use the canonical GitHub noreply identity, while two README updates use another Nathan Burns email. Author strings and commit subjects establish recorded attribution/history, not independent identity verification, assignments, absence of copied source, or agent/tool training provenance. Historical code/art authorship is inferred from this repository history, not a signed chain-of-title certificate. Owner should retain contributor/agent-assisted creation records and resolve any concrete third-party claim. Do not rewrite history or erase historical provenance labels.

A read-only `git diff` against baseline confirmed `src/engine.js`, `src/music.js`, `src/layout.js`, `src/storage.js` and `style.css` unchanged at inspection. Production files remain untouched in this phase.

## File-level source and asset inventory

The companion [source-phase inventory](source-phase-inventory.md) records every preexisting tracked path, byte size and SHA-256, every locked development package/version/declared license, and installed notice discovery. Machine-readable evidence is `/root/arcade-final-migration/orbonslaughtgame/source-inventory.json`. Those hashes describe the preparation snapshot, not a future final release.

| Paths | Material/source | Rights and review finding |
|---|---|---|
| `index.html` | Local authored markup, copy, inline Unicode marks, empty `data:,` favicon | Temporary identity remains; no linked remote artwork/font. Historical authorship evidence only; no general source license. |
| `style.css` | Local CSS gradients, panel/HUD/buttons, system font stack | `Inter` is only a font-family preference, not a downloaded/bundled font. No font binary, `@import`, remote image or CSS image URL. Preserve large targets and landscape control arrangement; final long-title fit needs testing. |
| `src/render.js` | Canvas geometry and gradients for every character, orb, shot, platform, particle and background | No raster sprite sheet/vector import, commercial palette file or external font. Procedural drawing is not proof of originality. Detailed expression review below. |
| `src/engine.js` | Local physics, collisions, player, scoring/lives/timers and five explicit level layouts | Functional genre overlap remains. No imported commercial level file; exact independent provenance of coordinates unverified. |
| `src/app.js` | Local input, RAF, UI state/copy, viewport events, storage/audio lifecycle | Relative local imports only. Historical provenance; retain keys, touch recovery and pause semantics. |
| `src/layout.js`, `src/storage.js` | Local viewport sizing and guarded persistence | Keep `pang.highScore` compatibility key; not activated branding. No external service. |
| `src/music.js` | Local note literals plus Web Audio synthesis and scheduler | Preserve Polar Circuit. No samples/recordings/fetch. Authorship assertion in `docs/music-provenance.md` is not independent verification or an open-source grant. |
| `assets/screenshots/gameplay.png` | The sole tracked binary asset: screenshot of prepared own active gameplay | Actually viewed. Shows FIELD/private labels, so must be replaced with a fresh final-title own capture during sequential execution. Not an imported commercial screenshot. |
| `README.md`, `AGENTS.md`, `docs/audit-status.md`, `docs/music-provenance.md`, `docs/private-migration.md`, `docs/tdd-log.md`, `docs/tdd-review.md` | Project documentation and historical preparation/test claims | Preserve legal/historical notices. README/private brand plans are stale for final adoption. Historical logs are not current passes. Instruction-file approval restrictions must not be bypassed. |
| `server.mjs`, `playwright.config.js`, `vitest.config.js`, `.github/workflows/test.yml`, `.gitignore` | Local development/test/CI infrastructure | No production build/runtime package. Private server binds loopback. Do not publish node_modules or caches. |
| `scripts/audit-layout.mjs`, `scripts/audit-physics.mjs`, `scripts/tdd.mjs`, `scripts/verify-pages.mjs` | Local audit helpers/deployment readback | Old Pages repo/URL and old default audit port remain. No assets downloaded by gameplay. Do not execute browser/network deployment helper in this preparation phase. |
| `tests/unit/*.test.js`, `tests/browser/*.spec.js` | Local regression/presentation tests | Existing browser cases include mocked lifecycle tests as well as real-context gain tests; these are distinct evidence types. New final test drafts are unexecuted. |
| `package.json`, `package-lock.json` | npm dev-only dependency manifest/lock | No root general LICENSE is declared. Third-party tool licenses do not license local game art/code. |

No tracked audio/video/font/archive/commercial reference art or additional HTML/CSS/game source was found. Local runtime HTML→app→engine/render/layout/music/storage import graph is self-contained; no runtime fetch, analytics SDK, CDN script, image loading or remote music. External links occur in development/verification/documentation, not as commercial game resources. A static repository publication must still inspect its exact artifact so no excluded/untracked tooling leaks into distribution.

## Licensing and dependencies

`package.json` declares only `@playwright/test ^1.64.1` and `vitest ^5.0.4` as devDependencies. The lock resolves Playwright/test/core 1.64.1 and Vitest 5.0.4; Vite/rolldown/lightningcss and assertion/utilities are transitive test-tooling, not production imports. The full lock inventory includes optional platform packages: 63 package entries, declared licenses MIT (44), Apache-2.0 (5), MPL-2.0 (12), ISC (1), BSD-3-Clause (1). Metadata counts are not a vulnerability scan or complete bundled-notice audit.

Representative installed `vitest`, `playwright`, `playwright-core`, `lightningcss`, `picocolors`, and `source-map-js` LICENSE texts were inspected. Apache redistribution terms retain license/notices and distinguish trademark rights; MIT/ISC require retaining notices; BSD includes notice/nonendorsement terms; MPL has covered-file/source availability and notice requirements when its covered code is distributed. Do not extrapolate tooling's MPL license to the independently served game files. Some browser/tool distributions contain additional third-party notices; these were discovered but not exhaustively reviewed. If distributing a packaged browser/toolchain or vendored dependencies, review those actual archives and retain their required notices. Current game needs none of them loaded by a player's browser. Do not claim a dependency-free development toolchain.

There is no tracked general code/art LICENSE. No MIT or other permission has been invented. The existing music note asserts repository ownership and no third-party music required, but expressly asserts no separate open-source license. Owner publication may remain copyright-reserved; a public repo is not by itself a reuse grant. Ask owner about desired downstream license/assignments if needed for commercial distribution, without automatically blocking the owner's authorized publication merely because no open-source grant exists.

## Actually viewed comparative visual evidence

The lawful public comparison gallery describes Buster Bros., with Pang among its alternate names, and distinguishes Arcade screenshots.[1] Its linked public frame was opened with the image tool and actually viewed for internal comparison, not copied into this repository.[2] Gallery labeling is a source attribution, not independently certified capture ownership. No ROM, decompilation, soundtrack rip or proprietary source was acquired.

**Commercial frame visible facts:** naturalistic/dithered Mount Fuji landscape, blue brick framing/floor edge, light-blue helmeted side-facing human near the ground, small glossy red balls, upper-right timer, and bottom white score/location lettering against black. Two small projectile marks are visible. This frame does not show a full rope and therefore cannot establish every commercial harpoon animation.[2]

**Own frame actually viewed:** `assets/screenshots/gameplay.png` shows a geometric polar-night observation setting: layered angular mountains and snowcaps, triangular pine silhouettes, moon/stars and translucent aurora bands; cream hood/dark visor, amber suit stripe/boots; glowing rose orbs with tilted orbit ellipses; circular cyan pulse and travelling dotted tether; rounded separate HUD/control panels. FIELD / AURORA PRIVATE STUDY remain visible. This is a materially different scene in the inspected still, not a conclusion that changing a palette alone resolves overall resemblance.

Also actually opened all five existing `/root/arcade-migration-audit/preparation/orb-screenshots/sector-{1..5}.png` captures. These are **historical seeded preparation frames**, not freshly executed final tests. They show the same polar drawing vocabulary, with absent/single/two/three platform arrangements matching the source below. Sector 3 has offset ledges; sector 4 has high outer ledges and a lower middle ledge; sector 5 has an elevated center and lower side ledges. These frames do not certify motion, commercial-level uniqueness, or final-title appearance.

### Character, orb, projectile and scene assessment

- **Explorer:** geometric front-facing cream hood/black-blue visor, amber parka, pale vertical center stripe and dark boots. The compared commercial figure is side-facing and light blue. A small grounded humanoid under bouncing balls remains a compositional similarity; no recognizable copied face, costume sheet or branded mascot was identified in inspected source/frame. Hood/helmet alone is not decisive.
- **Orbs:** mint/amber/rose size palette, radial shading, luminous outline, orbit ellipse/highlights. The reference has simple shiny red balls. Shared round hazards and size splitting are intentional mechanics; rendering style differs in the inspected material, but spheres/gradients cannot prove provenance.
- **Upward shot:** retained long collision line resembles the functional upward weapon concept; prepared art substitutes concentric ring head, faint core and moving dashed light tether for the old triangular arrowhead. This is a targeted expressive change already committed, not an entirely new combat system. Preserve speed/cooldown/platform blocking.
- **Platforms/background:** segmented mint-topped geometric ledges above frozen base, layered geometric polar scenery, not the commercial brick border or scenic pixel photograph-like landscape. Snow mountains remain a broad thematic overlap with the Mount Fuji reference; the actual polygon composition, aurora/pines/moon and panel arrangement differ. No assertion every Pang background/variant was surveyed.
- **UI/overall look:** separate rounded HUD and large movement/fire controls, muted teal typography and expedition wording differ from the reference's pixel arcade timer/score bands. Exact final title is pending; the longer heading may overflow the old FIELD dimensions and must be tested before minimally changing typography.

## Levels and mechanics retained

`src/engine.js` stores five 840×450 arenas with floor y=425. Platform entries are `(x,y,width,height)`:

| Sector | Platforms | Spawn triples `(x,y,size)` | Time |
|---|---|---|---:|
| First light | None | (160,100,2), (680,140,2) | 90 |
| The crossing | (330,240,180,16) | (150,90,2), (660,100,2), (420,70,1) | 100 |
| Twin peaks | (130,260,160,16), (550,210,160,16) | (100,70,2), (420,100,2), (730,80,1) | 110 |
| Skyline | (90,170,170,16), (335,275,170,16), (580,170,170,16) | (160,65,2), (420,100,2), (680,65,2) | 120 |
| Aurora | (180,220,120,16), (360,140,120,16), (540,220,120,16) | (90,80,2), (320,70,2), (520,70,2), (750,80,2) | 140 |

Radii `[12,23,40]`, horizontal speeds `[210,155,110]`, large→two medium→small splitting and upward shots, three lives, time limits, scoring, pause/restart, five-stage progression are preserved. No commercial world map/location list was found in runtime source. No exhaustive coordinate-by-coordinate comparison to all Pang/Buster Bros. levels was performed. Generic mechanics are not automatically treated as copied protectable expression; their exact combination, presentation and audiovisual sequencing still deserve qualified evaluation. US Copyright Office guidance distinguishes game ideas/methods from sufficient literary/pictorial expression; that guidance is not a blanket immunity for cloning the overall presentation, and it does not grant trademark rights.[3]

## Music-specific review

Actually read all `src/music.js`, including note dictionary, literal melody/bass arrays, truncation, envelopes, voice types and transport. **Polar Circuit**, 172 BPM, 64 scheduled steps, E-centered melody starts `E4 - G4 A4 B4 - A4 G4 E4 - D4 E4 G4 - E4 D4`; bass starts `E3 - E3 B3 E3 - E3 B3 C3 - C3 G3 C3 - C3 G3`. Melody literal has a tail truncated by `.slice(0,64)`; only scheduled data should be compared for audible phrase claims. Square melody, triangle bass, sine low percussion, high square pulse and sawtooth accents are synthesized. No audio samples, recordings or added gameplay SFX. One AudioContext/master, 25ms lookahead timer, mute gain ramp and game/visibility suspension are implemented.

Historical `docs/music-provenance.md` asserts original composition/implementation created for the repository and no quotation/adaptation. This is the author's claim, not independently established. Source generation, synthesis or lack of samples cannot guarantee a melody is original. `/root/arcade-final-migration/cross-game-score-comparison.json` was read: across its 22 compared principal phrases in eight games, it reports no identical full phrase or whole-phrase transposition duplicates. The Orb entry records a 64-event lead and source hash `9b65c132e7675438674582a1899396a341d547732688a676a720f0ea49aeb94f`. This is narrow cross-project differentiation, not commercial corpus matching, musicological review or proof of copyright ownership. No listening, commercial soundtrack comparison or physical-speaker loudness assessment occurred in this phase. No specific musical copying concern was identified; preserve the track absent contrary concrete evidence.

## Remaining concerns, next gates and professional review

1. Activate exact Orb Onslaught browser/header/metadata/README/package/verification identity **after observing the drafted identity tests fail for intended assertions**. Preserve historical Pang references where legal/provenance context requires, and retain `pang.highScore`/`pang.music` without blanket replacements. No new name investigation is requested.
2. Reconcile stale tests expecting Aurora Field Study/FIELD only after the final identity RED observation; keep renderer purity, touch, landscape and legacy-storage coverage. Test all six required sizes in fresh mobile/touch contexts as applicable. Capture and actually view fresh final-title gameplay/all-sector frames, not only old images.
3. Real Web Audio signal/clock/transport draft must be run later; mocked lifecycle checks cannot substitute. Preserve one context/timer and audible instrumental output through resize/restart; explicit pause should suspend rather than reset. Browser emulation is not hardware, and signal tests are not physical loudness verification.
4. Seed same-origin storage under old/new simulated paths; this does not import real users or migrate across origins. Future live URL/source/assets/CI/commit ancestry/immutable repo ID require independent verification.
5. Obtain/retain owner creation/contributor rights records if needed; consider further all-version motion/level and independent music comparison if a concrete resemblance question arises. Recheck actual release artifact/dependency notices if packaging changes. Do not erase existing notices or infer a license for someone else's work.
6. Consult a qualified intellectual-property lawyer before commercial reliance, significant monetization/licensing, or in response to an actual claim; a music professional can compare melody/rhythm/arrangement where warranted. This preliminary engineering review is not professional legal advice and offers no legal guarantee. Residual uncertainty is not by itself a finding of infringement or an automatic bar to the requesting owner's authorized publication.

## Final-execution addendum

The final executor read all runtime HTML/CSS/JS, engine levels, music note literals, repository workflow, test/server/deployment configs, prior evidence and actual Git history. Initial identity RED was actually observed: 7 assertions failed for the old title, menu, README, package and destination; after targeted changes all 7 passed. No global Pang replacement was performed. `pang.highScore` and `pang.music` remain intact. Engine, music, renderer, layout, storage and stylesheet were retained; only final identity/copy, deployment targets, documentation, screenshots and regression harness changed in this phase. The prepared ring/tether expression fix and all prior history remain.

Initial full execution: 64 unit tests and 39 browser tests passed, zero failures/skips, single workers. Browser evidence includes all six exact sizes, fresh true touch/mobile contexts, actual collision-driven five-sector/victory/game-over transitions, same-origin old/new-path seeded persistence, and native Web Audio analyser signal/clock/gain/context/timer continuity rather than mocks alone. Desktop and touch real-audio cases passed signal >.001, muted signal <.0001, gain .50 restoration, suspended-clock stability and one context/timer across restart/rotation. No physical-speaker loudness, real-device behavior or commercial music-corpus listening claim is made. Final rerun/review/deployment outcomes are external release gates, not inferred from this paragraph.

Fresh final-title captures under `/root/arcade-final-migration/orbonslaughtgame/screenshots/` were actually opened: six required active sizes and sector-1 through sector-5. Header wraps on 320px, without clipping control targets; compact landscape intentionally hides the header while retaining game title in the ready overlay/browser title. The new README gameplay PNG is the actual 1366×768 active capture. All five sector backgrounds/ledges, visor character, orbit spheres and ring/dashed tether were visually inspected, and the commercial reference [2] was opened again. The polar geometry/aurora/pines/visor/pulse remains visually distinct from the inspected Fuji/brick/light-blue figure/red-ball frame. A single reference still is not comprehensive motion, level or soundtrack comparison. No commercial reference image was redistributed.

Final rating remains **Low apparent concern**, limited to the inspected expression/inventory. Unresolved independent chain of title, absent general reuse license and incomplete commercial audiovisual/music corpus comparison remain explicit uncertainties, not legal clearance or an identified copied asset. No specific credible material unresolved infringement issue was identified. Preserve notices, owner/contributor creation records and seek qualified legal advice before commercial reliance or on a concrete claim. Deployment/CI/author/immutable-ID/exact-SHA outcomes are verified separately in external evidence.

## Sources

[1] https://www.mobygames.com/game/5055/buster-bros/screenshots/arcade
[2] https://cdn.mobygames.com/17a8bb82-bdeb-11ed-b791-02420a0001bb.webp
[3] https://www.copyright.gov/register/tx-games.html
