import {describe,expect,it,vi} from 'vitest';
import {
  MUSIC_MASTER_VOLUME,
  MUSIC_PREFERENCE_KEY,
  ORIGINAL_SCORE,
  MusicController,
  readMusicPreference,
  writeMusicPreference,
} from '../../src/music.js';

class Param {
  constructor(value=0){this.value=value;}
  setValueAtTime(value){this.value=value;}
  linearRampToValueAtTime(value){this.value=value;}
  exponentialRampToValueAtTime(value){this.value=value;}
  cancelScheduledValues(){}
}
class Node {
  connect(){return this;}
}
class FakeAudioContext {
  static instances=[];
  constructor(){
    FakeAudioContext.instances.push(this);
    this.currentTime=0;
    this.state='suspended';
    this.destination=new Node();
    this.createdOscillators=0;
  }
  createGain(){const node=new Node();node.gain=new Param(1);return node;}
  createOscillator(){
    this.createdOscillators++;
    const node=new Node();node.frequency=new Param();node.detune=new Param();node.start=vi.fn();node.stop=vi.fn();node.type='square';return node;
  }
  createBufferSource(){const node=new Node();node.start=vi.fn();node.stop=vi.fn();return node;}
  resume(){this.state='running';return Promise.resolve();}
  suspend(){this.state='suspended';return Promise.resolve();}
}
const memoryStorage=(initial={})=>{
  const values=new Map(Object.entries(initial));
  return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,String(value)),values};
};
const harness=(stored={})=>{
  FakeAudioContext.instances=[];
  const intervals=[];
  const music=new MusicController({
    AudioContext:FakeAudioContext,
    storage:memoryStorage(stored),
    setInterval:fn=>{intervals.push(fn);return intervals.length;},
    clearInterval:vi.fn(),
  });
  return {music,intervals};
};

describe('original retro score',()=>{
  it('contains a multi-voice 64-step composition with a fast arcade tempo',()=>{
    expect(ORIGINAL_SCORE.bpm).toBeGreaterThanOrEqual(160);
    expect(ORIGINAL_SCORE.steps).toBe(64);
    expect(ORIGINAL_SCORE.melody).toHaveLength(ORIGINAL_SCORE.steps);
    expect(ORIGINAL_SCORE.bass).toHaveLength(ORIGINAL_SCORE.steps);
    expect(ORIGINAL_SCORE.melody.filter(Boolean).length).toBeGreaterThan(20);
    expect(ORIGINAL_SCORE.bass.filter(Boolean).length).toBeGreaterThan(20);
    expect(new Set(ORIGINAL_SCORE.melody.filter(Boolean)).size).toBeGreaterThan(8);
  });
});

describe('music preference',()=>{
  it('defaults on and round-trips an explicit off preference',()=>{
    const storage=memoryStorage();
    expect(readMusicPreference(storage)).toBe(true);
    expect(writeMusicPreference(storage,false)).toBe(true);
    expect(storage.values.get(MUSIC_PREFERENCE_KEY)).toBe('off');
    expect(readMusicPreference(storage)).toBe(false);
  });

  it('remains usable when storage is denied',()=>{
    const denied={getItem(){throw new Error('denied');},setItem(){throw new Error('denied');}};
    expect(readMusicPreference(denied)).toBe(true);
    expect(writeMusicPreference(denied,false)).toBe(false);
  });
});

describe('music transport',()=>{
  it('starts enabled at the central high-volume target',async()=>{
    const {music}=harness();
    expect(MUSIC_MASTER_VOLUME).toBe(.28);
    await music.start();
    expect(music.master.gain.value).toBe(MUSIC_MASTER_VOLUME);
  });

  it('starts once after interaction and schedules one continuous transport',async()=>{
    const {music,intervals}=harness();
    expect(music.snapshot().started).toBe(false);
    await music.start();
    await music.start();
    expect(FakeAudioContext.instances).toHaveLength(1);
    expect(intervals).toHaveLength(1);
    expect(music.snapshot().started).toBe(true);
    expect(FakeAudioContext.instances[0].createdOscillators).toBeGreaterThan(0);
  });

  it('mutes without rebuilding or resetting the composition position',async()=>{
    const {music,intervals}=harness();
    await music.start();
    const context=FakeAudioContext.instances[0];
    context.currentTime=1;
    intervals[0]();
    const before=music.snapshot();
    music.setEnabled(false);
    expect(music.master.gain.value).toBe(0);
    context.currentTime=2;
    intervals[0]();
    const muted=music.snapshot();
    expect(muted.contextId).toBe(before.contextId);
    expect(muted.step).toBeGreaterThan(before.step);
    music.setEnabled(true);
    expect(music.master.gain.value).toBe(MUSIC_MASTER_VOLUME);
    expect(music.snapshot().step).toBe(muted.step);
  });

  it('recovers the enabled master volume after an audio interruption',async()=>{
    const {music}=harness();
    await music.start();
    music.master.gain.value=.01;
    music.context.state='suspended';
    await music.start();
    expect(music.context.state).toBe('running');
    expect(music.master.gain.value).toBe(MUSIC_MASTER_VOLUME);
  });

  it('suspends while hidden and resumes the same transport when visible',async()=>{
    const {music}=harness();
    await music.start();
    const before=music.snapshot();
    await music.handleVisibility(true);
    expect(FakeAudioContext.instances[0].state).toBe('suspended');
    music.master.gain.value=.01;
    await music.handleVisibility(false);
    expect(FakeAudioContext.instances[0].state).toBe('running');
    expect(music.master.gain.value).toBe(MUSIC_MASTER_VOLUME);
    expect(music.snapshot().contextId).toBe(before.contextId);
    expect(music.snapshot().step).toBe(before.step);
  });
});
