export const WIDTH = 840, HEIGHT = 450, FLOOR = 425;
export const RADII = [12, 23, 40], SPEEDS = [210, 155, 110], BOUNCES = [270, 355, 440];
export const LEVELS = [
  {name:'First light', platforms:[], spawns:[[160,100,2],[680,140,2]], time:90},
  {name:'The crossing', platforms:[{x:330,y:240,w:180,h:16}], spawns:[[150,90,2],[660,100,2],[420,70,1]], time:100},
  {name:'Twin peaks', platforms:[{x:130,y:260,w:160,h:16},{x:550,y:210,w:160,h:16}], spawns:[[100,70,2],[420,100,2],[730,80,1]], time:110},
  {name:'Skyline', platforms:[{x:90,y:170,w:170,h:16},{x:335,y:275,w:170,h:16},{x:580,y:170,w:170,h:16}], spawns:[[160,65,2],[420,100,2],[680,65,2]], time:120},
  {name:'Aurora', platforms:[{x:180,y:220,w:120,h:16},{x:360,y:140,w:120,h:16},{x:540,y:220,w:120,h:16}], spawns:[[90,80,2],[320,70,2],[520,70,2],[750,80,2]], time:140}
];
export function makeBall(x,y,size,direction=1) { return {x,y,size,r:RADII[size],vx:SPEEDS[size]*direction,vy:-120}; }
export function resolvePlatform(b,p) {
  let dx=b.x-Math.max(p.x,Math.min(p.x+p.w,b.x)), dy=b.y-Math.max(p.y,Math.min(p.y+p.h,b.y));
  let d=Math.hypot(dx,dy);
  if(d>=b.r) return;
  if(d===0) {
    const faces=[{d:b.y-p.y,nx:0,ny:-1},{d:p.y+p.h-b.y,nx:0,ny:1},{d:b.x-p.x,nx:-1,ny:0},{d:p.x+p.w-b.x,nx:1,ny:0}].sort((a,c)=>a.d-c.d);
    const f=faces[0]; dx=f.nx; dy=f.ny; b.x+=dx*(f.d+b.r+.001); b.y+=dy*(f.d+b.r+.001);
  } else {dx/=d;dy/=d;b.x+=dx*(b.r-d+.001);b.y+=dy*(b.r-d+.001);}
  const dot=b.vx*dx+b.vy*dy;
  if(dot<0) { b.vx-=2*dot*dx; b.vy-=2*dot*dy; }
  if(dy<-.7) b.vy=-BOUNCES[b.size];
  b.vx=(b.vx<0?-1:1)*SPEEDS[b.size];
}
export class Game {
  constructor() { this.state = 'ready'; this.lives = 3; this.score = 0; this.shots=[]; this.player = {x:480, y:405, w:36, h:40}; }
  update(dt, input = {}) {
    if(this.state !== 'playing') return;
    this.particles=(this.particles||[]).filter(p=>{p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=200*dt;return p.life>0;});
    this.invulnerable=Math.max(0,(this.invulnerable||0)-dt);
    this.timer-=dt;
    if(this.timer<=0) {this.loseLife();return;}
    this.player.x = Math.max(18, Math.min(822, this.player.x + ((+!!input.right) - (+!!input.left)) * 300 * dt));
    this.cooldown = Math.max(0, (this.cooldown || 0) - dt);
    if(input.fire && this.cooldown === 0) { this.shots.push({x:this.player.x,y:385,bottom:420}); this.cooldown=.32; }
    this.shots = this.shots.filter(s=> {
      const previous=s.y; s.y-=720*dt;
      return s.y>0 && !this.platforms.some(p=>s.x>=p.x && s.x<=p.x+p.w && previous>=p.y+p.h && s.y<=p.y+p.h);
    });
    for (const b of this.balls) {
      const steps=Math.max(1,Math.ceil((Math.hypot(b.vx,b.vy)*dt+620*dt*dt)/Math.min(6,b.r/2)));
      const h=dt/steps;
      for(let i=0;i<steps;i++) {
        b.vy += 620*h; b.x += b.vx*h; b.y += b.vy*h;
        if(b.x < b.r) {b.x=b.r; b.vx=Math.abs(b.vx);}
        if(b.x > WIDTH-b.r) {b.x=WIDTH-b.r; b.vx=-Math.abs(b.vx);}
        if(b.y < b.r) {b.y=b.r; b.vy=Math.abs(b.vy);}
        if(b.y > FLOOR-b.r) {b.y=FLOOR-b.r; b.vy=-BOUNCES[b.size];}
        for(const p of this.platforms) resolvePlatform(b,p);
      }
    }
    for (const s of [...this.shots]) {
      const b=this.balls.find(b=>Math.hypot(b.x-s.x, b.y-Math.max(s.y,Math.min(s.bottom,b.y)))<=b.r+2);
      if(!b) continue;
      this.shots.splice(this.shots.indexOf(s),1); this.balls.splice(this.balls.indexOf(b),1);
      this.score += (3-b.size)*100;
      for(let i=0;i<14;i++) {const angle=i*Math.PI*2/14;this.particles.push({x:b.x,y:b.y,vx:Math.cos(angle)*100,vy:Math.sin(angle)*100,life:.6,size:b.size});}
      this.particles=this.particles.slice(-140);
      if(b.size>0) this.balls.push(makeBall(b.x-3,b.y,b.size-1,-1),makeBall(b.x+3,b.y,b.size-1,1));
      if(this.balls.length===0) this.state=this.level===4?'victory':'cleared';
    }
    if(!this.invulnerable && this.balls.some(b=>Math.hypot(b.x-Math.max(this.player.x-16,Math.min(this.player.x+16,b.x)),b.y-Math.max(388,Math.min(423,b.y)))<b.r)) this.loseLife();
  }
  loseLife() {
    this.lives--; this.invulnerable=2.5; this.player.x=480; this.shots=[];
    this.timer=LEVELS[this.level].time;
    if(this.lives<=0) this.state='gameover';
  }
  advance(dt, input = {}) {
    this.accumulator = (this.accumulator || 0) + Math.max(0, Math.min(0.25, dt));
    while(this.accumulator + 1e-10 >= 1/120) { this.update(1/120,input); this.accumulator -= 1/120; }
  }
  loadLevel(index) { this.level = index; this.platforms = LEVELS[index].platforms; this.balls = LEVELS[index].spawns.map(([x,y,s],i)=>makeBall(x,y,s,i%2?-1:1)); this.timer=LEVELS[index].time; }
  nextLevel() { if(this.state!=='cleared')return; this.loadLevel(this.level+1); this.shots=[]; this.cooldown=0; this.accumulator=0; this.player.x=480; this.invulnerable=2; this.state='playing'; }
  start() { if(!this.balls) this.loadLevel(0); this.state = 'playing'; }
  pause() { if (this.state === 'playing') this.state = 'paused'; }
  resume() { if (this.state === 'paused') this.state = 'playing'; }
  restart() { this.lives=3;this.score=0;this.shots=[];this.particles=[];this.cooldown=0;this.accumulator=0;this.invulnerable=2;this.player.x=480;this.loadLevel(0);this.start(); }
}
