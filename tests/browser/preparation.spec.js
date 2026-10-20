import {test,expect} from '@playwright/test';
import {mkdirSync,readFileSync} from 'node:fs';
const evidence=process.env.ORB_SCREENSHOTS||'test-results/orb-screenshots';
mkdirSync(evidence,{recursive:true});
async function boot(page){
  await page.clock.install({time:new Date('2026-01-01T00:00:00Z')});
  await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
  await page.addInitScript(()=>{localStorage.setItem('pang.highScore','1234');localStorage.setItem('pang.music','off');});
  await page.goto('/');
  // The app synchronizes HUD/first paint in RAF; a paused clock must deliver that frame.
  await page.clock.runFor(16);
  await expect(page).toHaveTitle('Orb Onslaught');
  // Exact source readback prevents false passes against any old/public checkout server.
  expect(await (await page.request.get('/src/render.js')).text()).toBe(readFileSync(new URL('../../src/render.js',import.meta.url),'utf8'));
}
for(const [width,height] of [[1920,1080],[1366,768],[768,1024],[390,844],[320,568],[844,390]]){
  test(`private pulse scene, legacy data and orientation ${width}x${height}`,async({page})=>{
    await page.setViewportSize({width,height});await boot(page);
    await expect(page.locator('#best')).toHaveText('01234');
    await expect(page.locator('#music')).toHaveText('Music off');
    if(width===1366)await page.screenshot({path:`${evidence}/ready.png`});
    await page.getByRole('button',{name:'Start expedition'}).click();
    await page.evaluate(async()=>{const {game,input}=await import('/src/app.js');game.invulnerable=10;input.fire=true;});
    await page.clock.runFor(250);
    await page.evaluate(async()=>{(await import('/src/app.js')).input.fire=false;});
    await page.screenshot({path:`${evidence}/${width}x${height}-playing.png`});
    const before=await page.evaluate(async()=>JSON.stringify((await import('/src/app.js')).game));
    await page.setViewportSize({width:height,height:width});
    await expect.poll(()=>page.locator('canvas').evaluate(el=>{const r=el.getBoundingClientRect();return Math.abs(r.width/r.height-840/450)<.02;})).toBe(true);
    expect(await page.evaluate(async()=>JSON.stringify((await import('/src/app.js')).game))).toBe(before);
    await page.getByRole('button',{name:'Restart game'}).click();
    expect(await page.evaluate(async()=>{const {game}=await import('/src/app.js');return {level:game.level,score:game.score,lives:game.lives,state:game.state};})).toEqual({level:0,score:0,lives:3,state:'playing'});
  });
}
test('inspect all five retained original sectors with the real renderer and RAF loop',async({page})=>{
  await page.setViewportSize({width:1366,height:768});await boot(page);
  await page.getByRole('button',{name:'Start expedition'}).click();
  const names=await page.evaluate(async()=>(await import('/src/engine.js')).LEVELS.map(l=>l.name));
  expect(names).toEqual(['First light','The crossing','Twin peaks','Skyline','Aurora']);
  for(let level=0;level<names.length;level++){
    await page.evaluate(async index=>{const {game,input}=await import('/src/app.js');game.loadLevel(index);game.shots=[];game.cooldown=0;game.invulnerable=10;input.fire=true;},level);
    await page.clock.runFor(250);
    await page.evaluate(async()=>{(await import('/src/app.js')).input.fire=false;});
    await page.screenshot({path:`${evidence}/sector-${level+1}.png`});
    expect(await page.evaluate(async()=>(await import('/src/app.js')).game.state)).toBe('playing');
  }
});
