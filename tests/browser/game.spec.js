import {test,expect} from '@playwright/test';
async function boot(page){await page.clock.install({time:new Date('2026-01-01T00:00:00Z')});await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));await page.goto('/');}
async function game(page,fn){return page.evaluate(async src=>{const {game}=await import('/src/app.js');return (new Function('g',src))(game);},fn);}
test('pauses, resumes, restarts, shows instructions and pauses on visibility loss',async({page})=>{
  await boot(page);await page.getByRole('button',{name:'Start expedition'}).click();
  await page.getByRole('button',{name:'Pause game'}).click();expect(await game(page,'return g.state')).toBe('paused');
  await page.clock.runFor(1000);expect(await game(page,'return g.timer')).toBe(90);
  await page.getByRole('button',{name:'Resume expedition'}).click();
  await page.keyboard.press('KeyP');expect(await game(page,'return g.state')).toBe('paused');await page.keyboard.press('Escape');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  expect(await game(page,'return g.state')).toBe('paused');
  await page.getByRole('button',{name:'Restart game'}).click();expect(await game(page,'return g.state')).toBe('playing');
  await page.getByRole('button',{name:'Instructions',exact:true}).click();await expect(page.getByText(/Small spheres move faster/)).toBeVisible();
});
test('starts a playable canvas, keyboard movement and sustained fire',async({page})=>{
  await boot(page); await expect(page.getByRole('heading',{name:'PANG',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Start expedition'}).click();
  await page.keyboard.down('ArrowLeft');await page.keyboard.down('Space');await page.clock.runFor(500);
  await page.keyboard.up('ArrowLeft');await page.keyboard.up('Space');
  expect(await game(page,'return g.player.x')).toBeLessThan(400);
  expect(await game(page,'return g.shots.length')).toBeGreaterThan(0);
  await expect(page.locator('canvas')).toBeVisible();
});
