// NEW FILE: src/state/slices/env.slice.ts
import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";
import type { EnvPreset } from "@/core/types";

export const createEnvSlice: StateCreator<
  WorldState,
  [],
  [],
  Partial<WorldState>
> = (set, get) => ({
  envPreset: "day" as EnvPreset,
  setEnvPreset: (p: EnvPreset) => set({ envPreset: p }),
  cycleEnvPreset: () => {
    const order: EnvPreset[] = ["day", "dusk", "night"];
    const cur = get().envPreset ?? "day";
    const idx = order.indexOf(cur);
    set({ envPreset: order[(idx + 1) % order.length] });
  },
});
