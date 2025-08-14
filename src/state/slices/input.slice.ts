export type InputSlice = {
  mouse: { x: number; y: number };
  setMouse: (x: number, y: number) => void;

  isCtrlDown: boolean;
  setCtrlDown: (v: boolean) => void;

  current: string; // BlockType
  setCurrent: (t: any) => void;

  hoveredKey?: string | null;
  setHoveredKey: (k?: string | null) => void;

  hoveredAdj: any | null; // Pos
  setHoveredAdj: (p: any | null) => void;

  lastActionAt: number;
  setLastActionAt: (t: number) => void;
};

export const createInputSlice = (set: any): InputSlice => ({
  mouse: { x: 0, y: 0 },
  setMouse: (x, y) => set({ mouse: { x, y } }),

  isCtrlDown: false,
  setCtrlDown: (v) => set({ isCtrlDown: v }),

  current: 'stone',
  setCurrent: (t) => set({ current: t }),

  hoveredKey: null,
  setHoveredKey: (k) => set({ hoveredKey: k }),

  hoveredAdj: null,
  setHoveredAdj: (p) => set({ hoveredAdj: p }),

  lastActionAt: 0,
  setLastActionAt: (t) => set({ lastActionAt: t }),
});
