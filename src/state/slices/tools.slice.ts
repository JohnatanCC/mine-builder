import type { StateCreator } from "zustand";
import type { WorldState } from "../world.store";
import type { Tool, Pos } from "@/core/types";

export const createToolsSlice: StateCreator<WorldState, [], [], Partial<WorldState>> = (set) => ({
  // ferramenta atual selecionada
  currentTool: "brush" as Tool,
  setCurrentTool: (t: Tool) => set({ currentTool: t }),

  // line tool state
  lineStart: null as Pos | null,
  setLineStart: (pos: Pos | null) => set({ lineStart: pos }),
  lineEnd: null as Pos | null,
  setLineEnd: (pos: Pos | null) => set({ lineEnd: pos }),

  // copy tool state
  copyPreview: null as Pos[] | null,
  setCopyPreview: (positions: Pos[] | null) => set({ copyPreview: positions }),
});