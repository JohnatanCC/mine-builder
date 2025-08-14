import type { BlockData, BlockType } from "../../core/types";

type HistoryOp =
  | { kind: "place"; key: string; type: BlockType }
  | { kind: "remove"; key: string; prev: BlockData };

export type HistoryItem = HistoryOp | { kind: "stroke"; ops: HistoryOp[] };

export type HistorySlice = {
  past: HistoryItem[];
  future: HistoryItem[];
  currentStroke: HistoryOp[] | null;

  beginStroke: () => void;
  endStroke: () => void;
  undo: () => void;
  redo: () => void;
};

export const createHistorySlice = (set: any, get: any): HistorySlice => ({
  past: [],
  future: [],
  currentStroke: null,

  beginStroke: () => {
    if (!get().currentStroke) set({ currentStroke: [] });
  },

  endStroke: () => {
    const st = get();
    const stroke = st.currentStroke;
    if (!stroke || stroke.length === 0) {
      set({ currentStroke: null });
      return;
    }
    set({
      past: st.past.concat({ kind: "stroke", ops: stroke }),
      future: [],
      currentStroke: null,
    });
  },

  undo: () => {
    const st = get();
    if (st.past.length === 0) return;

    const last = st.past[st.past.length - 1] as HistoryItem;
    const rest = st.past.slice(0, -1);

    if ((last as any).kind === "stroke") {
      // desfaz em ordem reversa
      const ops = (last as any).ops.slice().reverse() as HistoryOp[];
      set((state: any) => {
        let blocks = new Map(state.blocks);
        for (const op of ops) {
          if (op.kind === "place") {
            blocks.delete(op.key);
          } else {
            blocks.set(op.key, op.prev);
          }
        }
        return { blocks, past: rest, future: st.future.concat(last) };
      });
    } else {
      const op = last as HistoryOp;
      set((state: any) => {
        let blocks = new Map(state.blocks);
        if (op.kind === "place") blocks.delete(op.key);
        else blocks.set(op.key, op.prev);
        return { blocks, past: rest, future: st.future.concat(last) };
      });
    }
  },

  redo: () => {
    const st = get();
    if (st.future.length === 0) return;

    const next = st.future[st.future.length - 1] as HistoryItem;
    const rest = st.future.slice(0, -1);

    if ((next as any).kind === "stroke") {
      const ops = (next as any).ops as HistoryOp[];
      set((state: any) => {
        let blocks = new Map(state.blocks);
        for (const op of ops) {
          if (op.kind === "place") blocks.set(op.key, { type: op.type });
          else blocks.delete(op.key);
        }
        return { blocks, past: st.past.concat(next), future: rest };
      });
    } else {
      const op = next as HistoryOp;
      set((state: any) => {
        let blocks = new Map(state.blocks);
        if (op.kind === "place") blocks.set(op.key, { type: op.type });
        else blocks.delete(op.key);
        return { blocks, past: st.past.concat(next), future: rest };
      });
    }
  },
});
