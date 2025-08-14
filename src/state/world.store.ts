import { create } from "zustand";
import type {
  BlockType,
  BlockData,
  Mode,
  Pos,
  CameraMode,
} from "../core/types";
import { key } from "../core/keys";

/* ========= Config ========= */
const HISTORY_LIMIT = 500; // limite opcional para evitar crescimento infinito

/* ========= Histórico ========= */
export type HistoryOp =
  | { kind: "place"; key: string; type: BlockType }
  | { kind: "remove"; key: string; prev: BlockData };

export type HistoryItem = HistoryOp | { kind: "stroke"; ops: HistoryOp[] };

/* ========= Estado ========= */
export type WorldState = {
  // Mundo
  blocks: Map<string, BlockData>;
  setBlock: (pos: Pos, type: BlockType) => void;
  removeBlock: (pos: Pos) => void;
  hasBlock: (pos: Pos) => boolean;

  // Seleção / modo (modo mantido p/ compat; brush agora é por Ctrl)
  current: BlockType;
  setCurrent: (t: BlockType) => void;
  mode: Mode;
  setMode: (m: Mode) => void;

  // Visual
  showWire: boolean;
  setShowWire: (v: boolean) => void;

  highlightColor: "black" | "white";
  setHighlightColor: (c: "black" | "white") => void;

  // Fog
  fogEnabled: boolean;
  setFogEnabled: (v: boolean) => void;
  fogDensity: number;
  setFogDensity: (v: number) => void;

  // Hover / input
  hoveredKey?: string | null;
  setHoveredKey: (k?: string | null) => void;
  hoveredAdj: Pos | null;
  setHoveredAdj: (p: Pos | null) => void;

  mouse: { x: number; y: number };
  setMouse: (x: number, y: number) => void;

  lastActionAt: number;
  setLastActionAt: (t: number) => void;

  // UI
  showFps: boolean;
  setShowFps: (v: boolean) => void;
  showHelp: boolean;
  setShowHelp: (v: boolean) => void;

  // Luz / Folhagem
  lightAnimate: boolean;
  setLightAnimate: (v: boolean) => void;
  lightSpeed: number;
  setLightSpeed: (v: number) => void;
  lightIntensity: number;                 // <<<<<<<<<< AQUI
  setLightIntensity: (v: number) => void; // <<<<<<<<<< AQUI

  foliageMode: "block" | "cross2" | "cross3";
  setFoliageMode: (m: "block" | "cross2" | "cross3") => void;

  leavesDensity: number;
  setLeavesDensity: (v: number) => void;
  leavesScale: number;
  setLeavesScale: (v: number) => void;

  // Vento
  windEnabled: boolean;
  setWindEnabled: (v: boolean) => void;
  windStrength: number;
  setWindStrength: (v: number) => void;
  windSpeed: number;
  setWindSpeed: (v: number) => void;

  // Câmera
  cameraMode: CameraMode;
  setCameraMode: (m: CameraMode) => void;

  // Modificadores
  isCtrlDown: boolean;
  setCtrlDown: (v: boolean) => void;

  // Histórico
  past: HistoryItem[];
  future: HistoryItem[];
  currentStroke: HistoryOp[] | null;
  beginStroke: () => void;
  endStroke: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Setters silenciosos (sem histórico)
  setBlockSilent: (pos: Pos, type: BlockType) => void;
  removeBlockSilent: (pos: Pos) => void;

   // Animação de blocos
  blockAnimEnabled: boolean;
  setBlockAnimEnabled: (v: boolean) => void;
  blockAnimDuration: number;  // ms
  setBlockAnimDuration: (v: number) => void;
  blockAnimBounce: number;    // 0..1 (intensidade do overshoot)
  setBlockAnimBounce: (v: number) => void;

  // Efeitos de remoção (transientes)
  effects: { id: number; pos: Pos; type: BlockType; t0: number; duration: number }[];
  addRemoveEffect: (pos: Pos, type: BlockType, duration?: number) => void;
  gcEffects: () => void;
};

/* ========= helpers ========= */
const setRaw = (
  state: { blocks: Map<string, BlockData> },
  k: string,
  type: BlockType
) => {
  const next = new Map(state.blocks);
  next.set(k, { type });
  return next;
};

const removeRaw = (state: { blocks: Map<string, BlockData> }, k: string) => {
  const next = new Map(state.blocks);
  next.delete(k);
  return next;
};

const pushPastLimited = (past: HistoryItem[], item: HistoryItem): HistoryItem[] => {
  const next = past.concat(item);
  return next.length > HISTORY_LIMIT ? next.slice(next.length - HISTORY_LIMIT) : next;
};

