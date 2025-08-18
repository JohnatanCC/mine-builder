import type { BlockData, BlockType } from "../../core/types";
import type { HistoryItem } from "./types";

export const HISTORY_LIMIT = 500;

export const setRaw = (
  state: { blocks: Map<string, BlockData> },
  k: string,
  type: BlockType
) => {
  const next = new Map(state.blocks);
  next.set(k, { type });
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
