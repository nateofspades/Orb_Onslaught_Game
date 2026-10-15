import {describe,expect,it} from 'vitest';
import {ARENA_ASPECT,calculateLayout,controlMetrics} from '../../src/layout.js';

const viewports=[[1920,1080],[1366,768],[768,1024],[390,844],[320,568],[844,390],[440,320]];

describe('responsive arena layout',()=>{
  it.each(viewports)('fits the complete undistorted arena and chrome at %ix%i',(width,height)=>{
    const layout=calculateLayout(width,height);
    expect(layout.arenaWidth/layout.arenaHeight).toBeCloseTo(ARENA_ASPECT,8);
    expect(layout.arenaWidth).toBeLessThanOrEqual(840);
    expect(layout.arenaWidth+layout.gutter*2).toBeLessThanOrEqual(width);
    expect(layout.arenaHeight+layout.reservedHeight).toBeLessThanOrEqual(height);
    expect(layout.arenaWidth).toBeGreaterThan(0);
  });

  it('uses the short 844x390 landscape height for a substantial arena',()=>{
    const layout=calculateLayout(844,390);
    expect(layout.compactLandscape).toBe(true);
    expect(layout.arenaWidth).toBeGreaterThanOrEqual(520);
    expect(layout.arenaHeight).toBeGreaterThanOrEqual(278);
  });

  it('keeps useful portrait arena width on phone and tablet',()=>{
    expect(calculateLayout(320,568).arenaWidth).toBe(300);
    expect(calculateLayout(390,844).arenaWidth).toBe(370);
    expect(calculateLayout(768,1024).arenaWidth).toBeGreaterThanOrEqual(730);
  });
});

describe('touch control sizing',()=>{
  it.each([[320,568],[390,844],[844,390]])('provides large direction and fire targets at %ix%i',(width,height)=>{
    const controls=controlMetrics(width,height);
    expect(controls.directionSize).toBeGreaterThanOrEqual(64);
    expect(controls.fireHeight).toBeGreaterThanOrEqual(64);
    expect(controls.gap).toBeGreaterThanOrEqual(8);
  });
});
