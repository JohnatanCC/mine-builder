// src/textures.ts
import * as THREE from 'three';

type RGBA = [number, number, number, number];

/* ====== configuração geral (pixel-art 32x) ====== */
const TEX_RES = 32;
const MORTAR = 1;
const BEVEL  = 2;

/* ===== helpers determinísticos ===== */
function sRand(x: number, y: number, s = 1337) {
  const t = Math.sin((x * 374761393 + y * 668265263 + s * 69069) >>> 0) * 43758.5453;
  return t - Math.floor(t);
}
function noise2(x: number, y: number, s = 1) {
  const n00 = sRand(x, y, s), n10 = sRand(x + 1, y, s);
  const n01 = sRand(x, y + 1, s), n11 = sRand(x + 1, y + 1, s);
  return (n00 + n10 + n01 + n11) * 0.25;
}
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rgb = (r: number, g: number, b: number) => `rgb(${r|0},${g|0},${b|0})`;
const mul = (c: RGBA, f: number): RGBA => [c[0]*f, c[1]*f, c[2]*f, c[3]];

function finalizeTexture(tex: THREE.CanvasTexture) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter  = THREE.NearestFilter;
  tex.minFilter  = THREE.NearestMipMapNearestFilter; // nítido com mip discreto
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 1;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}
function makeCanvasTexture(
  size = TEX_RES,
  paint: (ctx: CanvasRenderingContext2D, size: number) => void,
): THREE.CanvasTexture {
  const cnv = document.createElement('canvas');
  cnv.width = cnv.height = size;
  const ctx = cnv.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  paint(ctx, size);
  return finalizeTexture(new THREE.CanvasTexture(cnv));
}

/* ===== pedra lisa (mosaico 2×2 + cinzas quantizados) ===== */
function stoneTex() {
  return makeCanvasTexture(TEX_RES, (ctx, S) => {
    const cell = 2;
    const grays = [110, 118, 126, 134, 142];
    for (let y = 0; y < S; y += cell) {
      for (let x = 0; x < S; x += cell) {
        const n = noise2(x, y, 7) * 0.8 + sRand(x, y, 11) * 0.2;
        const idx = Math.max(0, Math.min(grays.length - 1, (n * grays.length) | 0));
        const g = grays[idx];
        ctx.fillStyle = rgb(g, g, g);
        ctx.fillRect(x, y, cell, cell);
      }
    }
    // veios bem discretos
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let i = 0; i < S; i += 2) ctx.fillRect((i*3)%S, (i*5)%S, 1, 1);
  });
}

/* ===== pranchas (Oak) – bandas largas + juntas claras ===== */
function oakTex() {
  return makeCanvasTexture(TEX_RES, (ctx, S) => {
    const cell = 2;
    const base: RGBA = [176, 112, 60, 255];
    for (let y=0; y<S; y += cell) {
      const band = (Math.sin(y*0.15)+1)*0.06 + 0.92;
      for (let x=0; x<S; x += cell) {
        const v = (noise2(x,y,21)-0.5)*0.10;
        const c = mul(base, clamp01(band + v));
        ctx.fillStyle = rgb(c[0], c[1], c[2]);
        ctx.fillRect(x, y, cell, cell);
      }
    }
    const plankW = Math.round(S/4);
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    for (let x = 0; x < S; x += plankW) ctx.fillRect(x, 0, 1, S);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let x = 0; x < S; x += plankW) ctx.fillRect(x+1, 0, plankW-2, 1);
  });
}

