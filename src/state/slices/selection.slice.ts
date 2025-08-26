// UPDATE: src/state/slices/selection.slice.ts
import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";
import type { Mode, BlockType, BlockVariant, BlockRotation } from "@/core/types";

export const createSelectionSlice: StateCreator<WorldState, [], [], Partial<WorldState>> =
  (set) => ({
    // seus defaults reais aqui:
    current: "dirt" as BlockType,
    setCurrent: (t) => set({ current: t }),

    // variante atual do bloco
    currentVariant: "block" as BlockVariant,
    setCurrentVariant: (v: BlockVariant) => set({ currentVariant: v }),

    // rotação atual do bloco
    currentRotation: { x: 0, y: 0, z: 0 } as BlockRotation,
    setCurrentRotation: (r: BlockRotation) => set({ currentRotation: r }),

    // funções de rotação
    rotateBlockHorizontal: () => set((state) => {
      const newRotation = { ...state.currentRotation };
      newRotation.y = (newRotation.y + 90) % 360;
      return { currentRotation: newRotation };
    }),

    rotateBlockVertical: () => set((state) => {
      const newRotation = { ...state.currentRotation };
      newRotation.x = (newRotation.x + 90) % 360;
      return { currentRotation: newRotation };
    }),

    // modo único e centralizado
    mode: "place" as Mode,
    setMode: (m: Mode) => set({ mode: m }),
  });
