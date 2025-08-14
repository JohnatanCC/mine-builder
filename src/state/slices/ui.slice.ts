export type UISlice = {
  showWire: boolean;
  setShowWire: (v: boolean) => void;

  highlightColor: 'black' | 'white';
  setHighlightColor: (c: 'black' | 'white') => void;

  showFps: boolean;
  setShowFps: (v: boolean) => void;

  showHelp: boolean;
  setShowHelp: (v: boolean) => void;

  fogEnabled: boolean;
  setFogEnabled: (v: boolean) => void;
  fogDensity: number;
  setFogDensity: (v: number) => void;
};

export const createUISlice = (set: any): UISlice => ({
  showWire: false, // OFF por padrão
  setShowWire: (v) => set({ showWire: v }),

  highlightColor: 'white',
  setHighlightColor: (c) => set({ highlightColor: c }),

  showFps: true,
  setShowFps: (v) => set({ showFps: v }),

  showHelp: false,
  setShowHelp: (v) => set({ showHelp: v }),

  fogEnabled: false,
  setFogEnabled: (v) => set({ fogEnabled: v }),
  fogDensity: 0.015,
  setFogDensity: (v) => set({ fogDensity: v }),
});
