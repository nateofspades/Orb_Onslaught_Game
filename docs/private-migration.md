# Private migration notes — aurora field study

## Final-release superseding note — 2026-10-20

The owner has authorized the history-preserving final Orb Onslaught release at https://nateofspades.github.io/Orb_Onslaught_Game/ . The private-only hold and Orb Splitter candidate below are historical, not current restrictions or active branding. Final identity is Orb Onslaught; prepared polar artwork/pulse, controls, music and storage keys are retained. Current release evidence belongs to `/root/arcade-final-migration/orbonslaughtgame/` and [IP_AUDIT.md](IP_AUDIT.md). The original notes below are preserved as provenance, not erased or silently rewritten.

## Preserve the existing design, do not recreate the game

Source and the existing gameplay screenshot show a custom snow-parka/visor explorer, layered aurora, mountain/pine observation base and shaded orbit-marked spheres. Retain these drawings and the five existing source-defined levels rather than replacing already-distinct original work. The narrow projectile edit removes the pointed arrowhead and adds concentric pulse rings plus a travelling light tether. The authoritative collision line remains the existing shot data; rings/glow are decorative. No physics, player, split, timer, scoring, input or restart code was rewritten. The only application-code wording change is field-guide “harpoons” → “pulses.”

## Verification workflow and isolation

Presentation tests were written before implementation and failed for the missing pulse head and old commercial title (`orb-red.log`). The renderer test records real Canvas calls and checks model purity, not merely a comment or color claim. Full Vitest and existing Playwright must run under the shared `flock /root/arcade-migration-audit/preparation/test.lock`. Long lock waits use managed background commands with completion notifications; never bypass the lock or start another browser daemon.

Original port 4173 was confirmed occupied before private browser testing. Private configuration binds the existing loopback-only server on 4193, disables reuse, and explicitly passes baseURL to manual browser contexts before relative navigation. A served-source readback compares `/src/render.js` with the exact worktree file. This prevents an original/public-server false pass. Private test timeout is 60 seconds for the shared runner, not a change to gameplay time. Never stop or reuse the original server. Test output and reviewed screenshots belong under the audit preparation directory; CI/prefix/deployment verification is separate and is not claimed here.

All five retained levels are First light, The crossing, Twin peaks, Skyline and Aurora. New screenshots render them through the real application/RAF loop using a paused test clock and seeded state; six viewport cases also exercise storage, restart and orientation. Existing browser cases retain the real two-finger touch, real Web Audio gain/transport and other lifecycle checks. Exact outcomes and counts are recorded only after execution in `orb-results.json` / `orb-report.md`.

## Compatibility and permissions

Keep `pang.highScore` and `pang.music`; these are compatibility identifiers, not new public branding. Same-origin storage is shared across paths. No automatic cross-origin import/export is implemented. Engine, music, storage, layout and stylesheet are unchanged from the recorded baseline.

No tracked general code/art license was found. Establish the requesting owner's chain of title, contributor/agent-assisted provenance and desired distribution terms; absence of an open license does not establish lack of rights in the requester's own original work. The music provenance document records author assertions and explicitly declines a separate open-source grant. Do not transform those statements into a license or independently verified originality conclusion.

## Proposed future brand — not activated

**Orb Splitter** is a proposed future name only, confined to private planning. It is not a name-availability, trademark, domain or legal-clearance finding, and no runtime/public rename uses it here. Current runtime title is the neutral Aurora Field Study / FIELD. Final brand, slug, metadata, icons and canonical URLs require a separate approved decision.

Passing tests is not permission to deploy. Total audiovisual-expression comparison, final name review, chain of title, musicological comparison where warranted, dependency notices and the actual distribution artifact remain separate release gates. Public/main checkouts, original live server, remotes and GitHub state are outside this preparation. No push, merge, repository creation or deployment is authorized.
