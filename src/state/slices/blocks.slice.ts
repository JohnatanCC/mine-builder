import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";
import { key } from "../../core/keys";
import { pushPastLimited, setRaw, removeRaw } from "../utils/store-helpers";

/** Aceita tanto tupla [x,y,z] quanto objeto {x,y,z} e retorna a key canônica */
type Pos3 = Readonly<[number, number, number]> | { x: number; y: number; z: number };
const keyFromPos = (pos: Pos3) => {
  if (Array.isArray(pos)) {
    return key(pos[0], pos[1], pos[2]);
  } else {
    return key((pos as { x: number; y: number; z: number }).x, (pos as { x: number; y: number; z: number }).y, (pos as { x: number; y: number; z: number }).z);
  }
};

export const createBlocksSlice: StateCreator<
  WorldState,
  [],
  [],
  Partial<WorldState>
> = (set, get) => ({
  blocks: new Map(),

  setBlock: (pos, type) =>
    set((state) => {
      const k = keyFromPos(pos);
      if (state.blocks.has(k)) return {};
      const blocks = setRaw(state, k, type);
      const variant = state.currentVariant || "block";
      const rotation = state.currentRotation || { x: 0, y: 0, z: 0 };

      if (state.currentStroke) {
        return {
          blocks,
          currentStroke: state.currentStroke.concat({ kind: "place", key: k, type, variant, rotation }),
        };
      }
      return {
        blocks,
        past: pushPastLimited(state.past, { kind: "place", key: k, type, variant, rotation }),
        future: [],
      };
    }),

  removeBlock: (pos) =>
    set((state) => {
      const k = keyFromPos(pos);
      const prev = state.blocks.get(k);
      if (!prev) return {};
      const blocks = removeRaw(state, k);

      if (state.currentStroke) {
        return {
          blocks,
          currentStroke: state.currentStroke.concat({ kind: "remove", key: k, prev }),
        };
      }
      return {
        blocks,
        past: pushPastLimited(state.past, { kind: "remove", key: k, prev }),
        future: [],
      };
    }),

  hasBlock: (pos) => get().blocks.has(keyFromPos(pos)),

  getBlock: (pos: Pos3) => get().blocks.get(keyFromPos(pos)) || null,

  setBlockSilent: (pos, type) =>
    set((state) => {
      const k = keyFromPos(pos);
      if (state.blocks.has(k)) return {};
      return { blocks: setRaw(state, k, type) };
    }),

  removeBlockSilent: (pos) =>
    set((state) => {
      const k = keyFromPos(pos);
      if (!state.blocks.has(k)) return {};
      return { blocks: removeRaw(state, k) };
    }),
});
