// NEW FILE: src/state/quickbar.store.ts
import { create } from "zustand";
import type { BlockType } from "@/core/types";

type QuickbarState = {
  quickSlots: (BlockType | null)[];
  setQuickSlot: (idx: number, t: BlockType | null) => void;
  addToQuickbar: (t: BlockType) => number;      // retorna índice usado
  selectSlot: (idx: number) => void;            // seleciona bloco do slot (se houver)
  clearSlot: (idx: number) => void;
  hydrate: () => void;                          // carrega do localStorage
};

const KEY = "mb.quickbar.v1";
const SLOTS = 10;

export const useQuickbar = create<QuickbarState>((set, get) => ({
  quickSlots: Array(SLOTS).fill(null),
  setQuickSlot: (idx, t) => {
    set((s) => {
      const next = s.quickSlots.slice();
      next[idx] = t;
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return { quickSlots: next };
    });
  },
  addToQuickbar: (t) => {
    const s = get();
    const slots = s.quickSlots.slice();
    let idx = slots.findIndex((x) => x === null || x === t);
    if (idx < 0) idx = 0;
    slots[idx] = t;
    set({ quickSlots: slots });
    try { localStorage.setItem(KEY, JSON.stringify(slots)); } catch {}
    return idx;
  },
  selectSlot: (idx) => {
    const t = get().quickSlots[idx];
    if (!t) return;
    // delega para o store principal:
    // import dinamicamente para evitar acoplamento cíclico
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useWorld } = require("@/state/world.store");
    useWorld.getState().setCurrent(t);
  },
  clearSlot: (idx) => {
    set((s) => {
      const next = s.quickSlots.slice();
      next[idx] = null;
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return { quickSlots: next };
    });
  },
  hydrate: () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const arr = JSON.parse(raw) as (BlockType | null)[];
      if (!Array.isArray(arr)) return;
      set({ quickSlots: [...Array(SLOTS)].map((_, i) => arr[i] ?? null) });
    } catch {}
  },
}));
