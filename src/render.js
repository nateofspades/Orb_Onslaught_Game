import {WIDTH,HEIGHT,FLOOR} from './engine.js';
const colors=['#a3edd9','#f5ba83','#fa8994'];
export function draw(ctx,g,time=0){
  const c=ctx; c.clearRect(0,0,WIDTH,HEIGHT);
  const sky=c.createLinearGradient(0,0,0,450);sky.addColorStop(0,'#12243d');sky.addColorStop(.6,'#214250');sky.addColorStop(1,'#366064');c.fillStyle=sky;c.fillRect(0,0,WIDTH,HEIGHT);
  // Aurora ribbons: soft, layered bands, no image assets or external fonts.
  for(let j=0;j<5;j++){c.beginPath();for(let x=0;x<=840;x+=20){const y=90+j*13+Math.sin(x/160+time*.12+j*.18)*36;x===0?c.moveTo(x,y):c.lineTo(x,y);}for(let x=840;x>=0;x-=20)c.lineTo(x,122+j*12+Math.sin(x/160+time*.12+j*.18)*36);c.closePath();c.fillStyle=`rgba(103,228,194,${.025+j*.008})`;c.fill();}
  for(let i=0;i<60;i++){c.fillStyle=`rgba(218,246,244,${.2+(i%5)*.12})`;c.fillRect((i*137+23)%840,(i*71+18)%240,i%7===0?2:1,i%7===0?2:1);}
  c.fillStyle='#d6eee0';c.beginPath();c.arc(701,74,23,0,Math.PI*2);c.fill();c.fillStyle='#aacfc744';c.beginPath();c.arc(694,68,6,0,7);c.fill();
  mountain(c,[[0,300],[75,209],[140,271],[243,150],[345,283],[453,191],[570,289],[681,166],[840,312]],'#213b4c',true);
  mountain(c,[[0,343],[111,280],[210,345],[349,260],[489,352],[609,273],[751,335],[840,285]],'#193540');
  // Distant pines and a frozen observation base.
  c.fillStyle='#122f37';for(let i=0;i<28;i++){const x=i*34-20,h=25+(i*19)%45;c.beginPath();c.moveTo(x,398-h);c.lineTo(x-15,403);c.lineTo(x+15,403);c.fill();}
  c.fillStyle='#a4c7c3';c.fillRect(0,FLOOR,840,3);c.fillStyle='#17313a';c.fillRect(0,FLOOR+3,840,22);c.fillStyle='#31515a';for(let x=0;x<840;x+=42)c.fillRect(x,FLOOR+13,22,1);
  for(const p of g.platforms||[]){c.fillStyle='#102b37';c.fillRect(p.x,p.y,p.w,p.h);c.fillStyle='#b4e5d6';c.fillRect(p.x,p.y,p.w,3);c.fillStyle='#4d8f8b';c.fillRect(p.x,p.y+3,p.w,4);for(let x=p.x+10;x<p.x+p.w;x+=25){c.fillStyle='#88bfb3';c.fillRect(x,p.y+10,6,2);}}
  // Ring-headed pulse with a travelling light tether: render-only, unchanged shot geometry.
  for(const s of g.shots){
    c.shadowBlur=10;c.shadowColor='#c1ffe6';c.strokeStyle='#bcf9df55';c.lineWidth=1;
    c.beginPath();c.moveTo(s.x,s.bottom);c.lineTo(s.x,s.y);c.stroke();
    c.setLineDash([3,7]);c.lineDashOffset=-time*24;c.strokeStyle='#bcf9df';c.lineWidth=2;c.stroke();c.setLineDash([]);c.lineDashOffset=0;
    c.strokeStyle='#f4ffe9';c.beginPath();c.arc(s.x,s.y,5,0,Math.PI*2);c.stroke();
    c.strokeStyle='#bcf9df66';c.lineWidth=1;c.beginPath();c.arc(s.x,s.y,9,0,Math.PI*2);c.stroke();c.shadowBlur=0;
  }
  for(const b of g.balls||[]){const col=colors[b.size];c.shadowColor=col;c.shadowBlur=14;const grad=c.createRadialGradient(b.x-b.r*.35,b.y-b.r*.4,1,b.x,b.y,b.r);grad.addColorStop(0,'#e5fff0');grad.addColorStop(.18,col);grad.addColorStop(.85,b.size===2?'#8f3d62':b.size===1?'#987047':'#387e7c');grad.addColorStop(1,'#203943');c.fillStyle=grad;c.beginPath();c.arc(b.x,b.y,b.r,0,Math.PI*2);c.fill();c.shadowBlur=0;c.strokeStyle=col;c.lineWidth=1.4;c.stroke();c.strokeStyle='#ffffff3b';c.beginPath();c.ellipse(b.x,b.y,b.r*.7,b.r*.24,-.4,0,Math.PI*2);c.stroke();c.fillStyle='#ffffff85';c.beginPath();c.ellipse(b.x-b.r*.29,b.y-b.r*.38,b.r*.16,b.r*.09,-.6,0,7);c.fill();}
  const p=g.player;c.save();if(g.invulnerable>0 && Math.floor(time*12)%2)c.globalAlpha=.45;c.translate(p.x,405);
  c.fillStyle='#071f2a66';c.beginPath();c.ellipse(0,20,22,4,0,0,7);c.fill();c.fillStyle='#15303b';c.fillRect(-12,8,9,12);c.fillRect(4,8,9,12);c.fillStyle='#d7b68d';c.fillRect(-12,17,10,4);c.fillRect(4,17,10,4);c.fillStyle='#edaa76';c.beginPath();c.roundRect(-14,-9,28,24,6);c.fill();c.fillStyle='#ffe0ad';c.fillRect(-3,-8,6,20);c.fillStyle='#4e7476';c.fillRect(-20,-5,7,14);c.fillRect(13,-5,7,14);c.fillStyle='#d1e4da';c.beginPath();c.arc(0,-17,14,0,7);c.fill();c.fillStyle='#173f50';c.beginPath();c.roundRect(-10,-23,20,12,5);c.fill();c.fillStyle='#89dcca';c.fillRect(-7,-21,11,3);c.fillStyle='#f9d4a4';c.fillRect(-4,-32,8,4);c.restore();
  for(const p of g.particles||[]){c.globalAlpha=Math.max(0,p.life/.6);c.fillStyle=colors[p.size];c.fillRect(p.x-2,p.y-2,4,4);}c.globalAlpha=1;
}
function mountain(c,pts,color,snow=false){c.fillStyle=color;c.beginPath();c.moveTo(0,425);for(const [x,y]of pts)c.lineTo(x,y);c.lineTo(840,425);c.closePath();c.fill();if(snow){for(let i=1;i<pts.length-1;i++){const [x,y]=pts[i];if(y>230)continue;c.fillStyle='#86a4aa';c.beginPath();c.moveTo(x,y);c.lineTo(x-27,y+37);c.lineTo(x-5,y+26);c.lineTo(x+8,y+36);c.lineTo(x+31,y+39);c.fill();}}}
