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
  leftWidth: 380,   // toolbar de ícones
  rightWidth: 320, // inspector
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
