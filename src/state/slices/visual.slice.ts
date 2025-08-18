import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";

export const createVisualSlice: StateCreator<WorldState, [], [], Partial<WorldState>> = (set) => ({
  showWire: false,
  setShowWire: (v) => set({ showWire: v }),

  highlightColor: "white",
  setHighlightColor: (c) => set({ highlightColor: c }),

  fogEnabled: false,
  setFogEnabled: (v) => set({ fogEnabled: v }),
  fogDensity: 0.015,
  setFogDensity: (v) => set({ fogDensity: v }),

  lightAnimate: true,
  setLightAnimate: (v) => set({ lightAnimate: v }),
  lightSpeed: 0.15,
  setLightSpeed: (v) => set({ lightSpeed: v }),
  lightIntensity: 0.9,
  setLightIntensity: (v) => set({ lightIntensity: v }),

  foliageMode: "cross2",
  setFoliageMode: (m) => set({ foliageMode: m }),
  leavesDensity: 0.9,
  setLeavesDensity: (v) => set({ leavesDensity: v }),
  leavesScale: 1.12,
  setLeavesScale: (v) => set({ leavesScale: v }),

  windEnabled: true,
  setWindEnabled: (v) => set({ windEnabled: v }),
  windStrength: 0.35,
  setWindStrength: (v) => set({ windStrength: v }),
  windSpeed: 0.6,
  setWindSpeed: (v) => set({ windSpeed: v }),
});
