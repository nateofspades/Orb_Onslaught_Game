import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests/browser', timeout:30000, fullyParallel:false, workers:1, use:{baseURL:'http://127.0.0.1:4173', headless:true}, webServer:{command:'npm run dev',url:'http://127.0.0.1:4173/src/engine.js',reuseExistingServer:!process.env.CI}});
