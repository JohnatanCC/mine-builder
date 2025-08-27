// UPDATE: src/state/world.store.ts
import { create } from "zustand";
import type {
  BlockType,
  BlockData,
  BlockVariant,
  BlockRotation,
  Mode,
  Tool,
  Pos,
  CameraMode,
  EnvPreset,
} from "../core/types";
import type { AmbientId } from "../audio/ambient";
import type { HistoryItem, HistoryOp } from "./utils/types";
import { key as makeKey, parseKey } from "../core/keys";

// ===== Snapshot types =====
export type Voxel = { 
  x: number; 
  y: number; 
  z: number; 
  type: BlockType;
  variant?: BlockVariant;
  rotation?: BlockRotation;
};
export type WorldSnapshot = {
  seed?: number;
  blocks: Voxel[];
};

// ===== WorldState =====
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
  currentVariant: BlockVariant;
  setCurrentVariant: (v: BlockVariant) => void;
  currentRotation: BlockRotation;
  setCurrentRotation: (r: BlockRotation) => void;
  rotateBlockHorizontal: () => void;
  rotateBlockVertical: () => void;
  mode: Mode;
  setMode: (m: Mode) => void;

  // tools.slice
  currentTool: Tool;
  setCurrentTool: (t: Tool) => void;
  lineStart: Pos | null;
  setLineStart: (pos: Pos | null) => void;
  lineEnd: Pos | null;
  setLineEnd: (pos: Pos | null) => void;
  copyPreview: Pos[] | null;
  setCopyPreview: (positions: Pos[] | null) => void;

  // visual-wire.slice
  showWire: boolean;
  setShowWire: (v: boolean) => void;

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

  // snapshot API
  getSnapshot: () => WorldSnapshot;
  loadSnapshot: (snap: WorldSnapshot) => void;

  // env.slice
  envPreset: EnvPreset;
  setEnvPreset: (p: EnvPreset) => void;
  cycleEnvPreset: () => void;

  // Preset de renderização (Desempenho/Qualidade)
  renderPreset: RenderPreset;
  renderSettings: RenderSettings;
  setRenderPreset: (p: RenderPreset) => void;
  toggleRenderPreset: () => void;
};

// ===== importar slices =====
import { createBlocksSlice } from "./slices/blocks.slice";
import { createSelectionSlice } from "./slices/selection.slice";
import { createInputSlice } from "./slices/input.slice";
import { createUISlice } from "./slices/ui.slice";
import { createHistorySlice } from "./slices/history.slice";
import { createAnimSlice } from "./slices/anim.slice";
import { createAudioSlice } from "./slices/audio.slice";
import { createEnvSlice } from "./slices/env.slice";
import { createVisualWireSlice } from "./slices/visual-wire";
import { createToolsSlice } from "./slices/tools.slice";
import { createRenderSlice, type RenderPreset, type RenderSettings } from "./slices/render.slice";

