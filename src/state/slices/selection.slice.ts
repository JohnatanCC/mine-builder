// UPDATE: src/state/slices/selection.slice.ts
import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";
import type { Mode, BlockType } from "@/core/types";

export const createSelectionSlice: StateCreator<WorldState, [], [], Partial<WorldState>> =
  (set) => ({
    // seus defaults reais aqui:
    current: "dirt" as BlockType,
    setCurrent: (t) => set({ current: t }),

    // modo único e centralizado
    mode: "place" as Mode,
    setMode: (m: Mode) => set({ mode: m }),
  });
