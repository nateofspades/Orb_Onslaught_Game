import {it, expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {draw} from '../../src/render.js';
it('renders a circular pulse head instead of a pointed harpoon while preserving model data',()=>{
  const calls=[];
  const gradient={addColorStop(){}};
  const ctx=new Proxy({}, {get(target,key){
    if(key==='createLinearGradient'||key==='createRadialGradient')return ()=>gradient;
    return (...args)=>calls.push([key,...args]);
  },set(target,key,value){target[key]=value;return true;}});
  const game={platforms:[],shots:[{x:321,y:123,bottom:400}],balls:[],player:{x:420},particles:[],invulnerable:0};
  const before=JSON.stringify(game);draw(ctx,game,0);
  expect(JSON.stringify(game)).toBe(before);
  expect(calls.some(([name,x,y,r])=>name==='arc'&&x===321&&y===123&&r===5)).toBe(true);
  expect(calls.some(([name,x,y])=>name==='lineTo'&&x===316&&y===126)).toBe(false);
});
it('uses only a neutral private title in public-facing markup',()=>{
 const html=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
 expect(html).toContain('<title>Aurora Field Study');
 expect(html).not.toMatch(/Pang|PANG|Orb Splitter/);
});
