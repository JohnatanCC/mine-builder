// NEW FILE: src/state/loading.store.ts
import { create } from 'zustand';

type LoadingState = {
  pending: number;        // quantas cargas em andamento
  lastChange: number;     // p/ forçar re-render debounce se precisar
  inc: () => void;
  dec: () => void;
  reset: () => void;
};

export const useLoading = create<LoadingState>((set) => ({
  pending: 0,
  lastChange: Date.now(),
  inc: () => set(s => ({ pending: s.pending + 1, lastChange: Date.now() })),
  dec: () => set(s => ({ pending: Math.max(0, s.pending - 1), lastChange: Date.now() })),
  reset: () => set({ pending: 0, lastChange: Date.now() }),
}));

// Helpers para uso fora de componentes (ex.: sistemas)
export const loadingCounter = {
  inc: () => useLoading.getState().inc(),
  dec: () => useLoading.getState().dec(),
  reset: () => useLoading.getState().reset(),
};
