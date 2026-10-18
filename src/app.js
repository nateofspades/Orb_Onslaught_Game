import {Game,LEVELS,WIDTH,HEIGHT} from './engine.js';
import {draw} from './render.js';
import {applyLayout} from './layout.js';
import {MusicController} from './music.js';
import {readHighScore,writeHighScore} from './storage.js';

export const game=new Game();
game.loadLevel(0);
export const input={left:false,right:false,fire:false};
const $=id=>document.getElementById(id);
const canvas=document.querySelector('canvas');
const ctx=canvas.getContext('2d');
const shell=document.querySelector('.shell');
function browserStorage(){try{return globalThis.localStorage;}catch{return undefined;}}
const storage=browserStorage();
const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;
export const music=new MusicController({AudioContext:Audio,storage});
let best=readHighScore(storage);

function resizeCanvas(){
  const rect=canvas.getBoundingClientRect();
  const dpr=Math.min(devicePixelRatio||1,3);
  const width=Math.max(1,Math.round(rect.width*dpr));
  const height=Math.max(1,Math.round(rect.height*dpr));
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  ctx.setTransform(width/WIDTH,0,0,height/HEIGHT,0,0);
}
function viewportSize(){
  const viewport=globalThis.visualViewport;
  return {
    width:document.documentElement.clientWidth||viewport?.width||globalThis.innerWidth,
    height:viewport?.height||document.documentElement.clientHeight||globalThis.innerHeight,
  };
}
function responsiveLayout(){const {width,height}=viewportSize();applyLayout(shell,width,height);resizeCanvas();}
new ResizeObserver(resizeCanvas).observe(canvas);
window.addEventListener('resize',responsiveLayout);
window.addEventListener('orientationchange',responsiveLayout);
window.addEventListener('pageshow',responsiveLayout);
globalThis.visualViewport?.addEventListener('resize',responsiveLayout);
responsiveLayout();

function musicLabel(){
  $('music').textContent=music.enabled?'Music on':'Music off';
  $('music').setAttribute('aria-label',music.enabled?'Turn music off':'Turn music on');
  $('music').setAttribute('aria-pressed',String(music.enabled));
}
async function beginMusic(){await music.start();}
window.addEventListener('pointerdown',beginMusic,{capture:true});
window.addEventListener('pointerup',beginMusic,{capture:true});
window.addEventListener('click',beginMusic,{capture:true});
window.addEventListener('keydown',event=>{if(!event.repeat)beginMusic();},{capture:true});
$('music').addEventListener('click',()=>{music.toggle();musicLabel();});
musicLabel();

const keys=new Set();
const pointers=new Map();
function refreshKeys(){
  for(const [name,codes] of Object.entries({left:['ArrowLeft','KeyA'],right:['ArrowRight','KeyD'],fire:['Space']})){
    input[name]=codes.some(code=>keys.has(code))||[...pointers.values()].includes(name);
  }
}
for(const name of ['left','right','fire']){
  const button=$(name);
  button.addEventListener('pointerdown',event=>{
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId,name);
    button.classList.add('held');
    refreshKeys();
  });
  const release=event=>{
    pointers.delete(event.pointerId);
    button.classList.toggle('held',[...pointers.values()].includes(name));
    refreshKeys();
  };
  button.addEventListener('pointerup',release);
  button.addEventListener('pointercancel',release);
  button.addEventListener('lostpointercapture',release);
}
window.addEventListener('keydown',event=>{
  if(['ArrowLeft','ArrowRight','KeyA','KeyD','Space'].includes(event.code)){
    event.preventDefault();keys.add(event.code);refreshKeys();
  }
});
window.addEventListener('keyup',event=>{keys.delete(event.code);refreshKeys();});
function clearInput(){
  keys.clear();pointers.clear();
  document.querySelectorAll('.held').forEach(button=>button.classList.remove('held'));
  for(const key of Object.keys(input))input[key]=false;
}
function togglePause(){
  if(game.state==='playing')game.pause();else if(game.state==='paused')game.resume();
  clearInput();sync();
}
window.addEventListener('keydown',event=>{
  if(event.repeat)return;
  if(event.code==='KeyP'||event.code==='Escape'){event.preventDefault();togglePause();}
  if(event.code==='KeyR'){clearInput();game.restart();sync();}
});
window.addEventListener('blur',()=>{game.pause();clearInput();sync();});
document.addEventListener('visibilitychange',()=>{
  music.handleVisibility(document.hidden);
  if(document.hidden){game.pause();clearInput();previous=undefined;sync();}
});
$('pause').addEventListener('click',togglePause);
$('restart').addEventListener('click',()=>{clearInput();game.restart();sync();});
$('help').addEventListener('click',()=>{
  game.pause();clearInput();sync();
  $('title').textContent='Field guide';
  $('message').textContent='Move with A / D or arrows. Hold Space or FIRE to shoot. Large spheres split twice. Small spheres move faster. Avoid all spheres. Platforms block pulses. Clear five sectors before time runs out. P / Esc pauses; R restarts. Touch: hold a direction and FIRE together.';
});
$('primary').addEventListener('click',()=>{
  clearInput();
  if(game.state==='paused')game.resume();
  else if(game.state==='cleared')game.nextLevel();
  else if(['gameover','victory'].includes(game.state))game.restart();
  else game.start();
  sync();
});

let previous;
let oldScore=0;
function frame(now){
  const dt=previous===undefined?0:(now-previous)/1000;
  previous=now;
  game.advance(dt,input);
  if(game.score!==oldScore){best=Math.max(best,game.score);writeHighScore(storage,best);oldScore=game.score;}
  resizeCanvas();draw(ctx,game,now/1000);sync();requestAnimationFrame(frame);
}
function sync(){
  $('score').textContent=String(game.score).padStart(5,'0');
  $('best').textContent=String(best).padStart(5,'0');
  $('timer').textContent=Math.ceil(game.timer);
  $('sector').textContent=`0${game.level+1} / 05`;
  $('lives').textContent='♥ '.repeat(game.lives).trim()||'—';
  $('lives').setAttribute('aria-label',`${game.lives} lives`);
  $('level-name').textContent=`0${game.level+1} — ${LEVELS[game.level].name.toUpperCase()}`;
  $('overlay').hidden=game.state==='playing';
  $('pause').setAttribute('aria-label',game.state==='paused'?'Resume game':'Pause game');
  if(sync.state!==game.state){
    sync.state=game.state;
    music.setGamePaused(game.state==='paused');
    const views={
      ready:['ARCADE / EXPEDITION 001','Chase the aurora.','Split the spheres. Keep your footing. Five sectors. Three lives. One expedition.','Start expedition'],
      paused:['EXPEDITION ON HOLD','Take a breath.','Your expedition is paused. Resume when you are ready.','Resume expedition'],
      cleared:['SECTOR SECURED','Clear skies ahead.','All spheres cleared. The next sector awaits.','Next sector'],
      gameover:['SIGNAL LOST','Expedition over.','Three lives spent. Every expedition teaches you something. Try again.','Try again'],
      victory:['ALL SECTORS SECURED','You found the aurora.','Five sectors cleared. The night belongs to you.','Play again'],
    };
    if(views[game.state]){
      const [eyebrow,title,message,primary]=views[game.state];
      $('eyebrow').textContent=eyebrow;$('title').textContent=title;$('message').textContent=message;$('primary').textContent=primary;
    }
    if(game.state!=='playing')clearInput();
  }
}
requestAnimationFrame(frame);
