import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";

export type RenderPreset = "performance" | "quality";

export type RenderSettings = {
  shadows: boolean;
  antialias: boolean;
  dpr: number | [number, number];
  shadowMapSize: number;
};

export const RENDER_PRESETS: Record<RenderPreset, RenderSettings> = {
  performance: {
    shadows: false,
    antialias: false,
    dpr: [1, 1.25],
    shadowMapSize: 512,
  },
  quality: {
    shadows: true,
    antialias: true,
    dpr: [1, 2],
    shadowMapSize: 1024, // 1536 se quiser ainda mais nitidez
  },
};

export const createRenderSlice: StateCreator<
  WorldState,
  [],
  [],
  Partial<WorldState>
> = (set) => ({
  renderPreset: "quality",
  renderSettings: RENDER_PRESETS.quality,

  setRenderPreset: (p: RenderPreset) =>
    set({ renderPreset: p, renderSettings: RENDER_PRESETS[p] }),

  toggleRenderPreset: () =>
    set((s) => {
      const next = s.renderPreset === "quality" ? "performance" : "quality";
      return { renderPreset: next, renderSettings: RENDER_PRESETS[next] };
    }),
});
