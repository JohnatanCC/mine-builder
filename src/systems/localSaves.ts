// UPDATE: src/systems/localSaves.ts
import { useWorld } from "@/state/world.store";
import type { WorldSnapshot } from "@/state/world.store";

const PREFIX = "mb:slot:";
export const AUTO_KEY = "mb:auto";    // chave separada para autosave

export type LocalSave = {
  appVersion?: string;
  updatedAt: number;   // epoch ms
  snapshot: WorldSnapshot;
};

function safeParse<T>(txt: string | null): T | null {
  if (!txt) return null;
  try { return JSON.parse(txt) as T; } catch { return null; }
}

export function loadSlot(slot: number): LocalSave | null {
  return safeParse<LocalSave>(localStorage.getItem(PREFIX + slot));
}
export function saveSlot(slot: number, snapshot: WorldSnapshot, appVersion?: string) {
  const data: LocalSave = { snapshot, updatedAt: Date.now(), appVersion };
  localStorage.setItem(PREFIX + slot, JSON.stringify(data));
}
export function clearSlot(slot: number) {
  localStorage.removeItem(PREFIX + slot);
}
export function listSlots(): Array<{ slot: number; meta: LocalSave | null }> {
  return [1, 2, 3, 4, 5].map((n) => ({ slot: n, meta: loadSlot(n) }));
}

// ---- Autosave ----
export function loadAuto(): LocalSave | null {
  return safeParse<LocalSave>(localStorage.getItem(AUTO_KEY));
}
export function saveAuto(snapshot: WorldSnapshot, appVersion?: string) {
  const data: LocalSave = { snapshot, updatedAt: Date.now(), appVersion };
  localStorage.setItem(AUTO_KEY, JSON.stringify(data));
  return data; // devolve meta para UI
}

export function applySnapshot(snap: WorldSnapshot) {
  useWorld.getState().loadSnapshot(snap);
}

// Restaura no boot (use no App)
export function tryRestoreAutoOnBoot(): boolean {
  const auto = loadAuto();
  if (!auto) return false;
  applySnapshot(auto.snapshot);
  return true;
}
