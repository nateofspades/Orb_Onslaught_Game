import {defineConfig} from '@playwright/test';
// Private worktree only. Never reuse the original game server on 4173.
export default defineConfig({
  testDir:'tests/browser', timeout:60000, fullyParallel:false, workers:1,
  use:{baseURL:'http://127.0.0.1:4193',headless:true},
  webServer:{command:'npm run dev',env:{PORT:'4193'},url:'http://127.0.0.1:4193/src/render.js',reuseExistingServer:false},
});
