import {test,expect} from '@playwright/test';
async function boot(page){await page.clock.install({time:new Date('2026-01-01T00:00:00Z')});await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));await page.goto('/');}
async function game(page,fn){return page.evaluate(async src=>{const {game}=await import('/src/app.js');return (new Function('g',src))(game);},fn);}
for(const [width,height]of [[1920,1080],[1366,768],[768,1024],[390,844],[320,568],[844,390]])test(`responsive DPR arena and accessible controls ${width}x${height}`,async({browser})=>{
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:2});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('requestfailed',r=>errors.push(r.url()));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('http://127.0.0.1:4173/');
 const dimensions=await page.locator('canvas').evaluate(c=>({w:c.width,h:c.height,rect:c.getBoundingClientRect().toJSON(),dpr:devicePixelRatio,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight}));
 expect(dimensions.w).toBe(Math.round(dimensions.rect.width*2));expect(dimensions.h).toBe(Math.round(dimensions.rect.height*2));expect(dimensions.sw).toBeLessThanOrEqual(width);expect(dimensions.sh).toBeLessThanOrEqual(height);
 for(const locator of [page.locator('#primary'),page.locator('#left'),page.locator('#right'),page.locator('#fire'),page.locator('#pause'),page.locator('#restart'),page.locator('#help')]){const r=await locator.boundingBox();expect(r.x).toBeGreaterThanOrEqual(0);expect(r.y).toBeGreaterThanOrEqual(0);expect(r.x+r.width).toBeLessThanOrEqual(width);expect(r.y+r.height).toBeLessThanOrEqual(height);}
 await page.getByRole('button',{name:'Start expedition'}).click();await page.waitForTimeout(250);expect(errors).toEqual([]);await context.close();
});
test('real simultaneous two-finger touch moves and shoots, release and cancel never stick',async({page,context})=>{
  await page.setViewportSize({width:390,height:844});await boot(page);await page.getByRole('button',{name:'Start expedition'}).click();
  const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  const a=await page.locator('#right').boundingBox(),b=await page.locator('#fire').boundingBox();
  const touches=[{id:1,x:a.x+a.width/2,y:a.y+a.height/2},{id:2,x:b.x+b.width/2,y:b.y+b.height/2}];
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:touches});await page.clock.runFor(400);
  expect(await game(page,'return g.player.x')).toBeGreaterThan(570);expect(await game(page,'return g.shots.length')).toBeGreaterThan(0);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});const x=await game(page,'return g.player.x');await page.clock.runFor(200);expect(await game(page,'return g.player.x')).toBe(x);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:touches});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
  expect(await page.evaluate(async()=>Object.values((await import('/src/app.js')).input).some(Boolean))).toBe(false);
});
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
test('continues without storage or Web Audio permissions',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
    Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new DOMException('denied','SecurityError');}});
    Object.defineProperty(globalThis,'AudioContext',{configurable:true,value:undefined});
    Object.defineProperty(globalThis,'webkitAudioContext',{configurable:true,value:undefined});
  });
  await page.goto('/');
  await page.getByRole('button',{name:'Enable sound'}).click();
  await expect(page.getByRole('button',{name:'Enable sound'})).toHaveText('Sound off');
  await page.getByRole('button',{name:'Start expedition'}).click();
  expect(await game(page,'return g.state')).toBe('playing');
  expect(errors).toEqual([]);
});
