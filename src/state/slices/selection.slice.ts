import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";

export const createSelectionSlice: StateCreator<WorldState, [], [], Partial<WorldState>> = (set) => ({
  current: "stone",
  setCurrent: (t) => set({ current: t }),

  mode: "place",
  setMode: (m) => set({ mode: m }),
});