/* ===== terra (mosaico 2×2) ===== */
function dirtTex() {
  return makeCanvasTexture(32, (ctx, S) => {
    const palette: [number, number, number][] = [
      [139, 90,  54], [123, 79,  47], [160, 108, 66],
      [111, 71,  43], [151, 101, 60], [96,  61,  37],
    ];
    const stone = [95, 95, 95];
    const cell = 2;
    for (let y = 0; y < S; y += cell) {
      for (let x = 0; x < S; x += cell) {
        const n = sRand(x, y, 71);
        const c = palette[(n * palette.length) | 0];
        ctx.fillStyle = rgb(c[0], c[1], c[2]);
        ctx.fillRect(x, y, cell, cell);
        if (sRand(x + 7, y + 3, 72) > 0.87) {
          ctx.fillStyle = rgb(stone[0], stone[1], stone[2]);
          ctx.fillRect(x, y, cell, cell);
        }
      }
    }
  });
}

/* ===== grama topo com transição de terra ===== */
function grassTopTex() {
  return makeCanvasTexture(32, (ctx, S) => {
    const greens: [number, number, number][] = [
      [86, 167, 62], [97, 178, 73], [78, 156, 55],
      [69, 145, 50], [105, 186, 80], [60, 134, 45]
    ];
    const cell = 2;

    // mosaico de grama viva (sem faixa marrom aqui!)
    for (let y = 0; y < S; y += cell) {
      for (let x = 0; x < S; x += cell) {
        const idx = ((sRand(x, y, 91) * greens.length) | 0) % greens.length;
        const g = greens[idx];
        const v = 0.9 + (noise2(x, y, 92) - 0.5) * 0.15;
        ctx.fillStyle = rgb(g[0] * v, g[1] * v, g[2] * v);
        ctx.fillRect(x, y, cell, cell);
      }
    }
  });
}

/* ===== grama lateral (borda denteada + transição para a terra) ===== */
function grassSideTex() {
  return makeCanvasTexture(32, (ctx, S) => {
    const cell = 2;
    const cut = Math.round(S * 0.48); // altura da grama na lateral

    // === parte de cima: grama (mesma paleta do topo) ===
    const greens: [number, number, number][] = [
      [86, 167, 62], [97, 178, 73], [78, 156, 55],
      [69, 145, 50], [105, 186, 80], [60, 134, 45]
    ];
    for (let y = 0; y < cut; y += cell) {
      for (let x = 0; x < S; x += cell) {
        const idx = ((sRand(x, y, 101) * greens.length) | 0) % greens.length;
        const g = greens[idx];
        const v = 0.9 + (noise2(x, y, 102) - 0.5) * 0.15;
        ctx.fillStyle = rgb(g[0] * v, g[1] * v, g[2] * v);
        ctx.fillRect(x, y, cell, cell);
      }
    }

    // === faixa de transição: grama -> terra (irregular, estilo MC) ===
    // usamos uma “borda denteada” + respingos de terra subindo alguns pixels
    const browns: [number, number, number][] = [
      [96, 62, 36], [110, 74, 42], [84, 53, 31], [122, 82, 46]
    ];
    const bandPx = Math.max(4, Math.round(S * 0.28)); // ~9px em 32
    const bandStart = cut - Math.floor(bandPx * 0.55); // começa um pouco acima do corte

    // 1) borda denteada desenhada em “colunas”
    for (let x = 0; x < S; x += cell) {
      // deslocamento por coluna para criar dentes (de  -4 a +4 px aprox.)
      const teeth = Math.round((sRand(x, 0, 111) - 0.5) * 4);
      const y0 = Math.max(0, Math.min(S - cell, cut + teeth));
      // sombreado leve na linha de contato (opcional, dá volume)
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(x, y0, cell, cell);
    }

    // 2) mistura: alguns pixels de terra invadindo a grama dentro da banda
    for (let y = bandStart; y < cut; y += cell) {
      const ny = (y - bandStart) / Math.max(1, (cut - bandStart)); // 0→1
      const topP = 0.04, baseP = 0.35;        // probabilidade de terra
      const p = mix(topP, baseP, ny);         // aumenta perto do corte
      for (let x = 0; x < S; x += cell) {
        const r = sRand(x, y, 112);
        const jag = (Math.sin((x + y) * 0.35) + 1) * 0.08; // irregularidade
        if (r < p + jag) {
          const bi = ((sRand(x, y, 113) * browns.length) | 0) % browns.length;
          const b = browns[bi];
          const v = 0.92 + (noise2(x, y, 114) - 0.5) * 0.12;
          ctx.fillStyle = rgb(b[0] * v, b[1] * v, b[2] * v);
          ctx.fillRect(x, y, cell, cell);
        }
      }
    }

    // === parte de baixo: terra (compatível com a sua dirt) ===
    const dirtPalette: [number, number, number][] = [
      [139, 90,  54], [123, 79,  47], [160, 108, 66],
      [111, 71,  43], [151, 101, 60], [96,  61,  37],
    ];
    const stone = [95, 95, 95];

    for (let y = cut; y < S; y += cell) {
      for (let x = 0; x < S; x += cell) {
        const idx = ((sRand(x, y, 121) * dirtPalette.length) | 0) % dirtPalette.length;
        const c = dirtPalette[idx];
        const v = 0.92 + (noise2(x, y, 122) - 0.5) * 0.12;
        ctx.fillStyle = rgb(c[0] * v, c[1] * v, c[2] * v);
        ctx.fillRect(x, y, cell, cell);
        // pedrinhas ocasionais
        if (sRand(x + 9, y + 5, 123) > 0.90) {
          ctx.fillStyle = rgb(stone[0], stone[1], stone[2]);
          ctx.fillRect(x, y, cell, cell);
        }
      }
    }

    // 3) respingos de terra um pouco ACIMA da banda (quebra a linha)
    const speckRows = 2 * cell; // ~4px acima
    for (let y = Math.max(0, bandStart - speckRows); y < bandStart; y += cell) {
      const ny = 1 - (bandStart - y) / speckRows; // 0 topo → 1 perto da banda
      const p = 0.02 + ny * 0.06;
      for (let x = 0; x < S; x += cell) {
        if (sRand(x, y, 124) < p) {
          const bi = ((sRand(x, y, 125) * browns.length) | 0) % browns.length;
          const b = browns[bi];
          const v = 0.92 + (noise2(x, y, 126) - 0.5) * 0.10;
          ctx.fillStyle = rgb(b[0] * v, b[1] * v, b[2] * v);
          ctx.fillRect(x, y, cell, cell);
        }
      }
    }
  });
}

