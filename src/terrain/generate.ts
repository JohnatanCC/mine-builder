// NEW: src/terrain/generate.ts
import type { WorldSnapshot, Voxel } from "@/state/world.store";
import { key } from "@/core/keys";

export type IslandKind = "mini" | "atoll" | "plateau" | "mesa";

/** PRNG simples determinístico */
function mulberry32(seed: number) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** value-noise 2D baratinho */
function hash2(x: number, y: number, rng: () => number) {
  // mistura coordenadas + rng determinístico
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  // “dobra” com um pouco de aleatório seeded
  return (s - Math.floor(s)) * 0.85 + rng() * 0.15;
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function smoothstep(t: number) { return t * t * (3 - 2 * t); }

function valueNoise2D(x: number, y: number, rng: () => number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash2(xi,     yi,     rng);
  const b = hash2(xi + 1, yi,     rng);
  const c = hash2(xi,     yi + 1, rng);
  const d = hash2(xi + 1, yi + 1, rng);
  const u = smoothstep(xf);
  const v = smoothstep(yf);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}

function fbm2D(x: number, y: number, rng: () => number, octaves = 4, lacunarity = 2, gain = 0.5) {
  let amp = 1, freq = 1, sum = 0, norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise2D(x * freq, y * freq, rng);
    norm += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return sum / norm;
}

/** Falloff radial pra formar “ilha” (0 no borde, 1 no centro) */
function islandFalloff(nx: number, nz: number, curve = 2.2) {
  // nx/nz normalizados em [-1,1]
  const r = Math.sqrt(nx * nx + nz * nz); // 0 centro … ~1 borda
  const t = Math.min(1, r);
  return Math.pow(1 - t, curve);
}

/** Altura base por tipo de ilha */
function heightProfile(kind: IslandKind, base: number, fall: number) {
  switch (kind) {
    case "mini":    return Math.max(0, base * 6 * fall);
    case "atoll":   return Math.max(0, (base * 3.5 + 0.1) * Math.pow(fall, 0.6)); // aro baixo
    case "plateau": return Math.max(0, (base * 2.5 + 0.25) * Math.pow(fall, 1.8));
    case "mesa":    return Math.max(0, (base * 4.0) * Math.pow(fall, 3.0) + 0.6 * Math.pow(fall, 6));
  }
}

/** Gera uma ilha centrada em (0,0) ocupando [-R..R] em X/Z. */
export function generateIslandSnapshot(opts: {
  kind: IslandKind;
  radius: number;        // ex: 16..48
  seaLevel?: number;     // y=0 mar; terreno sobe para cima (positivo)
  seed?: number;
}): WorldSnapshot {
  const { kind, radius, seed = 1337, seaLevel = 0 } = opts;
  const voxels: Voxel[] = [];
  const rng = mulberry32(seed);

  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      // normaliza pra [-1,1] pra falloff
      const nx = x / radius;
      const nz = z / radius;

      // base de ruido + falloff
      const n = fbm2D((x + 1000) / 18, (z + 2000) / 18, rng, 4, 2.1, 0.55);
      const fall = islandFalloff(nx, nz);
      let h = heightProfile(kind, n, fall);

      // arredonda e limita
      const maxH = Math.round(h * 6); // 0..~6 blocos típicos
      for (let y = seaLevel; y <= seaLevel + maxH; y++) {
        // tipo simples por camada
        let type: Voxel["type"] = "dirt";
        if (y === seaLevel + maxH) type = "grass";
        if (maxH >= 5 && y <= seaLevel + 1) type = "stone";
        voxels.push({ x, y, z, type: type as any });
      }

      // água raso em volta
      if (maxH <= 0 && fall > 0.1) {
        voxels.push({ x, y: seaLevel, z, type: "water" as any });
      }
    }
  }

  return { blocks: voxels };
}

/** Mescla uma construção (export) no snapshot do terreno, com offset opcional */
export function mergeConstruction(
  base: WorldSnapshot,
  construction: { world?: { blocks?: Array<{ x:number;y:number;z:number;type:string }> } } | null,
  offset: { x: number; y: number; z: number } = { x: 0, y: 1, z: 0 }
): WorldSnapshot {
  if (!construction?.world?.blocks?.length) return base;
  const out: Voxel[] = base.blocks.slice();

  for (const b of construction.world.blocks) {
    out.push({ x: b.x + offset.x, y: b.y + offset.y, z: b.z + offset.z, type: b.type as any });
  }
  return { blocks: out };
}