/* ========= store ========= */
export const useWorld = create<WorldState>((set, get) => ({
  /* --- mundo --- */
  blocks: new Map(),

  setBlock: (pos, type) =>
    set((state) => {
      const k = key(...pos);
      if (state.blocks.has(k)) return {};
      const blocks = setRaw(state, k, type);

      // dentro de stroke → acumula
      if (state.currentStroke) {
        return {
          blocks,
          currentStroke: state.currentStroke.concat({ kind: "place", key: k, type }),
        };
      }

      const past = pushPastLimited(state.past, { kind: "place", key: k, type });
      return { blocks, past, future: [] };
    }),

  removeBlock: (pos) =>
    set((state) => {
      const k = key(...pos);
      const prev = state.blocks.get(k);
      if (!prev) return {};
      const blocks = removeRaw(state, k);

      if (state.currentStroke) {
        return {
          blocks,
          currentStroke: state.currentStroke.concat({ kind: "remove", key: k, prev }),
        };
      }

      const past = pushPastLimited(state.past, { kind: "remove", key: k, prev });
      return { blocks, past, future: [] };
    }),

  hasBlock: (pos) => get().blocks.has(key(...pos)),

  /* --- seleção/modo --- */
  current: "stone",
  setCurrent: (t) => set({ current: t }),

  mode: "place",
  setMode: (m) => set({ mode: m }),

  /* --- visual --- */
  showWire: false, // OFF por padrão
  setShowWire: (v) => set({ showWire: v }),

  highlightColor: "white",
  setHighlightColor: (c) => set({ highlightColor: c }),

  // Fog
  fogEnabled: false,
  setFogEnabled: (v) => set({ fogEnabled: v }),
  fogDensity: 0.015,
  setFogDensity: (v) => set({ fogDensity: v }),

  /* --- hover/input --- */
  hoveredKey: null,
  setHoveredKey: (k) => set({ hoveredKey: k }),

  hoveredAdj: null,
  setHoveredAdj: (p) => set({ hoveredAdj: p }),

  mouse: { x: 0, y: 0 },
  setMouse: (x, y) => set({ mouse: { x, y } }),

  lastActionAt: 0,
  setLastActionAt: (t) => set({ lastActionAt: t }),

  /* --- UI --- */
  showFps: true,
  setShowFps: (v) => set({ showFps: v }),

  showHelp: false,
  setShowHelp: (v) => set({ showHelp: v }),

  /* --- luz/folhagem --- */
  lightAnimate: true,
  setLightAnimate: (v) => set({ lightAnimate: v }),

  lightSpeed: 0.15,
  setLightSpeed: (v) => set({ lightSpeed: v }),

  lightIntensity: 0.9,                         // <<<<<<<<<< AQUI
  setLightIntensity: (v) => set({ lightIntensity: v }), // <<<<<<<<<< AQUI

  foliageMode: "cross2",
  setFoliageMode: (m) => set({ foliageMode: m }),

  leavesDensity: 0.9,
  setLeavesDensity: (v) => set({ leavesDensity: v }),

  leavesScale: 1.12,
  setLeavesScale: (v) => set({ leavesScale: v }),

  // Vento
  windEnabled: true,
  setWindEnabled: (v) => set({ windEnabled: v }),
  windStrength: 0.35,
  setWindStrength: (v) => set({ windStrength: v }),
  windSpeed: 0.6,
  setWindSpeed: (v) => set({ windSpeed: v }),

  // Câmera
  cameraMode: "orbit",
  setCameraMode: (m) => set({ cameraMode: m }),

  // Modificadores
  isCtrlDown: false,
  setCtrlDown: (v) => set({ isCtrlDown: v }),

  /* --- histórico --- */
  past: [],
  future: [],
  currentStroke: null,

  beginStroke: () => set({ currentStroke: [] }),

  endStroke: () =>
    set((state) => {
      const ops = state.currentStroke;
      if (!ops || ops.length === 0) return { currentStroke: null };
      return {
        past: pushPastLimited(state.past, { kind: "stroke", ops }),
        future: [],
        currentStroke: null,
      };
    }),

  undo: () =>
    set((state) => {
      const item = state.past[state.past.length - 1];
      if (!item) return {};

      let blocks = state.blocks;
      const undoOp = (op: HistoryOp) => {
        if (op.kind === "place") blocks = removeRaw({ blocks }, op.key);
        else blocks = setRaw({ blocks }, op.key, op.prev.type);
      };

      if (item.kind === "stroke") {
        for (let i = item.ops.length - 1; i >= 0; i--) undoOp(item.ops[i]);
      } else {
        undoOp(item);
      }

      return {
        blocks,
        past: state.past.slice(0, -1),
        future: state.future.concat(item),
      };
    }),

  redo: () =>
    set((state) => {
      const item = state.future[state.future.length - 1];
      if (!item) return {};

      let blocks = state.blocks;
      const redoOp = (op: HistoryOp) => {
        if (op.kind === "place") blocks = setRaw({ blocks }, op.key, op.type);
        else blocks = removeRaw({ blocks }, op.key);
      };

      if (item.kind === "stroke") {
        for (const op of item.ops) redoOp(op);
      } else {
        redoOp(item);
      }

      return {
        blocks,
        future: state.future.slice(0, -1),
        past: pushPastLimited(state.past, item),
      };
    }),

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,

  /* --- setters silenciosos --- */
  setBlockSilent: (pos, type) =>
    set((state) => {
      const k = key(...pos);
      if (state.blocks.has(k)) return {};
      return { blocks: setRaw(state, k, type) };
    }),

  removeBlockSilent: (pos) =>
    set((state) => {
      const k = key(...pos);
      if (!state.blocks.has(k)) return {};
      return { blocks: removeRaw(state, k) };
    }),

  // --- animação de blocos ---
  blockAnimEnabled: true,
  setBlockAnimEnabled: (v) => set({ blockAnimEnabled: v }),
  blockAnimDuration: 220,
  setBlockAnimDuration: (v) => set({ blockAnimDuration: Math.max(60, v) }),
  blockAnimBounce: 0.25,
  setBlockAnimBounce: (v) => set({ blockAnimBounce: Math.max(0, Math.min(1, v)) }),

  // --- efeitos transitórios (remoção) ---
  effects: [],
  addRemoveEffect: (pos, type, duration) =>
    set((state) => ({
      effects: state.effects.concat({
        id: Math.floor(Math.random() * 1e9),
        pos,
        type,
        t0: performance.now(),
        duration: duration ?? state.blockAnimDuration,
      }),
    })),
  gcEffects: () =>
    set((state) => {
      const now = performance.now();
      return {
        effects: state.effects.filter((e) => now - e.t0 < e.duration + 20),
      };
    }),


}));