/* ===== vidro ===== */
function glassTex() {
  return makeCanvasTexture(TEX_RES, (ctx, S) => {
    for (let y=0; y<S; y++) for (let x=0; x<S; x++) {
      const n = noise2(x, y, 2) * 0.2;
      const r = 118 + n*60, g = 168 + n*60, b = 222 + n*60;
      ctx.fillStyle = `rgba(${r|0},${g|0},${b|0},0.86)`;
      ctx.fillRect(x,y,1,1);
    }
    ctx.fillStyle = 'rgba(230,230,230,0.85)';
    ctx.fillRect(0,0,S,1); ctx.fillRect(0,S-1,S,1); ctx.fillRect(0,0,1,S); ctx.fillRect(S-1,0,1,S);
    ctx.strokeStyle = 'rgba(255,255,255,0.40)';
    ctx.beginPath(); ctx.moveTo(Math.round(S*0.18),Math.round(S*0.22)); ctx.lineTo(Math.round(S*0.62),Math.round(S*0.66)); ctx.stroke();
  });
}

/* ===== pedregulho (poucas pedras grandes) ===== */
export function cobblestoneTex() {
  return makeCanvasTexture(TEX_RES, (ctx, S) => {
    const cell = Math.round(S/4);
    // fundo
    for (let y=0; y<S; y++) for (let x=0; x<S; x++) {
      const n = noise2(x*1.2, y*1.2, 12);
      const g = 114 + Math.round((n-0.5)*36);
      ctx.fillStyle = rgb(g,g,g);
      ctx.fillRect(x, y, 1, 1);
    }
    // ilhas
    for (let gy=0; gy<S; gy+=cell) {
      for (let gx=0; gx<S; gx+=cell) {
        const cx = gx + Math.round(cell*0.5 + (noise2(gx,gy,31)-0.5)*cell*0.3);
        const cy = gy + Math.round(cell*0.5 + (noise2(gx,gy,32)-0.5)*cell*0.3);
        const rad = Math.round(cell*0.46);
        for (let y=cy-rad; y<=cy+rad; y++) {
          for (let x=cx-rad; x<=cx+rad; x++) {
            if (x<0||y<0||x>=S||y>=S) continue;
            const d = Math.hypot(x-cx,y-cy)/rad;
            if (d<=1) {
              const shade = clamp01(1 - d*0.28 + (noise2(x,y,44)-0.5)*0.08);
              const g = 120 + Math.round(shade*28);
              ctx.fillStyle = rgb(g,g,g);
              ctx.fillRect(x,y,1,1);
            }
          }
        }
      }
    }
    // argamassa leve
    ctx.fillStyle = 'rgba(235,235,235,0.10)';
    for (let i=cell; i<S; i+=cell) { ctx.fillRect(i,0,1,S); ctx.fillRect(0,i,S,1); }
  });
}

