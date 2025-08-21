// UPDATE: src/state/world.store.ts
import { create } from "zustand";
import type {
  BlockType,
  BlockData,
  Mode,
  Pos,
  CameraMode,
} from "../core/types";
import type { AmbientId } from "../audio/ambient";
import type { HistoryItem, HistoryOp } from "./utils/types";
import { key as makeKey, parseKey } from "../core/keys";

// ===== Snapshot types =====
export type Voxel = { x: number; y: number; z: number; type: BlockType };
export type WorldSnapshot = {
  seed?: number;
  blocks: Voxel[];
  // futuras props (luz, vento etc.)
};



// ===== WorldState (soma dos slices) =====
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
  showWire: boolean;
  setShowWire: (v: boolean) => void;
  highlightColor: "black" | "white";
  setHighlightColor: (c: "black" | "white") => void;
  fogEnabled: boolean;
  setFogEnabled: (v: boolean) => void;
  fogDensity: number;
  setFogDensity: (v: number) => void;
  lightAnimate: boolean;
  setLightAnimate: (v: boolean) => void;
  lightSpeed: number;
  setLightSpeed: (v: number) => void;
  lightIntensity: number;
  setLightIntensity: (v: number) => void;
  foliageMode: "block" | "cross2" | "cross3";
  setFoliageMode: (m: "block" | "cross2" | "cross3") => void;
  leavesDensity: number;
  setLeavesDensity: (v: number) => void;
  leavesScale: number;
  setLeavesScale: (v: number) => void;
  windEnabled: boolean;
  setWindEnabled: (v: boolean) => void;
  windStrength: number;
  setWindStrength: (v: number) => void;
  windSpeed: number;
  setWindSpeed: (v: number) => void;

  // input.slice
  hoveredKey?: string | null;
  setHoveredKey: (k?: string | null) => void;
  hoveredAdj: Pos | null;
  setHoveredAdj: (p: Pos | null) => void;
  mouse: { x: number; y: number };
  setMouse: (x: number, y: number) => void;
  lastActionAt: number;
  setLastActionAt: (t: number) => void;
  isCtrlDown: boolean;
  setCtrlDown: (v: boolean) => void;

  // ui.slice
  showFps: boolean;
  setShowFps: (v: boolean) => void;
  showHelp: boolean;
  setShowHelp: (v: boolean) => void;
  cameraMode: CameraMode;
  setCameraMode: (m: CameraMode) => void;

  // history.slice
  past: HistoryItem[];
  future: HistoryItem[];
  currentStroke: HistoryOp[] | null;
  beginStroke: () => void;
  endStroke: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // anim.slice
  blockAnimEnabled: boolean;
  setBlockAnimEnabled: (v: boolean) => void;
  blockAnimDuration: number;
  setBlockAnimDuration: (v: number) => void;
  blockAnimBounce: number;
  setBlockAnimBounce: (v: number) => void;
  effects: {
    id: number;
    pos: Pos;
    type: BlockType;
    t0: number;
    duration: number;
  }[];
  addRemoveEffect: (pos: Pos, type: BlockType, duration?: number) => void;
  gcEffects: () => void;

  // audio.slice
  audioEnabled: boolean;
  setAudioEnabled: (v: boolean) => void;
  audioVolume: number;
  setAudioVolume: (v: number) => void;
  audioTracks: AmbientId[];
  currentTrack: AmbientId;
  setCurrentTrack: (id: AmbientId) => void;

  // NEW: snapshot API
  getSnapshot: () => WorldSnapshot;
  loadSnapshot: (snap: WorldSnapshot) => void;
};

// ===== importar slices =====
import { createBlocksSlice } from "./slices/blocks.slice";
import { createSelectionSlice } from "./slices/selection.slice";
import { createVisualSlice } from "./slices/visual.slice";
import { createInputSlice } from "./slices/input.slice";
import { createUISlice } from "./slices/ui.slice";
import { createHistorySlice } from "./slices/history.slice";
import { createAnimSlice } from "./slices/anim.slice";
import { createAudioSlice } from "./slices/audio.slice";

