import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";
import { key } from "../../core/keys";
import { pushPastLimited, setRaw, removeRaw } from "../utils/store-helpers";

export const createBlocksSlice: StateCreator<WorldState, [], [], Partial<WorldState>> = (set, get) => ({
  blocks: new Map(),

  setBlock: (pos, type) => set((state) => {
    const k = key(...pos);
    if (state.blocks.has(k)) return {};
    const blocks = setRaw(state, k, type);

    if (state.currentStroke) {
      return { blocks, currentStroke: state.currentStroke.concat({ kind: "place", key: k, type }) };
    }
    return { blocks, past: pushPastLimited(state.past, { kind: "place", key: k, type }), future: [] };
  }),

  removeBlock: (pos) => set((state) => {
    const k = key(...pos);
    const prev = state.blocks.get(k);
    if (!prev) return {};
    const blocks = removeRaw(state, k);

    if (state.currentStroke) {
      return { blocks, currentStroke: state.currentStroke.concat({ kind: "remove", key: k, prev }) };
    }
    return { blocks, past: pushPastLimited(state.past, { kind: "remove", key: k, prev }), future: [] };
  }),

  hasBlock: (pos) => get().blocks.has(key(...pos)),

  setBlockSilent: (pos, type) => set((state) => {
    const k = key(...pos);
    if (state.blocks.has(k)) return {};
    return { blocks: setRaw(state, k, type) };
  }),

  removeBlockSilent: (pos) => set((state) => {
    const k = key(...pos);
    if (!state.blocks.has(k)) return {};
    return { blocks: removeRaw(state, k) };
  }),
});
