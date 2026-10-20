// Final identity assertions observed RED before activation; see external identity-red.log.
import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL(`../../${path}`,import.meta.url),'utf8');
describe('approved Orb Onslaught public identity',()=>{
  it('uses the exact browser title',()=>{
    expect(read('index.html').match(/<title>(.*?)<\/title>/s)?.[1]).toBe('Orb Onslaught');
  });
  it('uses the exact main heading and named accessible canvas',()=>{
    const html=read('index.html');
    expect(html).toContain('<h1>Orb Onslaught</h1>');
    expect(html).toMatch(/<canvas[^>]*aria-label="Orb Onslaught:/);
  });
  it('identifies the ready menu with the approved title in markup and state synchronization',()=>{
    expect(read('index.html')).toContain('<h2 id="title">Orb Onslaught</h2>');
    expect(read('src/app.js')).toContain("ready:['ARCADE / EXPEDITION 001','Orb Onslaught'");
  });
  it('names the final game in description without temporary public branding',()=>{
    const html=read('index.html');
    expect(html).toMatch(/name="description" content="Orb Onslaught[^"]*"/);
    expect(html).not.toMatch(/Aurora Field Study|PRIVATE STUDY|Private prototype|>FIELD<|\bPANG\b|\bPang\b/);
  });
  it('starts README with the exact title and clickable case-sensitive final live URL',()=>{
    const text=read('README.md');
    expect(text.split('\n')[0]).toBe('# Orb Onslaught');
    expect(text).toMatch(/\[[^\]]+\]\(https:\/\/nateofspades\.github\.io\/Orb_Onslaught_Game\/\)/);
  });
  it('updates package identities together without replacing locked dependency versions',()=>{
    const pkg=JSON.parse(read('package.json')),lock=JSON.parse(read('package-lock.json'));
    expect(pkg.name).toBe('orb-onslaught');
    expect(lock.name).toBe(pkg.name);expect(lock.packages[''].name).toBe(pkg.name);
  });
  it('targets the retained repository under its approved new name in deployment verification',()=>{
    const source=read('scripts/verify-pages.mjs');
    expect(source).toContain("const repository = 'nateofspades/Orb_Onslaught_Game'");
    expect(source).toContain("const live = 'https://nateofspades.github.io/Orb_Onslaught_Game/'");
  });
});
