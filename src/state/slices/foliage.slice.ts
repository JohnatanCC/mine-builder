export type FoliageSlice = {
  foliageMode: 'block' | 'cross2' | 'cross3';
  setFoliageMode: (m: 'block' | 'cross2' | 'cross3') => void;

  leavesDensity: number;
  setLeavesDensity: (v: number) => void;
  leavesScale: number;
  setLeavesScale: (v: number) => void;
};

export const createFoliageSlice = (set: any): FoliageSlice => ({
  foliageMode: 'cross2',
  setFoliageMode: (m) => set({ foliageMode: m }),

  leavesDensity: 0.9,
  setLeavesDensity: (v) => set({ leavesDensity: v }),
  leavesScale: 1.12,
  setLeavesScale: (v) => set({ leavesScale: v }),
});
