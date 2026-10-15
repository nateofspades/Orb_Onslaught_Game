import { describe, it, expect } from 'vitest';
import * as E from '../../src/engine.js';
describe('Pang engine', () => {
  it('emits bounded particles on pops and expires them while playing', () => {
    const g=new E.Game();g.start();g.balls=[E.makeBall(480,200,2)];g.shots=[{x:480,y:210,bottom:420}];g.update(.001);
    expect(g.particles.length).toBeGreaterThan(5);expect(g.particles.length).toBeLessThan(100);
    const x=g.particles[0].x;g.update(.05);expect(g.particles[0].x).not.toBe(x);g.update(1);expect(g.particles).toHaveLength(0);
  });
  it('restarts the whole run cleanly even from the final arena', () => {
    const g=new E.Game();g.start();g.loadLevel(4);g.score=999;g.lives=1;g.player.x=30;g.cooldown=2;g.accumulator=.1;g.shots=[{}];g.particles=[{}];
    g.restart();expect(g.level).toBe(0);expect(g.lives).toBe(3);expect(g.score).toBe(0);expect(g.timer).toBe(90);expect(g.player.x).toBe(480);
    expect(g.shots).toEqual([]);expect(g.particles).toEqual([]);expect(g.cooldown).toBe(0);expect(g.accumulator).toBe(0);
  });
  it('advances only after clearing each arena and wins the fifth', () => {
    const g=new E.Game();g.start();
    for(let level=0;level<5;level++) {
      expect(g.level).toBe(level);g.balls=[E.makeBall(480,200,0)];g.shots=[{x:480,y:210,bottom:420}];g.update(.001);
      expect(g.state).toBe(level===4?'victory':'cleared');
      if(level<4){g.nextLevel();expect(g.state).toBe('playing');expect(g.invulnerable).toBeGreaterThan(0);expect(g.shots).toHaveLength(0);}
    }
  });
  it('counts down in simulation time, loses one life per hit, grants grace and ends at zero lives', () => {
    const g=new E.Game();g.start();g.balls=[];g.update(1);expect(g.timer).toBeCloseTo(89);
    g.balls=[{...E.makeBall(g.player.x,400,0),vx:0,vy:0}];g.update(.001);
    expect(g.lives).toBe(2);expect(g.invulnerable).toBeGreaterThan(1);
    g.update(.001);expect(g.lives).toBe(2);
    g.balls=[];g.timer=.001;g.invulnerable=0;g.update(.01);expect(g.lives).toBe(1);expect(g.timer).toBe(90);
    g.timer=.001;g.update(.01);expect(g.lives).toBe(0);expect(g.state).toBe('gameover');
    const t=g.timer;g.update(1);expect(g.timer).toBe(t);
  });
  it('substeps fast balls against thin platforms and ejects embedded splits', () => {
    const g=new E.Game(); g.start(); g.platforms=[{x:100,y:180,w:200,h:12}];
    g.balls=[{...E.makeBall(180,140,0),vy:5000,vx:210}]; g.update(.025);
    expect(g.balls[0].y).toBeLessThan(180-12); expect(g.balls[0].vy).toBeLessThan(0);
    g.balls=[E.makeBall(180,185,2)]; g.shots=[{x:180,y:190,bottom:420}]; g.update(.001);
    for(const b of g.balls) { const p=g.platforms[0]; expect(Math.hypot(b.x-Math.max(p.x,Math.min(p.x+p.w,b.x)),b.y-Math.max(p.y,Math.min(p.y+p.h,b.y)))).toBeGreaterThanOrEqual(b.r-.01); }
    const before=g.balls.map(b=>b.x); for(let i=0;i<120;i++)g.update(1/120);
    expect(g.balls.some((b,i)=>Math.abs(b.x-before[i])>20)).toBe(true);
  });
  it('resolves circle geometry at platform top, side, underside and corner without sticky overlaps', () => {
    const p={x:100,y:100,w:100,h:20};
    for(const [x,y,vx,vy,axis,sign] of [[140,90,30,50,'vy',-1],[90,110,50,0,'vx',-1],[140,130,30,-50,'vy',1],[94,94,50,50,'vx',-1],[140,110,30,50,'vy',-1]]) {
      const b={x,y,vx,vy,r:12,size:0}; E.resolvePlatform(b,p);
      expect(b[axis]*sign).toBeGreaterThan(0);
      const dx=b.x-Math.max(p.x,Math.min(p.x+p.w,b.x)), dy=b.y-Math.max(p.y,Math.min(p.y+p.h,b.y));
      expect(Math.hypot(dx,dy)).toBeGreaterThanOrEqual(11.999);
    }
  });
  it('splits large to medium to faster small spheres and removes smalls for score', () => {
    const g = new E.Game(); g.start(); g.balls=[E.makeBall(480,200,2)];
    g.shots=[{x:480,y:210,bottom:420}]; g.update(.001);
    expect(g.balls.map(b=>b.size)).toEqual([1,1]); expect(g.score).toBe(100);
    expect(g.balls[0].vx).toBe(-155); expect(g.balls[1].vx).toBe(155);
    g.balls=[E.makeBall(480,200,1)]; g.shots=[{x:480,y:210,bottom:420}]; g.update(.001);
    expect(g.balls.map(b=>b.size)).toEqual([0,0]); expect(Math.abs(g.balls[0].vx)).toBe(210);
    g.balls=[E.makeBall(480,200,0)]; g.shots=[{x:480,y:210,bottom:420}]; g.update(.001);
    expect(g.balls).toHaveLength(0); expect(g.score).toBe(600);
  });
  it('fires rising harpoons with cooldown and stops them at platform undersides', () => {
    const g = new E.Game(); g.start(); g.balls=[];
    g.update(.01,{fire:true}); expect(g.shots).toHaveLength(1);
    expect(g.shots[0].x).toBe(g.player.x); const y=g.shots[0].y;
    g.update(.1,{fire:true}); expect(g.shots).toHaveLength(1); expect(g.shots[0].y).toBeLessThan(y);
    g.update(.3,{fire:true}); expect(g.shots).toHaveLength(2);
    g.platforms=[{x:400,y:240,w:160,h:16}]; g.shots=[{x:480,y:300,bottom:405}];
    g.update(.1); expect(g.shots).toHaveLength(0);
  });
  it('loads five distinct arenas with platforms and large bouncing spheres', () => {
    const g = new E.Game(); g.start();
    expect(E.LEVELS).toHaveLength(5);
    expect(new Set(E.LEVELS.map(l=>JSON.stringify(l.platforms))).size).toBe(5);
    expect(g.balls[0].size).toBe(2);
    const ball = g.balls[0]; ball.x=ball.r; ball.vx=-100; ball.y=425-ball.r; ball.vy=100;
    g.update(1/120); expect(ball.vx).toBeGreaterThan(0); expect(ball.vy).toBeLessThan(0);
    expect(ball.y+ball.r).toBeLessThanOrEqual(425);
  });
  it('runs fixed 120Hz simulation independent of frame rate and caps background catch-up', () => {
    const a = new E.Game(), b = new E.Game(); a.start(); b.start(); a.invulnerable=99; b.invulnerable=99;
    for(let i=0;i<60;i++) a.advance(1/60,{left:true});
    for(let i=0;i<30;i++) b.advance(1/30,{left:true});
    expect(a.balls).toEqual(b.balls); expect(a.timer).toBeCloseTo(89); expect(a.timer).toBe(b.timer);
    expect(a.player.x).toBeCloseTo(b.player.x); expect(a.player.x).toBeCloseTo(180);
    b.advance(20, {right:true}); expect(b.player.x).toBeCloseTo(255);
  });
  it('moves at 300 units per second, clamps boundaries, and freezes while paused', () => {
    const g = new E.Game(); g.start();
    g.update(0.1, {right:true}); expect(g.player.x).toBeCloseTo(510);
    g.update(10, {right:true}); expect(g.player.x).toBe(822);
    g.update(10, {left:true}); expect(g.player.x).toBe(18);
    g.pause(); g.update(1,{right:true}); expect(g.player.x).toBe(18);
  });
  it('starts ready with three lives then starts and pauses explicitly', () => {
    const g = new E.Game();
    expect(g.state).toBe('ready'); expect(g.lives).toBe(3);
    g.start(); expect(g.state).toBe('playing');
    g.pause(); expect(g.state).toBe('paused');
    g.resume(); expect(g.state).toBe('playing');
    g.restart(); expect(g.lives).toBe(3); expect(g.score).toBe(0);
  });
});
