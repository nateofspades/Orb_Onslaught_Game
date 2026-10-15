# Repository workflow

For every completed, meaningful change in this repository:

1. Write or update the relevant Vitest/Playwright test first and verify the intended failure when behavior changes.
2. Implement the change and run the relevant tests; run `npm run test:all` before release/deployment work.
3. Use only the repository-local identity `Nathan Burns <33226599+nateofspades@users.noreply.github.com>`.
4. Create one descriptive commit per coherent change. Never create empty, artificial, or contribution-inflating commits.
5. Push the completed commit to `origin/main`, verify its exact SHA exists on remote `main`, and ensure the repository remains public and standalone.
6. If website behavior or assets changed, wait for GitHub Pages and smoke-test `https://nateofspades.github.io/pang_game/` on desktop and mobile.
7. Report the commit SHA/link, tests run, CI result, Pages result, and any remaining issue.

Do not rewrite published history or use an unrelated/bot author identity. Keep the static site GitHub Pages compatible.