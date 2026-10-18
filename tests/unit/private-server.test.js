import {it, expect} from 'vitest';
import {readFileSync} from 'node:fs';
import config from '../../playwright.config.js';
it('serves this private worktree on isolated loopback port without server reuse',()=>{
  expect(config.use.baseURL).toBe('http://127.0.0.1:4193');
  expect(config.webServer.env.PORT).toBe('4193');
  expect(config.webServer.reuseExistingServer).toBe(false);
  expect(readFileSync(new URL('../../server.mjs',import.meta.url),'utf8')).toContain(".listen(port,'127.0.0.1'");
  expect(readFileSync(new URL('../browser/game.spec.js',import.meta.url),'utf8')).not.toContain("page.goto('http://127.0.0.1:4173/");
});
