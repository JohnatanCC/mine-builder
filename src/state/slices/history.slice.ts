import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";
import type { HistoryOp } from "../utils/types";
import { pushPastLimited, removeRaw, setRaw } from "../utils/store-helpers";

export const createHistorySlice: StateCreator<WorldState, [], [], Partial<WorldState>> = (set, get) => ({
  past: [],
  future: [],
  currentStroke: null,

  beginStroke: () => set({ currentStroke: [] }),

  endStroke: () => set((state) => {
    const ops = state.currentStroke;
    if (!ops || ops.length === 0) return { currentStroke: null };
    return {
      past: pushPastLimited(state.past, { kind: "stroke", ops }),
      future: [],
      currentStroke: null,
    };
  }),

  undo: () => set((state) => {
    const item = state.past[state.past.length - 1];
    if (!item) return {};
    let blocks = state.blocks;

    const undoOp = (op: HistoryOp) => {
      if (op.kind === "place") blocks = removeRaw({ blocks }, op.key);
      else blocks = setRaw({ blocks }, op.key, op.prev.type);
    };

    if ("ops" in item) for (let i = item.ops.length - 1; i >= 0; i--) undoOp(item.ops[i]);
    else undoOp(item);

    return { blocks, past: state.past.slice(0, -1), future: state.future.concat(item) };
  }),

  redo: () => set((state) => {
    const item = state.future[state.future.length - 1];
    if (!item) return {};
    let blocks = state.blocks;

    const redoOp = (op: HistoryOp) => {
      if (op.kind === "place") blocks = setRaw({ blocks }, op.key, op.type);
      else blocks = removeRaw({ blocks }, op.key);
    };

    if ("ops" in item) for (const op of item.ops) redoOp(op);
    else redoOp(item);

    return { blocks, future: state.future.slice(0, -1), past: pushPastLimited(state.past, item) };
  }),

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
});
