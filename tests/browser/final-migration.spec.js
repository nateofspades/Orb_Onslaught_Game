// Final migration acceptance: real audio and fresh desktop/mobile contexts.
import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {calculateLayout} from '../../src/layout.js';
const sizes=[[1920,1080],[1366,768],[768,1024],[390,844],[320,568],[844,390]];
async function model(page,source){return page.evaluate(async source=>{
  const app=await import('/src/app.js');return new Function('app',source)(app);
},source);}
async function frozen(page){
  await page.clock.install({time:new Date('2026-01-01T00:00:00Z')});
  await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
  await page.goto('/');await page.clock.runFor(16);
}
async function geometry(page,width,height,ready){
  const data=await page.evaluate(ready=>{
    const ids=['left','right','fire','pause','restart','music','help',...(ready?['primary']:[])];
    return {scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,
      canvas:document.querySelector('canvas').getBoundingClientRect().toJSON(),
      controls:ids.map(id=>{const el=document.getElementById(id),r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {id,...r.toJSON(),reachable:hit===el||el.contains(hit),visible:getComputedStyle(el).visibility==='visible'};})};
  },ready);
  expect(data.scrollWidth).toBeLessThanOrEqual(width);expect(data.scrollHeight).toBeLessThanOrEqual(height);
  const c=data.canvas;expect(c.width).toBeGreaterThan(0);expect(c.width/c.height).toBeCloseTo(840/450,2);
  for(const r of [c,...data.controls]){
    expect(r.x).toBeGreaterThanOrEqual(0);expect(r.y).toBeGreaterThanOrEqual(0);
    expect(r.right).toBeLessThanOrEqual(width+1);expect(r.bottom).toBeLessThanOrEqual(height+1);
  }
  for(const r of data.controls){expect(r.visible,r.id).toBe(true);expect(r.reachable,r.id).toBe(true);}
  if(width<=600||height<=480)for(const r of data.controls.filter(r=>['left','right','fire'].includes(r.id))){
    expect(r.height).toBeGreaterThanOrEqual(64);expect(r.width).toBeGreaterThanOrEqual(64);
  }
}
for(const [width,height] of sizes)test(`final identity, initial hit targets, play and state-preserving resize ${width}x${height}`,async({browser,baseURL},testInfo)=>{
  const mobile=width<=844;
  const context=await browser.newContext({baseURL,viewport:{width,height},deviceScaleFactor:2,hasTouch:mobile,isMobile:mobile});
  try{
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    page.on('requestfailed',r=>errors.push(r.url()));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
    await frozen(page);await expect(page).toHaveTitle('Orb Onslaught');
    // Hidden brand is intentional in compact landscape; other sizes must show it.
    await expect(page.locator('h1')).toHaveText('Orb Onslaught');
    if(height>480)await expect(page.locator('h1')).toBeVisible();
    expect(await (await page.request.get('/src/render.js')).text()).toBe(readFileSync(new URL('../../src/render.js',import.meta.url),'utf8'));
    await geometry(page,width,height,true);
    if(mobile)await page.locator('#primary').tap();else await page.locator('#primary').click();
    await model(page,'app.game.invulnerable=100;app.game.score=2400;');await page.clock.runFor(16);
    await geometry(page,width,height,false);
    await page.screenshot({path:testInfo.outputPath(`active-${width}x${height}.png`)});
    const before=await model(page,'return JSON.stringify(app.game)');
    await page.setViewportSize({width:height,height:width});
    // setViewportSize returns before resize delivery; aspect ratio alone is invariant
    // even for stale dimensions. Wait for the actual layout in each orientation.
    await expect.poll(()=>page.locator('.shell').evaluate(el=>parseFloat(el.style.getPropertyValue('--arena-width')))).toBeCloseTo(calculateLayout(height,width).arenaWidth,2);
    expect(await model(page,'return JSON.stringify(app.game)')).toBe(before);
    await page.setViewportSize({width,height});
    await expect.poll(()=>page.locator('.shell').evaluate(el=>parseFloat(el.style.getPropertyValue('--arena-width')))).toBeCloseTo(calculateLayout(width,height).arenaWidth,2);
    await geometry(page,width,height,false);
    await page.locator('#pause').click();expect(await model(page,'return app.game.state')).toBe('paused');
    const timer=await model(page,'return app.game.timer');await page.clock.runFor(1000);
    expect(await model(page,'return app.game.timer')).toBe(timer);
    await page.locator('#primary').click();expect(await model(page,'return app.game.state')).toBe('playing');
    await page.locator('#restart').click();expect(await model(page,'return [app.game.level,app.game.score,app.game.lives,app.game.state]')).toEqual([0,0,3,'playing']);
    expect(errors).toEqual([]);
  }finally{await context.close();}
});

