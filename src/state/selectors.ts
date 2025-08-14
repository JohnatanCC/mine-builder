import type { WorldState } from "./world.store";


export const sel = {
  blocks: (s: WorldState ) => s.blocks,
  current: (s: WorldState) => s.current,
  showWire: (s: WorldState) => s.showWire,
  fogEnabled: (s: WorldState) => s.fogEnabled,
  fogDensity: (s: WorldState) => s.fogDensity,
  hoveredAdj: (s: WorldState) => s.hoveredAdj,
  highlightColor: (s: WorldState) => s.highlightColor,
  isCtrlDown: (s: WorldState) => s.isCtrlDown,
};
