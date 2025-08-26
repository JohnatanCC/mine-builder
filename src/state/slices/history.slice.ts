import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";
import type { HistoryOp } from "../utils/types";
import { pushPastLimited, removeRaw, setRaw } from "../utils/store-helpers";

export const createHistorySlice: StateCreator<
  WorldState,
  [],
  [],
  Partial<WorldState>
> = (set, get) => ({
  past: [],
  future: [],
  currentStroke: null,

  beginStroke: () => set({ currentStroke: [] }),

  endStroke: () =>
    set((state) => {
      const ops = state.currentStroke;
      if (!ops || ops.length === 0) return { currentStroke: null };
      return {
        past: pushPastLimited(state.past, { kind: "stroke", ops }),
        future: [],
        currentStroke: null,
      };
    }),

  undo: () =>
    set((state) => {
      const item = state.past[state.past.length - 1];
      if (!item) return {};

      let blocks = state.blocks;

      const undoOp = (op: HistoryOp) => {
        if (op.kind === "place") {
          blocks = removeRaw({ blocks }, op.key);
        } else {
          // op.kind === "remove"
          blocks = setRaw({ 
            blocks, 
            currentVariant: op.prev.variant,
            currentRotation: op.prev.rotation 
          }, op.key, op.prev.type);
        }
      };

      if ("ops" in item) {
        // stroke: desfaz em ordem inversa
        for (let i = item.ops.length - 1; i >= 0; i--) undoOp(item.ops[i]);
      } else {
        // operação unitária
        undoOp(item);
      }

      return {
        blocks,
        past: state.past.slice(0, -1),
        future: state.future.concat(item),
      };
    }),

  redo: () =>
    set((state) => {
      const item = state.future[state.future.length - 1];
      if (!item) return {};

      let blocks = state.blocks;

      const redoOp = (op: HistoryOp) => {
        if (op.kind === "place") {
          blocks = setRaw({ 
            blocks, 
            currentVariant: op.variant,
            currentRotation: op.rotation 
          }, op.key, op.type);
        } else {
          // op.kind === "remove"
          blocks = removeRaw({ blocks }, op.key);
        }
      };

      if ("ops" in item) {
        // stroke: refaz na ordem natural
        for (const op of item.ops) redoOp(op);
      } else {
        // operação unitária
        redoOp(item);
      }

      return {
        blocks,
        future: state.future.slice(0, -1),
        past: pushPastLimited(state.past, item),
      };
    }),

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
});
