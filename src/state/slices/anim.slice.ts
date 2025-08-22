// UPDATE: src/state/slices/anim.slice.ts
import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";
import type { Pos, BlockType } from "@/core/types";

export const createAnimSlice: StateCreator<
  WorldState,
  [],
  [],
  Partial<WorldState>
> = (set) => ({
  // Config
  blockAnimEnabled: true,
  setBlockAnimEnabled: (v: boolean) => set({ blockAnimEnabled: v }),

  blockAnimDuration: 220, // ms
  setBlockAnimDuration: (v: number) =>
    set({ blockAnimDuration: Math.max(60, v) }),

  blockAnimBounce: 0.25,
  setBlockAnimBounce: (v: number) =>
    set({ blockAnimBounce: Math.max(0, Math.min(1, v)) }),

  // Efeitos
  effects: [],
  addRemoveEffect: (pos: Pos, type: BlockType, duration?: number) =>
    set((state) => ({
      effects: state.effects.concat({
        id: Math.floor(Math.random() * 1e9),
        pos,
        type,
        t0: performance.now(),
        duration: duration ?? state.blockAnimDuration,
      }),
    })),

  gcEffects: () =>
    set((state) => {
      const now = performance.now();
      return {
        effects: state.effects.filter((e) => now - e.t0 < e.duration),
      };
    }),
});
