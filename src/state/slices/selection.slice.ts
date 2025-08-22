// UPDATE: src/state/slices/selection.slice.ts
import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";
// ⬇️ use SEMPRE o Mode do core
import type { Mode } from "@/core/types";

export const createSelectionSlice: StateCreator<WorldState, [], [], Partial<WorldState>> =
  (set) => ({
    // seus defaults reais aqui:
    current: "dirt" as any,
    setCurrent: (t) => set({ current: t }),

    // modo único e centralizado
    mode: "place" as Mode,
    setMode: (m: Mode) => set({ mode: m }),
  });
