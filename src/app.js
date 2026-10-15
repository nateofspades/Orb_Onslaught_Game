import {Game,LEVELS,WIDTH,HEIGHT} from './engine.js';
import {draw} from './render.js';
export const game=new Game();game.loadLevel(0);
export const input={left:false,right:false,fire:false};
const $=id=>document.getElementById(id),canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
const keys=new Set();
function refreshKeys(){input.left=keys.has('ArrowLeft')||keys.has('KeyA');input.right=keys.has('ArrowRight')||keys.has('KeyD');input.fire=keys.has('Space');}
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','KeyA','KeyD','Space'].includes(e.code)){e.preventDefault();keys.add(e.code);refreshKeys();}});
window.addEventListener('keyup',e=>{keys.delete(e.code);refreshKeys();});
function clearInput(){keys.clear();for(const k of Object.keys(input)) input[k]=false;}
function togglePause(){if(game.state==='playing')game.pause();else if(game.state==='paused')game.resume();clearInput();sync();}
window.addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='KeyP'||e.code==='Escape'){e.preventDefault();togglePause();}if(e.code==='KeyR'){clearInput();game.restart();sync();}});
window.addEventListener('blur',()=>{game.pause();clearInput();sync();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){game.pause();clearInput();previous=undefined;sync();}});
$('pause').addEventListener('click',togglePause);
$('restart').addEventListener('click',()=>{clearInput();game.restart();sync();});
$('help').addEventListener('click',()=>{game.pause();clearInput();sync();$('title').textContent='Field guide';$('message').textContent='Move with A / D or arrows. Hold Space or FIRE to shoot. Large spheres split twice. Small spheres move faster. Avoid all spheres. Platforms block harpoons. Clear five sectors before time runs out. P / Esc pauses; R restarts. Touch: hold a direction and FIRE together.';});
$('primary').addEventListener('click',()=>{clearInput();if(game.state==='paused')game.resume();else if(game.state==='cleared')game.nextLevel();else if(['gameover','victory'].includes(game.state))game.restart();else game.start();sync();});
let previous;
function frame(now){const dt=previous===undefined?0:(now-previous)/1000;previous=now;game.advance(dt,input);draw(ctx,game,now/1000);sync();requestAnimationFrame(frame);}
function sync(){
  $('score').textContent=String(game.score).padStart(5,'0');$('timer').textContent=Math.ceil(game.timer);$('sector').textContent=`0${game.level+1} / 05`;
  $('lives').textContent='♥ '.repeat(game.lives).trim()||'—';$('lives').setAttribute('aria-label',`${game.lives} lives`);
  $('level-name').textContent=`0${game.level+1} — ${LEVELS[game.level].name.toUpperCase()}`;
  $('overlay').hidden=game.state==='playing';
  $('pause').setAttribute('aria-label',game.state==='paused'?'Resume game':'Pause game');
  if(sync.state!==game.state){
    sync.state=game.state;
    const views={ready:['ARCADE / EXPEDITION 001','Chase the aurora.','Split the spheres. Keep your footing. Five sectors. Three lives. One expedition.','Start expedition'],paused:['EXPEDITION ON HOLD','Take a breath.','Your expedition is paused. Resume when you are ready.','Resume expedition'],cleared:['SECTOR SECURED','Clear skies ahead.','All spheres cleared. The next sector awaits.','Next sector'],gameover:['SIGNAL LOST','Expedition over.','Three lives spent. Every expedition teaches you something. Try again.','Try again'],victory:['ALL SECTORS SECURED','You found the aurora.','Five sectors cleared. The night belongs to you.','Play again']};
    if(views[game.state]){const [a,b,c,d]=views[game.state];$('eyebrow').textContent=a;$('title').textContent=b;$('message').textContent=c;$('primary').textContent=d;}
    if(game.state!=='playing')clearInput();
  }
}
requestAnimationFrame(frame);
