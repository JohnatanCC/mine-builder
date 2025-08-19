import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";
import type { BlockType, Mode } from "../../core/types";


export type SelectionMode = "place" | "remove" | "eyedropper";

export const createSelectionSlice: StateCreator<
  WorldState,
  [],
  [],
  Partial<WorldState>
> = (set) => ({
  // bloco selecionado atual
  current: "stone" as BlockType,
  setCurrent: (t: BlockType) => set({ current: t }),

  // modo de interação atual — deve ser do tipo Mode
  // exemplos típicos de Mode: "place" | "delete" | "eyedropper"
  mode: "place" as Mode,
  setMode: (m: Mode) => set({ mode: m }),
});