test('legacy preferences survive simulated old/new same-origin Pages paths and real score writes',async({page})=>{
  // This route is a local path harness, NOT a deployed migration or import of real user records.
  await page.route(/\/(?:pang_game|Orb_Onslaught_Game)\//,async route=>{
    const url=new URL(route.request().url());url.pathname=url.pathname.replace(/^\/(?:pang_game|Orb_Onslaught_Game)\//,'/');
    if(url.pathname==='/')url.pathname='/index.html';
    await route.fulfill({response:await route.fetch({url:url.href})});
  });
  await page.goto('/pang_game/');
  await page.evaluate(()=>{localStorage.setItem('pang.highScore','4321');localStorage.setItem('pang.music','off');});
  await page.goto('/Orb_Onslaught_Game/');
  await expect(page.locator('#best')).toHaveText('04321');await expect(page.locator('#music')).toHaveText('Music off');
  await page.locator('#primary').click();
  // Use the module URL actually loaded by the prefixed document, avoiding a second root app instance.
  await page.evaluate(async()=>{const {game}=await import('./src/app.js');game.score=5432;});
  await expect.poll(()=>page.evaluate(()=>localStorage.getItem('pang.highScore'))).toBe('5432');
  await page.goto('/pang_game/');await expect(page.locator('#best')).toHaveText('05432');
  await expect(page.locator('#music')).toHaveText('Music off');
});

test('all five sectors clear through real collision updates and game-over restarts from UI',async({page})=>{
  await frozen(page);await page.locator('#primary').click();
  for(let level=0;level<5;level++){
    expect(await model(page,'return app.game.level')).toBe(level);
    await page.evaluate(async()=>{const {game}=await import('/src/app.js');const {makeBall}=await import('/src/engine.js');
      game.balls=[makeBall(480,200,0)];game.shots=[{x:480,y:210,bottom:420}];game.invulnerable=100;game.update(.001);
    });
    await page.clock.runFor(16);
    expect(await model(page,'return app.game.state')).toBe(level===4?'victory':'cleared');
    expect(await model(page,'return app.game.score')).toBe((level+1)*300);
    if(level<4)await page.locator('#primary').click();
  }
  await expect(page.locator('#title')).toHaveText('You found the aurora.');
  await page.locator('#primary').click();
  await model(page,'app.game.loseLife();app.game.loseLife();app.game.loseLife();');await page.clock.runFor(16);
  expect(await model(page,'return app.game.state')).toBe('gameover');await expect(page.locator('#primary')).toHaveText('Try again');
  await page.locator('#primary').click();expect(await model(page,'return [app.game.lives,app.game.level,app.game.score]')).toEqual([3,0,0]);
});

for(const touch of [false,true])test(`real Web Audio signal/clock remains one transport through mute, pause, restart and orientation (${touch?'touch':'desktop'})`,async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,viewport:touch?{width:390,height:844}:{width:1366,height:768},hasTouch:touch,isMobile:touch});
  try{
    const page=await context.newPage();
    await page.addInitScript(()=>{
      const Native=globalThis.AudioContext||globalThis.webkitAudioContext;globalThis.__audioContexts=0;
      if(Native)globalThis.AudioContext=class extends Native{constructor(...args){super(...args);globalThis.__audioContexts++;}};
    });
    await page.goto('/');expect(await model(page,'return app.music.snapshot().started')).toBe(false);
    if(touch)await page.locator('#primary').tap();else await page.locator('#primary').click();
    await model(page,'app.game.invulnerable=100;');
    await expect.poll(()=>model(page,'return app.music.context?.state')).toBe('running');
    await page.evaluate(async()=>{const {music}=await import('/src/app.js');globalThis.__signal=music.context.createAnalyser();__signal.fftSize=2048;music.master.connect(__signal);});
    const peak=()=>page.evaluate(async()=>{
      const analyser=globalThis.__signal,values=new Float32Array(analyser.fftSize);let peak=0;const stop=performance.now()+400;
      while(performance.now()<stop){analyser.getFloatTimeDomainData(values);for(const v of values)peak=Math.max(peak,Math.abs(v));await new Promise(resolve=>requestAnimationFrame(resolve));}return peak;
    });
    expect(await peak()).toBeGreaterThan(.001);
    const before=await model(page,'return {id:app.music.contextId,time:app.music.context.currentTime,step:app.music.absoluteStep,timer:app.music.timer}');
    await page.locator('#music').click();await expect.poll(()=>model(page,'return app.music.master.gain.value')).toBeCloseTo(0,5);
    // Drain analyser history after the gain ramp before measuring silence.
    await page.waitForTimeout(150);expect(await peak()).toBeLessThan(.0001);
    expect(await model(page,'return app.music.absoluteStep')).toBeGreaterThan(before.step);
    await page.locator('#music').click();await expect.poll(()=>model(page,'return app.music.master.gain.value')).toBeCloseTo(.50,5);expect(await peak()).toBeGreaterThan(.001);
    await page.locator('#pause').click();await expect.poll(()=>model(page,'return app.music.context.state')).toBe('suspended');
    const pausedTime=await model(page,'return app.music.context.currentTime');await page.waitForTimeout(150);
    expect(await model(page,'return app.music.context.currentTime')).toBeCloseTo(pausedTime,2);
    await page.locator('#primary').click();await expect.poll(()=>model(page,'return app.music.context.state')).toBe('running');
    await page.locator('#restart').click();await page.setViewportSize({width:844,height:390});
    await expect.poll(()=>model(page,'return app.music.context.currentTime')).toBeGreaterThan(before.time);
    expect(await model(page,'return {id:app.music.contextId,timer:app.music.timer,count:globalThis.__audioContexts}')).toEqual({id:before.id,timer:before.timer,count:1});
    expect(await peak()).toBeGreaterThan(.001);
  }finally{await context.close();}
});
