import { create } from "zustand";
import type { BlockType, BlockData, Mode, Pos, CameraMode } from "../core/types";
import type { AmbientId } from "../audio/ambient";
import type { HistoryItem, HistoryOp } from "./utils/types";

// WorldState central apenas para tipagem (soma das chaves dos slices)
export type WorldState = {
  // blocks.slice
  blocks: Map<string, BlockData>;
  setBlock: (pos: Pos, type: BlockType) => void;
  removeBlock: (pos: Pos) => void;
  hasBlock: (pos: Pos) => boolean;
  setBlockSilent: (pos: Pos, type: BlockType) => void;
  removeBlockSilent: (pos: Pos) => void;

  // selection.slice
  current: BlockType;
  setCurrent: (t: BlockType) => void;
  mode: Mode;
  setMode: (m: Mode) => void;

  // visual.slice
  showWire: boolean; setShowWire: (v: boolean) => void;
  highlightColor: "black" | "white"; setHighlightColor: (c: "black" | "white") => void;
  fogEnabled: boolean; setFogEnabled: (v: boolean) => void;
  fogDensity: number; setFogDensity: (v: number) => void;
  lightAnimate: boolean; setLightAnimate: (v: boolean) => void;
  lightSpeed: number; setLightSpeed: (v: number) => void;
  lightIntensity: number; setLightIntensity: (v: number) => void;
  foliageMode: "block" | "cross2" | "cross3"; setFoliageMode: (m: "block" | "cross2" | "cross3") => void;
  leavesDensity: number; setLeavesDensity: (v: number) => void;
  leavesScale: number; setLeavesScale: (v: number) => void;
  windEnabled: boolean; setWindEnabled: (v: boolean) => void;
  windStrength: number; setWindStrength: (v: number) => void;
  windSpeed: number; setWindSpeed: (v: number) => void;

  // input.slice
  hoveredKey?: string | null; setHoveredKey: (k?: string | null) => void;
  hoveredAdj: Pos | null; setHoveredAdj: (p: Pos | null) => void;
  mouse: { x: number; y: number }; setMouse: (x: number, y: number) => void;
  lastActionAt: number; setLastActionAt: (t: number) => void;
  isCtrlDown: boolean; setCtrlDown: (v: boolean) => void;

  // ui.slice
  showFps: boolean; setShowFps: (v: boolean) => void;
  showHelp: boolean; setShowHelp: (v: boolean) => void;
  cameraMode: CameraMode; setCameraMode: (m: CameraMode) => void;

  // history.slice
  past: HistoryItem[]; future: HistoryItem[]; currentStroke: HistoryOp[] | null;
  beginStroke: () => void; endStroke: () => void;
  undo: () => void; redo: () => void;
  canUndo: () => boolean; canRedo: () => boolean;

  // anim.slice
  blockAnimEnabled: boolean; setBlockAnimEnabled: (v: boolean) => void;
  blockAnimDuration: number; setBlockAnimDuration: (v: number) => void;
  blockAnimBounce: number; setBlockAnimBounce: (v: number) => void;
  effects: { id: number; pos: Pos; type: BlockType; t0: number; duration: number }[];
  addRemoveEffect: (pos: Pos, type: BlockType, duration?: number) => void;
  gcEffects: () => void;

  // audio.slice
  audioEnabled: boolean; setAudioEnabled: (v: boolean) => void;
  audioVolume: number; setAudioVolume: (v: number) => void;
  audioTracks: AmbientId[]; currentTrack: AmbientId; setCurrentTrack: (id: AmbientId) => void;
};

// importar e combinar os slices
import { createBlocksSlice }   from "./slices/blocks.slice";
import { createSelectionSlice } from "./slices/selection.slice";
import { createVisualSlice }    from "./slices/visual.slice";
import { createInputSlice }     from "./slices/input.slice";
import { createUISlice }        from "./slices/ui.slice";
import { createHistorySlice }   from "./slices/history.slice";
import { createAnimSlice }      from "./slices/anim.slice";
import { createAudioSlice }     from "./slices/audio.slice";