/* ===== stone bricks (legível em 32×) ===== */
export function stoneBricksTex() {
  return makeCanvasTexture(TEX_RES, (ctx, S) => {
    const bw = Math.round(S/4), bh = Math.round(S/3);
    const cell = 2;
    // base quantizada
    const grays = [120, 126, 132, 138];
    for (let y=0;y<S;y+=cell) for (let x=0;x<S;x+=cell){
      const idx = (sRand(x,y,17)*grays.length)|0;
      const g = grays[idx];
      ctx.fillStyle = rgb(g,g,g);
      ctx.fillRect(x,y,cell,cell);
    }
    // argamassa
    ctx.fillStyle = 'rgba(32,32,32,0.55)';
    for (let x=0; x<S; x+=bw) ctx.fillRect(x, 0, MORTAR, S);
    for (let y=0; y<S; y+=bh) ctx.fillRect(0, y, S, MORTAR);
    // bevel leve
    for (let y=0; y<S; y+=bh){
      for (let x=0; x<S; x+=bw){
        const x0 = x + MORTAR, y0 = y + MORTAR;
        const x1 = Math.min(x+bw-1, S-1), y1 = Math.min(y+bh-1, S-1);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(x0, y0, (x1-x0+1), BEVEL);
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(x0, y1-BEVEL+1, (x1-x0+1), BEVEL);
      }
    }
  });
}

/* ===== pranchas – pinheiro/bétula (pixel art) ===== */
export function sprucePlanksTex() {
  return makeCanvasTexture(TEX_RES, (ctx,S) => {
    const cell = 2;
    const base: RGBA = [126, 92, 54, 255];
    for (let y=0;y<S;y+=cell){
      const band = 0.93 + (Math.sin(y*0.15)*0.06);
      for (let x=0;x<S;x+=cell){
        const v = (noise2(x,y,23)-0.5)*0.10;
        const c = mul(base, clamp01(band+v));
        ctx.fillStyle = rgb(c[0], c[1], c[2]);
        ctx.fillRect(x,y,cell,cell);
      }
    }
    const plankW = Math.round(S/4);
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    for (let x=0;x<S;x+=plankW) ctx.fillRect(x,0,1,S);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let x=0;x<S;x+=plankW) ctx.fillRect(x+1,0,plankW-2,1);
  });
}
export function birchPlanksTex() {
  return makeCanvasTexture(TEX_RES, (ctx,S) => {
    const cell = 2;
    const base: RGBA = [218, 208, 164, 255];
    for (let y=0;y<S;y+=cell) for (let x=0;x<S;x+=cell){
      const v = 0.95 + (noise2(x,y,24)-0.5)*0.10;
      const c = mul(base, clamp01(v));
      ctx.fillStyle = rgb(c[0], c[1], c[2]);
      ctx.fillRect(x,y,cell,cell);
    }
    const plankW = Math.round(S/4);
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    for (let x=0;x<S;x+=plankW) ctx.fillRect(x,0,1,S);
  });
}

