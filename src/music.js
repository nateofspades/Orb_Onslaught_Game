export const MUSIC_PREFERENCE_KEY='pang.music';
const notes={C3:130.81,D3:146.83,E3:164.81,F3:174.61,G3:196,A3:220,B3:246.94,C4:261.63,D4:293.66,E4:329.63,F4:349.23,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,G5:783.99};
const line=values=>values.split(' ').map(value=>value==='-'?null:notes[value]);
export const ORIGINAL_SCORE=Object.freeze({
  title:'Polar Circuit',
  bpm:172,
  steps:64,
  melody:line('E4 - G4 A4 B4 - A4 G4 E4 - D4 E4 G4 - E4 D4 C4 - E4 G4 B4 - A4 G4 E4 - G4 A4 C5 - B4 A4 G4 - E4 G4 A4 - C5 B4 A4 G4 F4 - D4 E4 G4 A4 - B4 D5 C5 A4 G4 - E4 G4 B4 A4 G4 E4 D4 - E4 G4 A4 B4 C5 D5 E5 -').slice(0,64),
  bass:line('E3 - E3 B3 E3 - E3 B3 C3 - C3 G3 C3 - C3 G3 A3 - A3 E3 A3 - A3 E3 B3 - B3 F3 B3 - B3 F3 E3 - E3 B3 E3 - E3 B3 C3 - C3 G3 D3 - D3 A3 B3 - B3 F3 C3 - C3 G3 D3 - D3 A3 E3 - E3 B3'),
});

export function readMusicPreference(storage){
  try{return storage?.getItem(MUSIC_PREFERENCE_KEY)!=='off';}catch{return true;}
}
export function writeMusicPreference(storage,enabled){
  try{storage?.setItem(MUSIC_PREFERENCE_KEY,enabled?'on':'off');return Boolean(storage);}catch{return false;}
}

let nextContextId=1;
export class MusicController{
  constructor({AudioContext,storage,setInterval:setTimer=(fn,ms)=>globalThis.setInterval(fn,ms),clearInterval:clearTimer=id=>globalThis.clearInterval(id)}={}){
    this.AudioContext=AudioContext;
    this.storage=storage;
    this.setTimer=setTimer;
    this.clearTimer=clearTimer;
    this.enabled=readMusicPreference(storage);
    this.started=false;
    this.context=null;
    this.master=null;
    this.timer=null;
    this.absoluteStep=0;
    this.nextStepTime=0;
    this.contextId=null;
    this.stepDuration=60/ORIGINAL_SCORE.bpm/4;
  }
  snapshot(){return {started:this.started,enabled:this.enabled,step:this.absoluteStep,contextId:this.contextId,state:this.context?.state??'idle',error:this.error??null};}
  async start(){
    if(this.started){await this.recover();return true;}
    if(typeof this.AudioContext!=='function')return false;
    try{
      this.context=new this.AudioContext();
      this.contextId=nextContextId++;
      this.master=this.context.createGain();
      this.master.gain.value=this.enabled?.12:0;
      this.master.connect(this.context.destination);
      this.started=true;
      this.nextStepTime=this.context.currentTime+.03;
      const resumed=this.context.resume();
      this.schedule();
      this.timer=this.setTimer(()=>this.schedule(),25);
      Promise.resolve(resumed).then(()=>this.schedule()).catch(()=>{});
      return true;
    }catch(error){
      this.error=error instanceof Error?error.message:String(error);
      this.started=false;
      this.context=null;
      this.master=null;
      return false;
    }
  }
  async recover(){
    if(!this.context||this.context.state==='running')return;
    try{await this.context.resume();}catch{/* Music remains optional if the browser denies resume. */}
  }
  setEnabled(enabled){
    this.enabled=Boolean(enabled);
    writeMusicPreference(this.storage,this.enabled);
    if(this.master&&this.context){
      const now=this.context.currentTime;
      this.master.gain.cancelScheduledValues?.(now);
      this.master.gain.setValueAtTime?.(this.master.gain.value,now);
      this.master.gain.linearRampToValueAtTime?.(this.enabled?.12:0,now+.04);
    }
    return this.enabled;
  }
  toggle(){return this.setEnabled(!this.enabled);}
  async handleVisibility(hidden){
    if(!this.started||!this.context)return;
    try{if(hidden)await this.context.suspend();else await this.context.resume();}catch{/* Audio interruption is non-fatal. */}
  }
  schedule(){
    if(!this.started||!this.context||this.context.state!=='running')return;
    const now=this.context.currentTime;
    if(this.nextStepTime<now-.2)this.nextStepTime=now+.03;
    while(this.nextStepTime<now+.14){
      this.scheduleStep(this.absoluteStep%ORIGINAL_SCORE.steps,this.nextStepTime);
      this.nextStepTime+=this.stepDuration;
      this.absoluteStep++;
    }
  }
  scheduleStep(step,time){
    const melody=ORIGINAL_SCORE.melody[step];
    const bass=ORIGINAL_SCORE.bass[step];
    if(melody)this.voice(melody,time,this.stepDuration*.82,'square',.16);
    if(bass)this.voice(bass,time,this.stepDuration*1.8,'triangle',.2);
    if(step%4===0)this.voice(58,time,this.stepDuration*1.6,'sine',.34,42);
    if(step%2===1)this.voice(4200,time,this.stepDuration*.16,'square',.035,2600);
    if(step%8===6)this.voice(notes.E5,time,this.stepDuration*.45,'sawtooth',.05);
  }
  voice(frequency,time,duration,type,level,endFrequency=frequency){
    const oscillator=this.context.createOscillator();
    const gain=this.context.createGain();
    oscillator.type=type;
    oscillator.frequency.setValueAtTime(frequency,time);
    if(endFrequency!==frequency)oscillator.frequency.exponentialRampToValueAtTime(Math.max(1,endFrequency),time+duration);
    gain.gain.setValueAtTime(level,time);
    gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
    oscillator.connect(gain).connect(this.master);
    oscillator.start(time);
    oscillator.stop(time+duration+.01);
  }
}
