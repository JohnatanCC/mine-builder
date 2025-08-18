import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";

export const createAnimSlice: StateCreator<WorldState, [], [], Partial<WorldState>> = (set) => ({
  blockAnimEnabled: true,
  setBlockAnimEnabled: (v) => set({ blockAnimEnabled: v }),

  blockAnimDuration: 220,
  setBlockAnimDuration: (v) => set({ blockAnimDuration: Math.max(60, v) }),

  blockAnimBounce: 0.25,
  setBlockAnimBounce: (v) => set({ blockAnimBounce: Math.max(0, Math.min(1, v)) }),

  effects: [],
  addRemoveEffect: (pos, type, duration) =>
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
      return { effects: state.effects.filter((e) => now - e.t0 < e.duration + 20) };
    }),
});
