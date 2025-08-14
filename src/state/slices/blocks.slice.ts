import { key } from "../../core/keys";
import type { BlockData, BlockType, Pos } from "../../core/types";

export type BlocksSlice = {
  blocks: Map<string, BlockData>;
  hasBlock: (pos: Pos) => boolean;
  setBlockSilent: (pos: Pos, type: BlockType) => void;
  removeBlockSilent: (pos: Pos) => void;

  setBlock: (pos: Pos, type: BlockType) => void;
  removeBlock: (pos: Pos) => void;
};

export const createBlocksSlice = (set: any, get: any): BlocksSlice => ({
  blocks: new Map(),

  hasBlock: (pos) => get().blocks.has(key(...pos)),

  setBlockSilent: (pos, type) =>
    set((state: any) => {
      const k = key(...pos);
      if (state.blocks.has(k)) return {};
      const next = new Map(state.blocks);
      next.set(k, { type });
      return { blocks: next };
    }),

  removeBlockSilent: (pos) =>
    set((state: any) => {
      const k = key(...pos);
      if (!state.blocks.has(k)) return {};
      const next = new Map(state.blocks);
      next.delete(k);
      return { blocks: next };
    }),

  setBlock: (pos, type) =>
    set((state: any) => {
      const k = key(...pos);
      if (state.blocks.has(k)) return {};
      const next = new Map(state.blocks);
      next.set(k, { type });

      // histórico (item simples; strokes são geridos em history.slice)
      const op = { kind: "place", key: k, type } as const;
      const past = state.currentStroke
        ? state.past // dentro de stroke agrupará no endStroke
        : state.past.concat(op);

      return {
        blocks: next,
        past,
        future: state.currentStroke ? state.future : [],
      };
    }),

  removeBlock: (pos) =>
    set((state: any) => {
      const k = key(...pos);
      const prev = state.blocks.get(k);
      if (!prev) return {};
      const next = new Map(state.blocks);
      next.delete(k);

      const op = { kind: "remove", key: k, prev } as const;
      const past = state.currentStroke ? state.past : state.past.concat(op);

      return {
        blocks: next,
        past,
        future: state.currentStroke ? state.future : [],
      };
    }),
});