export const useWorld = create<WorldState>()((...a) => {
  const blocksSlice = createBlocksSlice(...a);
  const selectionSlice = createSelectionSlice(...a);
  const visualSlice = createVisualSlice(...a);
  const inputSlice = createInputSlice(...a);
  const uiSlice = createUISlice(...a);
  const historySlice = createHistorySlice(...a);
  const animSlice = createAnimSlice(...a);
  const audioSlice = createAudioSlice(...a);

  return {
    // Ensure all required properties are always defined
    blocks: blocksSlice.blocks ?? new Map<string, BlockData>(),
    setBlock: blocksSlice.setBlock!,
    removeBlock: blocksSlice.removeBlock!,
    hasBlock: blocksSlice.hasBlock!,
    setBlockSilent: blocksSlice.setBlockSilent!,
    removeBlockSilent: blocksSlice.removeBlockSilent!,

    current: selectionSlice.current!,
    setCurrent: selectionSlice.setCurrent!,
    mode: selectionSlice.mode!,
    setMode: selectionSlice.setMode!,

    showWire: visualSlice.showWire!,
    setShowWire: visualSlice.setShowWire!,
    highlightColor: visualSlice.highlightColor!,
    setHighlightColor: visualSlice.setHighlightColor!,
    fogEnabled: visualSlice.fogEnabled!,
    setFogEnabled: visualSlice.setFogEnabled!,
    fogDensity: visualSlice.fogDensity!,
    setFogDensity: visualSlice.setFogDensity!,
    lightAnimate: visualSlice.lightAnimate!,
    setLightAnimate: visualSlice.setLightAnimate!,
    lightSpeed: visualSlice.lightSpeed!,
    setLightSpeed: visualSlice.setLightSpeed!,
    lightIntensity: visualSlice.lightIntensity!,
    setLightIntensity: visualSlice.setLightIntensity!,
    foliageMode: visualSlice.foliageMode!,
    setFoliageMode: visualSlice.setFoliageMode!,
    leavesDensity: visualSlice.leavesDensity!,
    setLeavesDensity: visualSlice.setLeavesDensity!,
    leavesScale: visualSlice.leavesScale!,
    setLeavesScale: visualSlice.setLeavesScale!,
    windEnabled: visualSlice.windEnabled!,
    setWindEnabled: visualSlice.setWindEnabled!,
    windStrength: visualSlice.windStrength!,
    setWindStrength: visualSlice.setWindStrength!,
    windSpeed: visualSlice.windSpeed!,
    setWindSpeed: visualSlice.setWindSpeed!,

    hoveredKey: inputSlice.hoveredKey,
    setHoveredKey: inputSlice.setHoveredKey!,
    hoveredAdj: inputSlice.hoveredAdj!,
    setHoveredAdj: inputSlice.setHoveredAdj!,
    mouse: inputSlice.mouse!,
    setMouse: inputSlice.setMouse!,
    lastActionAt: inputSlice.lastActionAt!,
    setLastActionAt: inputSlice.setLastActionAt!,
    isCtrlDown: inputSlice.isCtrlDown!,
    setCtrlDown: inputSlice.setCtrlDown!,

    showFps: uiSlice.showFps!,
    setShowFps: uiSlice.setShowFps!,
    showHelp: uiSlice.showHelp!,
    setShowHelp: uiSlice.setShowHelp!,
    cameraMode: uiSlice.cameraMode!,
    setCameraMode: uiSlice.setCameraMode!,

    past: historySlice.past!,
    future: historySlice.future!,
    currentStroke: historySlice.currentStroke!,
    beginStroke: historySlice.beginStroke!,
    endStroke: historySlice.endStroke!,
    undo: historySlice.undo!,
    redo: historySlice.redo!,
    canUndo: historySlice.canUndo!,
    canRedo: historySlice.canRedo!,

    blockAnimEnabled: animSlice.blockAnimEnabled!,
    setBlockAnimEnabled: animSlice.setBlockAnimEnabled!,
    blockAnimDuration: animSlice.blockAnimDuration!,
    setBlockAnimDuration: animSlice.setBlockAnimDuration!,
    blockAnimBounce: animSlice.blockAnimBounce!,
    setBlockAnimBounce: animSlice.setBlockAnimBounce!,
    effects: animSlice.effects!,
    addRemoveEffect: animSlice.addRemoveEffect!,
    gcEffects: animSlice.gcEffects!,

    audioEnabled: audioSlice.audioEnabled!,
    setAudioEnabled: audioSlice.setAudioEnabled!,
    audioVolume: audioSlice.audioVolume!,
    setAudioVolume: audioSlice.setAudioVolume!,
    audioTracks: audioSlice.audioTracks!,
    currentTrack: audioSlice.currentTrack!,
    setCurrentTrack: audioSlice.setCurrentTrack!,
  };
});