// ===== create store =====
export const useWorld = create<WorldState>()((set, get, api) => {
  const S = {
    ...createBlocksSlice(set, get, api),
    ...createSelectionSlice(set, get, api),
    ...createInputSlice(set, get, api),
    ...createUISlice(set, get, api),
    ...createHistorySlice(set, get, api),
    ...createAnimSlice(set, get, api),
    ...createEnvSlice(set, get, api),
    ...createAudioSlice(set, get, api),
    ...createVisualWireSlice(set, get, api),
    ...createToolsSlice(set, get, api),
    ...createRenderSlice(set, get, api),
  } as Partial<WorldState> & Record<string, any>;

  const safeBlocks = S.blocks ?? new Map<string, BlockData>();

  // === Snapshot API ===
  const getSnapshot = (): WorldSnapshot => {
    const voxels: Voxel[] = [];
    const blocks = get().blocks ?? safeBlocks;
    for (const [k, data] of blocks.entries()) {
      const [x, y, z] = parseKey(k);
      const blockData = data as BlockData;
      voxels.push({ 
        x, 
        y, 
        z, 
        type: blockData.type,
        variant: blockData.variant,
        rotation: blockData.rotation
      });
    }
    return { blocks: voxels };
  };

  const loadSnapshot = (snap: WorldSnapshot) => {
    if (!snap || !Array.isArray(snap.blocks)) return;
    const next = new Map<string, BlockData>();
    for (const v of snap.blocks) {
      next.set(makeKey(v.x, v.y, v.z), { 
        type: v.type,
        variant: v.variant || "block",
        rotation: v.rotation || { x: 0, y: 0, z: 0 }
      } as BlockData);
    }
    set({
      blocks: next,
      effects: [],
      past: [],
      future: [],
      currentStroke: null,
    });
  };

  return {
    // blocks
    blocks: safeBlocks,
    setBlock: S.setBlock!,
    removeBlock: S.removeBlock!,
    hasBlock: S.hasBlock!,
    setBlockSilent: S.setBlockSilent!,
    removeBlockSilent: S.removeBlockSilent!,

    // selection
    current: S.current!,
    setCurrent: S.setCurrent!,
    currentVariant: S.currentVariant!,
    setCurrentVariant: S.setCurrentVariant!,
    currentRotation: S.currentRotation!,
    setCurrentRotation: S.setCurrentRotation!,
    rotateBlockHorizontal: S.rotateBlockHorizontal!,
    rotateBlockVertical: S.rotateBlockVertical!,
    mode: S.mode!,
    setMode: S.setMode!,

    // tools
    currentTool: S.currentTool!,
    setCurrentTool: S.setCurrentTool!,
    lineStart: S.lineStart!,
    setLineStart: S.setLineStart!,
    lineEnd: S.lineEnd!,
    setLineEnd: S.setLineEnd!,
    copyPreview: S.copyPreview!,
    setCopyPreview: S.setCopyPreview!,

    // wireframe
    showWire: S.showWire!,
    setShowWire: S.setShowWire!,

    // input
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

    // ui
    showFps: S.showFps!,
    setShowFps: S.setShowFps!,
    showHelp: S.showHelp!,
    setShowHelp: S.setShowHelp!,
    cameraMode: S.cameraMode!,
    setCameraMode: S.setCameraMode!,

    // history
    past: S.past!,
    future: S.future!,
    currentStroke: S.currentStroke!,
    beginStroke: S.beginStroke!,
    endStroke: S.endStroke!,
    undo: S.undo!,
    redo: S.redo!,
    canUndo: S.canUndo!,
    canRedo: S.canRedo!,

    // anim
    blockAnimEnabled: S.blockAnimEnabled!,
    setBlockAnimEnabled: S.setBlockAnimEnabled!,
    blockAnimDuration: S.blockAnimDuration!,
    setBlockAnimDuration: S.setBlockAnimDuration!,
    blockAnimBounce: S.blockAnimBounce!,
    setBlockAnimBounce: S.setBlockAnimBounce!,
    effects: S.effects ?? [],
    addRemoveEffect: S.addRemoveEffect!,
    gcEffects: S.gcEffects!,

    // audio
    audioEnabled: S.audioEnabled!,
    setAudioEnabled: S.setAudioEnabled!,
    audioVolume: S.audioVolume!,
    setAudioVolume: S.setAudioVolume!,
    audioTracks: S.audioTracks!,
    currentTrack: S.currentTrack!,
    setCurrentTrack: S.setCurrentTrack!,

    // env
    envPreset: S.envPreset!,
    setEnvPreset: S.setEnvPreset!,
    cycleEnvPreset: S.cycleEnvPreset!,

        renderPreset: S.renderPreset!,
    renderSettings: S.renderSettings!,
    setRenderPreset: S.setRenderPreset!,
    toggleRenderPreset: S.toggleRenderPreset!,

    // snapshot
    getSnapshot,
    loadSnapshot,
    
  };
});

// === Import helpers ===
type ExternalBlock = {
  x: number;
  y: number;
  z: number;
  type: BlockType | string;
  variant?: BlockVariant | string;
  rotation?: BlockRotation;
};
function hasWorld(
  obj: unknown
): obj is { world: { blocks?: ExternalBlock[] } } {
  return (
    !!obj && typeof obj === "object" && "world" in obj && !!(obj as any).world
  );
}
function hasBlocks(obj: unknown): obj is { blocks?: ExternalBlock[] } {
  return !!obj && typeof obj === "object" && "blocks" in obj;
}
function externalToSnapshot(payload: unknown): WorldSnapshot {
  let arr: ExternalBlock[] = [];
  if (hasWorld(payload) && Array.isArray(payload.world.blocks))
    arr = payload.world.blocks;
  else if (hasBlocks(payload) && Array.isArray(payload.blocks))
    arr = payload.blocks;
  const voxels: Voxel[] = arr.map((b) => ({
    x: Number(b.x) | 0,
    y: Number(b.y) | 0,
    z: Number(b.z) | 0,
    type: b.type as BlockType,
    // Backward compatibility: suporte a arquivos antigos sem variant/rotation
    variant: (b.variant as BlockVariant) || "block",
    rotation: b.rotation || { x: 0, y: 0, z: 0 }
  }));
  return { blocks: voxels };
}
export function importWorld(payload: unknown) {
  const snap = externalToSnapshot(payload);
  useWorld.getState().loadSnapshot(snap);
}