/* ===== troncos — casca e anéis (simplificados para 32×) ===== */
function barkTex(color: RGBA) {
  return makeCanvasTexture(TEX_RES, (ctx, S) => {
    const cell = 2;
    for (let y=0;y<S;y+=cell){
      for (let x=0;x<S;x+=cell){
        const stripe = 0.90 + (noise2(x*0.5, y, 33) - 0.5) * 0.28;
        const micro  = 0.98 + (noise2(x, y*1.1, 34) - 0.5) * 0.08;
        const v = clamp01(stripe * micro);
        ctx.fillStyle = rgb(color[0]*v, color[1]*v, color[2]*v);
        ctx.fillRect(x,y,cell,cell);
      }
      if (y % 6 === 0) { ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(0,y,S,1); }
    }
    // poucos nós
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    for (let i=0;i<2;i++){
      const nx = (sRand(i,77)*S)|0, ny = (sRand(i,78)*S)|0;
      ctx.fillRect(nx, ny, 1, 1);
      if (nx+1<S) ctx.fillRect(nx+1, ny, 1, 1);
      if (ny+1<S) ctx.fillRect(nx, ny+1, 1, 1);
    }
  });
}
function ringsTex(light: RGBA, dark: RGBA, freckles = 0) {
  return makeCanvasTexture(TEX_RES, (ctx,S) => {
    const cx = S/2 + (sRand(1,2)-0.5)*2, cy = S/2 + (sRand(3,4)-0.5)*2;
    for (let y=0;y<S;y++) for (let x=0;x<S;x++){
      const dx = (x-cx)* (1 + (noise2(x,y,91)-0.5)*0.08);
      const dy = (y-cy)* (1 + (noise2(x,y,92)-0.5)*0.08);
      const r = Math.sqrt(dx*dx+dy*dy);
      const t = clamp01(Math.sin(r*0.8 + noise2(x,y,93)*0.5)*0.5+0.5);
      const rr = [ mix(dark[0], light[0], t), mix(dark[1], light[1], t), mix(dark[2], light[2], t) ];
      ctx.fillStyle = rgb(rr[0], rr[1], rr[2]);
      ctx.fillRect(x,y,1,1);
    }
    if (freckles>0){
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      for (let i=0;i<freckles;i++){
        const xx = (sRand(i,201)*S)|0, yy = (sRand(i,202)*S)|0;
        ctx.fillRect(xx,yy,1,1);
      }
    }
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    const r0 = Math.max(1, (S/9)|0);
    ctx.beginPath(); ctx.arc(S/2, S/2, r0, 0, Math.PI*2); ctx.fill();
  });
}

export const oakBarkTex    = () => barkTex([130, 94, 52, 255]);
export const spruceBarkTex = () => barkTex([94, 70, 42, 255]);
export const birchBarkTex  = () => barkTex([214, 214, 202, 255]);

export const oakRingsTex    = () => ringsTex([196,146,86,255],[142,102,62,255]);
export const spruceRingsTex = () => ringsTex([152,112,72,255],[102,72,47,255]);
export const birchRingsTex  = () => ringsTex([232,222,184,255],[172,162,122,255], 18);

