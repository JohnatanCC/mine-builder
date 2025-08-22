import type { WorldState } from "./world.store";


export const sel = {
  blocks: (s: WorldState ) => s.blocks,
  current: (s: WorldState) => s.current,
  showWire: (s: WorldState) => s.showWire,
  hoveredAdj: (s: WorldState) => s.hoveredAdj,
  isCtrlDown: (s: WorldState) => s.isCtrlDown,
};
