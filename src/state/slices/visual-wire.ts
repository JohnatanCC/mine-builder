import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";

export const createVisualWireSlice: StateCreator<
  WorldState,
  [],
  [],
  Partial<WorldState>
> = (set) => ({
  showWire: false,
  setShowWire: (v: boolean) => set({ showWire: v }),
});
