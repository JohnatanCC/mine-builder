import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";

export const createUISlice: StateCreator<WorldState, [], [], Partial<WorldState>> = (set) => ({
  showFps: true,
  setShowFps: (v) => set({ showFps: v }),

  showHelp: false,
  setShowHelp: (v) => set({ showHelp: v }),

  cameraMode: "orbit",
  setCameraMode: (m) => set({ cameraMode: m }),
});
