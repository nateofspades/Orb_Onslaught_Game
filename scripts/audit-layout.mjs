// Independent black-box layout audit. Start `npm run dev` first, or pass a live URL.
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const target = process.argv[2] || 'http://127.0.0.1:4173/';
const viewports = [[1920,1080],[1366,768],[768,1024],[390,844],[320,568],[844,390]];
const results = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const deviceScaleFactor of [1, 2]) {
    for (const [width, height] of viewports) {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor });
      try {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
        page.on('requestfailed', request => errors.push(`${request.method()} ${request.url()} ${request.failure()?.errorText}`));
        page.on('response', response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()} ${response.url()}`); });
        await page.goto(target, { waitUntil: 'networkidle' });
        const canvas = page.locator('canvas').first();
        await canvas.waitFor({ state: 'visible' });
        const inspect = async phase => {
          const metrics = await page.evaluate(() => {
            const canvas = document.querySelector('canvas');
            const rect = canvas.getBoundingClientRect();
            const buttons = [...document.querySelectorAll('button')].filter(button => {
              const style = getComputedStyle(button);
              return style.visibility !== 'hidden' && style.display !== 'none' && button.getClientRects().length;
            }).map(button => {
              const r = button.getBoundingClientRect();
              const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
              return { name: button.getAttribute('aria-label') || button.textContent.trim(), x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height, disabled: button.disabled, reachable: hit === button || button.contains(hit) };
            });
            return { scrollWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth, viewportHeight: innerHeight, canvas: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom, backingWidth: canvas.width, backingHeight: canvas.height }, buttons, dpr: devicePixelRatio };
          });
          const label = `${width}x${height} DPR ${deviceScaleFactor} ${phase}`;
          assert.ok(metrics.scrollWidth <= width, `${label}: horizontal overflow ${metrics.scrollWidth}`);
          const c = metrics.canvas;
          assert.ok(c.width > 0 && c.height > 0 && c.width > c.height, `${label}: arena must be visible landscape`);
          assert.ok(c.x >= -1 && c.y >= -1 && c.right <= width + 1 && c.bottom <= height + 1, `${label}: canvas clipping ${JSON.stringify(c)}`);
          assert.ok(Math.abs(c.backingWidth - c.width * metrics.dpr) <= 3, `${label}: backing width is not DPR sharp`);
          assert.ok(Math.abs(c.backingHeight - c.height * metrics.dpr) <= 3, `${label}: backing height is not DPR sharp`);
          for (const button of metrics.buttons) {
            assert.ok(button.width > 0 && button.height > 0, `${label}: empty button ${button.name}`);
            assert.ok(button.x >= -1 && button.y >= -1 && button.right <= width + 1 && button.bottom <= height + 1, `${label}: inaccessible button ${JSON.stringify(button)}`);
            assert.ok(button.disabled || button.reachable, `${label}: button is covered by another element ${button.name}`);
          }
          return metrics;
        };
        await inspect('ready');
        const start = page.getByRole('button', { name: /^(start|start game|play|play now|launch|begin|start expedition)/i }).first();
        assert.ok(await start.isVisible(), `${width}x${height}: Start control missing`);
        await start.click();
        await page.waitForTimeout(350);
        const metrics = await inspect('active');
        const palette = await canvas.evaluate(element => {
          const { data } = element.getContext('2d').getImageData(0, 0, element.width, element.height);
          const colors = new Set();
          for (let i = 0; i < data.length; i += Math.max(4, Math.floor(data.length / 4000 / 4) * 4)) colors.add(`${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]}`);
          return colors.size;
        });
        assert.ok(palette > 8, `${width}x${height}: canvas appears blank (${palette} sampled colors)`);
        const pause = page.getByRole('button', { name: /^pause\b/i }).first();
        assert.ok(await pause.isVisible(), `${width}x${height}: accessible Pause control missing`);
        await pause.click();
        await page.waitForTimeout(100);
        await inspect('paused');
        const resume = page.getByRole('button', { name: /^resume\b/i }).first();
        assert.ok(await resume.isVisible(), `${width}x${height}: accessible Resume control missing`);
        await resume.click();
        await page.waitForTimeout(100);
        await inspect('resumed');
        const restart = page.getByRole('button', { name: /^restart\b/i }).first();
        assert.ok(await restart.isVisible(), `${width}x${height}: accessible Restart control missing`);
        await restart.click();
        await page.waitForTimeout(100);
        await inspect('restarted');
        assert.deepEqual(errors, [], `${width}x${height}: browser errors`);
        results.push({ width, height, dpr: deviceScaleFactor, canvas: metrics.canvas, visibleButtons: metrics.buttons.length, sampledColors: palette, errors: 0 });
        console.log(`PASS ${width}x${height} DPR ${deviceScaleFactor}: ready, active, paused, resumed, restarted canvas and every visible button fit; ${palette} sampled colors; no browser/request errors`);
      } finally {
        await context.close();
      }
    }
  }
  console.log(JSON.stringify({ target, combinations: results.length, results }, null, 2));
} finally {
  await browser.close();
}
