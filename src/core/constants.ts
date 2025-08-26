import type { EnvPreset, Pos } from "./types";

// src/core/constants.ts
export type FaceName = "top" | "bottom" | "north" | "south" | "east" | "west";

/**
 * Raiz das texturas de blocos. Mantém compat com sua estrutura atual.
 * Se mover a pasta, ajuste aqui.
 */
export const TEXTURES_BLOCKS_DIR = "../src/assets/textures/blocks";

/** Filtros padrão (pixel-art) aplicados às texturas */
export const PIXEL_FILTERS = {
  mipmaps: true as const,
};

/**
 * Layout da aplicação (não empurra o inspector!).
 * leftWidth é apenas a barra de ferramentas (72px fixos).
 */
export const UI_SHELL = {
  leftWidth: 340,   // toolbar de ícones  
  rightWidth: 300, // inspector
  topHeight: 40,
  bottomHeight: 84,
} as const;

/**
 * Helpers de posicionamento para overlays que NÃO alteram o grid.
 */
export const overlayOffsets = {
  margin: 8,
  leftX() { return UI_SHELL.leftWidth + this.margin; },
  rightX() { return UI_SHELL.rightWidth + this.margin; },
  topY() { return UI_SHELL.topHeight + this.margin; },
  bottomY() { return UI_SHELL.bottomHeight + this.margin; },
};

/** Hotbar (slots) */
export const UI_HOTBAR_SLOT_SIZE = 46;
export const UI_HOTBAR_GAP = 8;

export type UIHotbarPlacement = "bottom-left" | "bottom-center" | "right-dock";
export const UI_HOTBAR_PLACEMENT: UIHotbarPlacement = "bottom-left";

/* --------------------------------------------------------------------------------
   TINTS (folhas/grama)
   --------------------------------------------------------------------------------
   ❗ Correção do bug: antes existia UM único TINT_LEAVES (todas as folhas iguais).
   Agora usamos tints POR ESPÉCIE. Utilize `getLeafTint(blockType)` no loader/material.
   A grama não deve receber tinta (mantemos a const só por compat, mas evite usar).
----------------------------------------------------------------------------------*/

/** Paleta de tint por espécie de folha (ajuste as cores ao seu gosto) */
export const LEAF_TINTS: Record<
  // use strings p/ evitar dependência circular com BlockType aqui
  "oak_leaves" | "spruce_leaves" | "birch_leaves",
  string
> = {
  oak_leaves:    "#3ab83a", // carvalho (vibrante)
  spruce_leaves: "#2f6b2a", // pinheiro (mais escuro/frio)
  birch_leaves:  "#6ac96a", // bétula (claro e vivo)
};

/**
 * Helper seguro: retorna a cor adequada para o tipo de folha,
 * ou `undefined` se o tipo não for folha (não aplica tinta).
 */
export function getLeafTint(type: string): string | undefined {
  return (LEAF_TINTS as Record<string, string | undefined>)[type];
}

/** ⚠️ DEPRECATED: manter por compat, mas NÃO use. Pintava todas as folhas iguais. */
export const TINT_LEAVES = LEAF_TINTS.oak_leaves;

/** ⚠️ DEPRECATED: grama não é mais tingida. Mantido apenas por compat. */
export const TINT_GRASS = undefined as unknown as string;

// UPDATE: src/core/constants.ts
export const ANIM = {
  // Duração única base de voxel (ms)
  duration: 320,

  // Entrada do bloco (sutil)
  place: {
    rotMax: Math.PI * 0.35,  // ~63°
    scaleStart: 0.88,        // nasce quase no final
    riseFactor: 0.35,        // fração do "rise" da saída
  },

  // Saída (ghost que sobe e encolhe)
  remove: {
    rise: 0.25,
  },

  // Highlight/ghost de mira
  hover: {
    pulseSpeed: 2.2,  // Hz (ciclos/seg)
    min: 0.15,
    max: 0.45,
  },

  // UI (botões, toggles)
  ui: {
    pressScale: 0.96,
    durationMs: 140,
  },
} as const;
export const BUILD_AREA_SIZE = 64;             
export const BUILD_AREA_OFFSET: [number, number, number] = [0, 0, 0];

export const ENV_PRESETS: Record<EnvPreset, {
  skyTop: string; skyBottom: string;
  dirPosition: [number, number, number]; // relativo ao centro
  dirColor: string; dirIntensity: number;
  ambient: number; hemi: number; hemiSky: string; hemiGround: string;
}> = {
  day: {
    skyTop: "#7ec8ff", skyBottom: "#0b0f1a",
    dirPosition: [0.35, 0.30, 0.15],
    dirColor: "#fff7e6", dirIntensity: 1.1,
    ambient: 0.18, hemi: 0.28, hemiSky: "#9fbaff", hemiGround: "#2b2b2b",
  },
  dusk: {
    skyTop: "#C4844F", skyBottom: "#0a0e18",
    dirPosition: [0.1, 0.22, 0.38],
    dirColor: "#ffd7a1", dirIntensity: 0.85,
    ambient: 0.15, hemi: 0.22, hemiSky: "#8aa7ff", hemiGround: "#24242a",
  },
  night: {
    skyTop: "#1a2236", skyBottom: "#070a12",
    dirPosition: [0.25, 0.15, -0.3],
    dirColor: "#b9ccff", dirIntensity: 0.35,
    ambient: 0.10, hemi: 0.18, hemiSky: "#6b7c9e", hemiGround: "#151720",
  },
};

export const GROUND_SIZE = 24;
export const ACTION_COOLDOWN = 120;
export const DRAG_THRESHOLD = 4;

// core/keys.ts
export const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
export const parseKey = (k: string) => k.split(",").map(Number) as Pos;