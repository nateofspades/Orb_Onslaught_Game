export const ARENA_WIDTH=840;
export const ARENA_HEIGHT=450;
export const ARENA_ASPECT=ARENA_WIDTH/ARENA_HEIGHT;

export function controlMetrics(width,height){
  const compactLandscape=height<=480&&width>height;
  if(compactLandscape)return {directionSize:64,fireHeight:64,gap:12};
  if(width<=340)return {directionSize:64,fireHeight:64,gap:8};
  if(width<=600)return {directionSize:72,fireHeight:68,gap:10};
  return {directionSize:70,fireHeight:56,gap:10};
}

export function calculateLayout(width,height){
  const safeWidth=Math.max(1,Number(width)||1);
  const safeHeight=Math.max(1,Number(height)||1);
  const compactLandscape=safeHeight<=480&&safeWidth>safeHeight;
  const gutter=safeWidth<=600?10:16;
  const reservedHeight=compactLandscape?110:safeWidth<=600?220:250;
  const availableWidth=Math.max(1,safeWidth-gutter*2);
  const availableHeight=Math.max(1,safeHeight-reservedHeight);
  const arenaWidth=Math.min(ARENA_WIDTH,availableWidth,availableHeight*ARENA_ASPECT);
  return {
    arenaWidth,
    arenaHeight:arenaWidth/ARENA_ASPECT,
    compactLandscape,
    gutter,
    reservedHeight,
    controls:controlMetrics(safeWidth,safeHeight),
  };
}

export function applyLayout(root,width=globalThis.innerWidth,height=globalThis.innerHeight){
  const layout=calculateLayout(width,height);
  root.style.setProperty('--arena-width',`${layout.arenaWidth}px`);
  root.style.setProperty('--direction-size',`${layout.controls.directionSize}px`);
  root.style.setProperty('--fire-height',`${layout.controls.fireHeight}px`);
  root.style.setProperty('--control-gap',`${layout.controls.gap}px`);
  root.classList.toggle('compact-landscape',layout.compactLandscape);
  return layout;
}
