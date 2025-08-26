import type { BlockData, BlockType, BlockVariant, BlockRotation, StairShape } from "../../core/types";
import type { HistoryItem } from "./types";

export const HISTORY_LIMIT = 500;

export const setRaw = (
  state: { 
    blocks: Map<string, BlockData>; 
    currentVariant?: BlockVariant;
    currentRotation?: BlockRotation;
  },
  k: string,
  type: BlockType,
  variant?: BlockVariant,
  rotation?: BlockRotation,
  shape?: StairShape
) => {
  const next = new Map(state.blocks);
  const finalVariant = variant || state.currentVariant || "block";
  const finalRotation = rotation || state.currentRotation || { x: 0, y: 0, z: 0 };
  next.set(k, { type, variant: finalVariant, rotation: finalRotation, shape });
  return next;
};

export const removeRaw = (
  state: { blocks: Map<string, BlockData> },
  k: string
) => {
  const next = new Map(state.blocks);
  next.delete(k);
  return next;
};

export const pushPastLimited = (
  past: HistoryItem[],
  item: HistoryItem
): HistoryItem[] => {
  const next = past.concat(item);
  return next.length > HISTORY_LIMIT ? next.slice(next.length - HISTORY_LIMIT) : next;
};

// útil para área de construção fixa
export const inside = (x: number, z: number, size: number) =>
  x >= 0 && z >= 0 && x < size && z < size;
