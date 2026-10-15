import {Game,LEVELS,WIDTH,HEIGHT} from './engine.js';
import {draw} from './render.js';
import {readHighScore,writeHighScore} from './storage.js';
export const game=new Game();game.loadLevel(0);
export const input={left:false,right:false,fire:false};
const $=id=>document.getElementById(id),canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
function browserStorage(){try{return globalThis.localStorage;}catch{return undefined;}}
const storage=browserStorage();
let best=readHighScore(storage),soundEnabled=false,audio;
function resizeCanvas(){const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,3),w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}ctx.setTransform(w/WIDTH,0,0,h/HEIGHT,0,0);}
new ResizeObserver(resizeCanvas).observe(canvas);window.addEventListener('resize',resizeCanvas);resizeCanvas();
function soundLabel(){$('sound').textContent=soundEnabled?'Sound on':'Sound off';$('sound').setAttribute('aria-label',soundEnabled?'Disable sound':'Enable sound');$('sound').setAttribute('aria-pressed',String(soundEnabled));}
function tone(frequency,duration=.06){if(!soundEnabled||!audio)return;try{const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.055,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);oscillator.connect(gain).connect(audio.destination);oscillator.start();oscillator.stop(audio.currentTime+duration);}catch{/* Audio is optional. */}}
$('sound').addEventListener('click',async()=>{if(soundEnabled){soundEnabled=false;soundLabel();return;}try{const Audio=globalThis.AudioContext||globalThis.webkitAudioContext;if(typeof Audio!=='function')throw new Error('Web Audio unavailable');audio??=new Audio();await audio.resume();soundEnabled=true;soundLabel();tone(660,.08);}catch{soundEnabled=false;audio=undefined;soundLabel();}});
const keys=new Set(), pointers=new Map();
function refreshKeys(){for(const [name,codes]of Object.entries({left:['ArrowLeft','KeyA'],right:['ArrowRight','KeyD'],fire:['Space']}))input[name]=codes.some(c=>keys.has(c))||[...pointers.values()].includes(name);}
for(const name of ['left','right','fire']){
  const button=$(name);
  button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);pointers.set(e.pointerId,name);button.classList.add('held');refreshKeys();});
  const release=e=>{pointers.delete(e.pointerId);button.classList.remove('held');refreshKeys();};
  button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);
}
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','KeyA','KeyD','Space'].includes(e.code)){e.preventDefault();keys.add(e.code);refreshKeys();}});
window.addEventListener('keyup',e=>{keys.delete(e.code);refreshKeys();});
function clearInput(){keys.clear();pointers.clear();document.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));for(const k of Object.keys(input)) input[k]=false;}
function togglePause(){if(game.state==='playing')game.pause();else if(game.state==='paused')game.resume();clearInput();sync();}
window.addEventListener('keydown',e=>{if(e.repeat)return;if(e.code==='KeyP'||e.code==='Escape'){e.preventDefault();togglePause();}if(e.code==='KeyR'){clearInput();game.restart();sync();}});
window.addEventListener('blur',()=>{game.pause();clearInput();sync();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){game.pause();clearInput();previous=undefined;sync();}});
$('pause').addEventListener('click',togglePause);
$('restart').addEventListener('click',()=>{clearInput();game.restart();sync();});
$('help').addEventListener('click',()=>{game.pause();clearInput();sync();$('title').textContent='Field guide';$('message').textContent='Move with A / D or arrows. Hold Space or FIRE to shoot. Large spheres split twice. Small spheres move faster. Avoid all spheres. Platforms block harpoons. Clear five sectors before time runs out. P / Esc pauses; R restarts. Touch: hold a direction and FIRE together.';});
$('primary').addEventListener('click',()=>{clearInput();if(game.state==='paused')game.resume();else if(game.state==='cleared')game.nextLevel();else if(['gameover','victory'].includes(game.state))game.restart();else game.start();sync();});
let previous;
let oldScore=0,oldLives=game.lives,oldState=game.state;
function frame(now){const dt=previous===undefined?0:(now-previous)/1000;previous=now;game.advance(dt,input);if(game.score!==oldScore){tone(880);best=Math.max(best,game.score);writeHighScore(storage,best);}if(game.lives<oldLives)tone(120,.18);if(game.state!==oldState&&['cleared','victory'].includes(game.state))tone(1040,.2);oldScore=game.score;oldLives=game.lives;oldState=game.state;resizeCanvas();draw(ctx,game,now/1000);sync();requestAnimationFrame(frame);}
function sync(){
  $('score').textContent=String(game.score).padStart(5,'0');$('best').textContent=String(best).padStart(5,'0');$('timer').textContent=Math.ceil(game.timer);$('sector').textContent=`0${game.level+1} / 05`;
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