/* ===== folhas (alpha) — pack 32x: denso, vivo e com raminhos) ===== */
function leavesTex(tint: RGBA) {
  return makeCanvasTexture(TEX_RES, (ctx,S) => {
    for (let y=0;y<S;y++) for (let x=0;x<S;x++){
      const n = noise2(x, y, 31);
      const a = 0.22 + n*0.12;
      const v = 0.9 + (noise2(x*2,y*2,33)-0.5)*0.18;
      const c = mul(tint, clamp01(v));
      ctx.fillStyle = `rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a.toFixed(3)})`;
      ctx.fillRect(x,y,1,1);
    }
    // clusters sólidos
    const clusters = Math.round(S * 0.7);
    for (let i=0;i<clusters;i++){
      const cx = (sRand(i,101)*S)|0, cy = (sRand(i,102)*S)|0;
      const r = 1 + ((sRand(i,103)*3)|0);
      for (let y=-r;y<=r;y++) for (let x=-r;x<=r;x++){
        const xx = cx+x, yy = cy+y;
        if (xx<0||yy<0||xx>=S||yy>=S) continue;
        if (x*x+y*y <= r*r){
          const v = 0.98 + (sRand(xx,yy)*0.12-0.06);
          const c = mul(tint, clamp01(v));
          ctx.fillStyle = `rgba(${c[0]|0},${c[1]|0},${c[2]|0},0.95)`;
          ctx.fillRect(xx,yy,1,1);
        }
      }
    }
    // raminhos em cruz
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    const lines = Math.round(S * 0.35);
    for (let i=0;i<lines;i++){
      const x0 = (sRand(i,141)*S)|0, y0 = (sRand(i,142)*S)|0;
      const len = 2 + ((sRand(i,143)*3)|0);
      for (let t=0;t<len;t++){
        ctx.fillRect((x0+t)%S,y0,1,1);
        ctx.fillRect(x0,(y0+t)%S,1,1);
      }
    }
    // vinheta
    for (let i=0;i<S;i++){
      ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(i,0,1,1); ctx.fillRect(i,S-1,1,1);
      ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(0,i,1,1); ctx.fillRect(S-1,i,1,1);
    }
    // buracos e brilhos
    for (let i=0;i<S/3;i++) ctx.clearRect((sRand(i,111)*S)|0, (sRand(i,112)*S)|0, 1, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    for (let i=0;i<S/2;i++) ctx.fillRect((sRand(i,121)*S)|0, (sRand(i,122)*S)|0, 1, 1);
  });
}
export const oakLeavesTex    = () => leavesTex([66, 150, 66, 255]);
export const spruceLeavesTex = () => leavesTex([58, 118, 70, 255]);
export const birchLeavesTex  = () => leavesTex([110, 190, 108, 255]);

/* ===== cache tipado ===== */
export interface BlockTextures {
  oak: THREE.Texture;
  stone: THREE.Texture;
  dirt: THREE.Texture;
  grassTop: THREE.Texture;
  grassSide: THREE.Texture;
  glass: THREE.Texture;
  cobblestone: THREE.Texture;
  stoneBricks: THREE.Texture;
  sprucePlanks: THREE.Texture;
  birchPlanks: THREE.Texture;
  oakBark: THREE.Texture; spruceBark: THREE.Texture; birchBark: THREE.Texture;
  oakRings: THREE.Texture; spruceRings: THREE.Texture; birchRings: THREE.Texture;
  oakLeaves: THREE.Texture; spruceLeaves: THREE.Texture; birchLeaves: THREE.Texture;
}

declare global { var __blockTexCache: BlockTextures | undefined; }

export function getBlockTextures(): BlockTextures {
  if (globalThis.__blockTexCache) return globalThis.__blockTexCache;
  const tex: BlockTextures = {
    oak: oakTex(),
    stone: stoneTex(),
    dirt: dirtTex(),
    grassTop: grassTopTex(),
    grassSide: grassSideTex(),
    glass: glassTex(),
    cobblestone: cobblestoneTex(),
    stoneBricks: stoneBricksTex(),
    sprucePlanks: sprucePlanksTex(),
    birchPlanks: birchPlanksTex(),
    oakBark: oakBarkTex(), spruceBark: spruceBarkTex(), birchBark: birchBarkTex(),
    oakRings: oakRingsTex(), spruceRings: spruceRingsTex(), birchRings: birchRingsTex(),
    oakLeaves: oakLeavesTex(), spruceLeaves: spruceLeavesTex(), birchLeaves: birchLeavesTex(),
  };
  globalThis.__blockTexCache = tex;
  return tex;
}
