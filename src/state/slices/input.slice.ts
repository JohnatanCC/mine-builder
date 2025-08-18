import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";

export const createInputSlice: StateCreator<WorldState, [], [], Partial<WorldState>> = (set) => ({
  hoveredKey: null,
  setHoveredKey: (k) => set({ hoveredKey: k }),

  hoveredAdj: null,
  setHoveredAdj: (p) => set({ hoveredAdj: p }),

  mouse: { x: 0, y: 0 },
  setMouse: (x, y) => set({ mouse: { x, y } }),

  lastActionAt: 0,
  setLastActionAt: (t) => set({ lastActionAt: t }),

  isCtrlDown: false,
  setCtrlDown: (v) => set({ isCtrlDown: v }),
});
