import {test,expect} from '@playwright/test';
async function boot(page){await page.clock.install({time:new Date('2026-01-01T00:00:00Z')});await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));await page.goto('/');}
async function game(page,fn){return page.evaluate(async src=>{const {game}=await import('/src/app.js');return (new Function('g',src))(game);},fn);}
for(const [width,height]of [[1920,1080],[1366,768],[768,1024],[390,844],[320,568],[844,390],[568,320],[480,320],[440,320]])test(`responsive DPR arena and accessible controls ${width}x${height}`,async({browser})=>{
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:2});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('requestfailed',r=>errors.push(r.url()));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
 await page.goto('http://127.0.0.1:4173/');
 const dimensions=await page.locator('canvas').evaluate(c=>({w:c.width,h:c.height,rect:c.getBoundingClientRect().toJSON(),dpr:devicePixelRatio,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight}));
 expect(dimensions.w).toBe(Math.round(dimensions.rect.width*2));expect(dimensions.h).toBe(Math.round(dimensions.rect.height*2));expect(dimensions.sw).toBeLessThanOrEqual(width);expect(dimensions.sh).toBeLessThanOrEqual(height);
 expect(dimensions.rect.width/dimensions.rect.height).toBeCloseTo(840/450,2);
 const boxes=await page.evaluate(()=>Object.fromEntries(['primary','left','right','fire','pause','restart','help','music'].map(id=>[id,document.getElementById(id).getBoundingClientRect().toJSON()]).concat([['hud',document.querySelector('.hud').getBoundingClientRect().toJSON()]])));
 for(const r of Object.values(boxes)){expect(r.x).toBeGreaterThanOrEqual(0);expect(r.y).toBeGreaterThanOrEqual(0);expect(r.x+r.width).toBeLessThanOrEqual(width);expect(r.y+r.height).toBeLessThanOrEqual(height);}
 expect(Math.min(boxes.left.y,boxes.right.y,boxes.fire.y)).toBeGreaterThanOrEqual(dimensions.rect.y+dimensions.rect.height);
 expect(await page.locator('#left').evaluate(element=>getComputedStyle(element).touchAction)).toBe('none');
 if(width<=844&&(width<=600||height<=480)){for(const id of ['left','right','fire'])expect(boxes[id].height).toBeGreaterThanOrEqual(64);expect(boxes.left.width).toBeGreaterThanOrEqual(64);expect(boxes.right.width).toBeGreaterThanOrEqual(64);}
 if(height<=480&&width>height){const ids=['left','right','pause','restart','music','help','fire'];for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){const a=boxes[ids[i]],b=boxes[ids[j]],overlap=a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;expect(overlap,`${ids[i]} overlaps ${ids[j]}`).toBe(false);}}
 if(width===844){expect(boxes.left.x).toBeLessThan(width/2);expect(boxes.fire.x).toBeGreaterThan(width/2);expect(dimensions.rect.width).toBeGreaterThanOrEqual(520);expect(await page.evaluate(()=>['pause','restart'].every(id=>getComputedStyle(document.getElementById(id)).visibility==='visible'))).toBe(true);}
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
test('music starts only after interaction and keeps one transport through UI and orientation changes',async({page})=>{
  await page.goto('/');
  const snapshot=()=>page.evaluate(async()=>(await import('/src/app.js')).music.snapshot());
  expect((await snapshot()).started).toBe(false);
  await expect(page.getByRole('button',{name:'Turn music off'})).toHaveText('Music on');
  await page.getByRole('button',{name:'Start expedition'}).click();
  await expect.poll(async()=>(await snapshot()).started).toBe(true);
  const initial=await snapshot();
  await page.getByRole('button',{name:'Pause game'}).click();
  await page.getByRole('button',{name:'Restart game'}).click();
  await page.getByRole('button',{name:'Turn music off'}).click();
  const muted=await snapshot();
  expect(muted.enabled).toBe(false);
  expect(muted.contextId).toBe(initial.contextId);
  await page.setViewportSize({width:844,height:390});
  await page.waitForTimeout(150);
  const changed=await snapshot();
  expect(changed.contextId).toBe(initial.contextId);
  expect(changed.step).toBeGreaterThanOrEqual(muted.step);
  expect(await game(page,'return g.state')).toBe('playing');
  expect(await page.evaluate(()=>localStorage.getItem('pang.music'))).toBe('off');
  await page.reload();
  await expect(page.getByRole('button',{name:'Turn music on'})).toHaveText('Music off');
});

test('visibility interruption suspends and resumes music without resetting it',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Start expedition'}).click();
  const snapshot=()=>page.evaluate(async()=>(await import('/src/app.js')).music.snapshot());
  const before=await snapshot();
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  await expect.poll(async()=>(await snapshot()).state).toBe('suspended');
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});
  await expect.poll(async()=>(await snapshot()).state).toBe('running');
  const after=await snapshot();expect(after.contextId).toBe(before.contextId);expect(after.step).toBeGreaterThanOrEqual(before.step);
});

test('first touchscreen tap resumes music at the touch activation phase',async({page,context})=>{
  await page.addInitScript(()=>{
    globalThis.__activationEvent='none';
    for(const type of ['pointerdown','pointerup','click'])addEventListener(type,()=>{globalThis.__activationEvent=type;},{capture:true});
    class Param{constructor(value=0){this.value=value;}setValueAtTime(value){this.value=value;}linearRampToValueAtTime(value){this.value=value;}exponentialRampToValueAtTime(value){this.value=value;}cancelScheduledValues(){}}
    class Node{connect(){return this;}}
    class ActivationAudioContext{
      constructor(){this.currentTime=0;this.state='suspended';this.destination=new Node();}
      createGain(){const node=new Node();node.gain=new Param(1);return node;}
      createOscillator(){const node=new Node();node.frequency=new Param();node.start=()=>{};node.stop=()=>{};return node;}
      resume(){if(!['pointerup','click'].includes(globalThis.__activationEvent))return Promise.reject(new Error('activation required'));this.state='running';return Promise.resolve();}
      suspend(){this.state='suspended';return Promise.resolve();}
    }
    Object.defineProperty(globalThis,'AudioContext',{configurable:true,value:ActivationAudioContext});
  });
  await page.goto('/');
  const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  const box=await page.locator('#primary').boundingBox(),touch={id:1,x:box.x+box.width/2,y:box.y+box.height/2};
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[touch]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect.poll(()=>page.evaluate(async()=>(await import('/src/app.js')).music.snapshot().state)).toBe('running');
});

test('continues without storage or Web Audio permissions',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
    Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw new DOMException('denied','SecurityError');}});
    Object.defineProperty(globalThis,'AudioContext',{configurable:true,value:undefined});
    Object.defineProperty(globalThis,'webkitAudioContext',{configurable:true,value:undefined});
  });
  await page.goto('/');
  await page.getByRole('button',{name:'Start expedition'}).click();
  expect(await game(page,'return g.state')).toBe('playing');
  expect(await page.evaluate(async()=>(await import('/src/app.js')).music.snapshot().started)).toBe(false);
  await expect(page.getByRole('button',{name:/Turn music/})).toBeVisible();
  await expect(page.getByRole('button',{name:/sound/i})).toHaveCount(0);
  expect(errors).toEqual([]);
});