// ===== create store (compacto) =====
export const useWorld = create<WorldState>()((set, get, api) => {
  const S = {
    ...createBlocksSlice(set, get, api),
    ...createSelectionSlice(set, get, api),
    ...createVisualSlice(set, get, api),
    ...createInputSlice(set, get, api),
    ...createUISlice(set, get, api),
    ...createHistorySlice(set, get, api),
    ...createAnimSlice(set, get, api),
    ...createAudioSlice(set, get, api),
  } as Partial<WorldState> & Record<string, any>;

  const safeBlocks = S.blocks ?? new Map<string, BlockData>();

  // === Snapshot API ===
  const getSnapshot = (): WorldSnapshot => {
    const voxels: Voxel[] = [];
    const blocks = get().blocks ?? safeBlocks;

    for (const [k, data] of blocks.entries()) {
      const [x, y, z] = parseKey(k); // Pos = [x,y,z]
      voxels.push({ x, y, z, type: (data as BlockData).type });
    }
    return { blocks: voxels };
  };

  const loadSnapshot = (snap: WorldSnapshot) => {
    if (!snap || !Array.isArray(snap.blocks)) return;

    // Recria o Map de forma imutável
    const next = new Map<string, BlockData>();
    for (const v of snap.blocks) {
      next.set(makeKey(v.x, v.y, v.z), { type: v.type } as BlockData);
    }

    // ✅ zustand set(): apenas 1-2 args (sem label) e merge parcial
    set({
      blocks: next,
      effects: [],
      past: [],
      future: [],
      currentStroke: null,
    });
  };

  return {
    blocks: safeBlocks,
    setBlock: S.setBlock!,
    removeBlock: S.removeBlock!,
    hasBlock: S.hasBlock!,
    setBlockSilent: S.setBlockSilent!,
    removeBlockSilent: S.removeBlockSilent!,

    current: S.current!,
    setCurrent: S.setCurrent!,
    mode: S.mode!,
    setMode: S.setMode!,

    showWire: S.showWire!,
    setShowWire: S.setShowWire!,
    highlightColor: S.highlightColor!,
    setHighlightColor: S.setHighlightColor!,
    fogEnabled: S.fogEnabled!,
    setFogEnabled: S.setFogEnabled!,
    fogDensity: S.fogDensity!,
    setFogDensity: S.setFogDensity!,
    lightAnimate: S.lightAnimate!,
    setLightAnimate: S.setLightAnimate!,
    lightSpeed: S.lightSpeed!,
    setLightSpeed: S.setLightSpeed!,
    lightIntensity: S.lightIntensity!,
    setLightIntensity: S.setLightIntensity!,
    foliageMode: S.foliageMode!,
    setFoliageMode: S.setFoliageMode!,
    leavesDensity: S.leavesDensity!,
    setLeavesDensity: S.setLeavesDensity!,
    leavesScale: S.leavesScale!,
    setLeavesScale: S.setLeavesScale!,
    windEnabled: S.windEnabled!,
    setWindEnabled: S.setWindEnabled!,
    windStrength: S.windStrength!,
    setWindStrength: S.setWindStrength!,
    windSpeed: S.windSpeed!,
    setWindSpeed: S.setWindSpeed!,

    hoveredKey: S.hoveredKey,
    setHoveredKey: S.setHoveredKey!,
    hoveredAdj: S.hoveredAdj!,
    setHoveredAdj: S.setHoveredAdj!,
    mouse: S.mouse!,
    setMouse: S.setMouse!,
    lastActionAt: S.lastActionAt!,
    setLastActionAt: S.setLastActionAt!,
    isCtrlDown: S.isCtrlDown!,
    setCtrlDown: S.setCtrlDown!,

    showFps: S.showFps!,
    setShowFps: S.setShowFps!,
    showHelp: S.showHelp!,
    setShowHelp: S.setShowHelp!,
    cameraMode: S.cameraMode!,
    setCameraMode: S.setCameraMode!,

    past: S.past!,
    future: S.future!,
    currentStroke: S.currentStroke!,
    beginStroke: S.beginStroke!,
    endStroke: S.endStroke!,
    undo: S.undo!,
    redo: S.redo!,
    canUndo: S.canUndo!,
    canRedo: S.canRedo!,

    blockAnimEnabled: S.blockAnimEnabled!,
    setBlockAnimEnabled: S.setBlockAnimEnabled!,
    blockAnimDuration: S.blockAnimDuration!,
    setBlockAnimDuration: S.setBlockAnimDuration!,
    blockAnimBounce: S.blockAnimBounce!,
    setBlockAnimBounce: S.setBlockAnimBounce!,
    effects: S.effects ?? [],
    addRemoveEffect: S.addRemoveEffect!,
    gcEffects: S.gcEffects!,

    audioEnabled: S.audioEnabled!,
    setAudioEnabled: S.setAudioEnabled!,
    audioVolume: S.audioVolume!,
    setAudioVolume: S.setAudioVolume!,
    audioTracks: S.audioTracks!,
    currentTrack: S.currentTrack!,
    setCurrentTrack: S.setCurrentTrack!,

    // === snapshot API ===
    getSnapshot,
    loadSnapshot,


  };
});
