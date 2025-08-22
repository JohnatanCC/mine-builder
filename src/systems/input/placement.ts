// UPDATE: src/systems/input/placement.ts
// Troca para o Mode central (core) e padroniza "delete"
import type { Mode } from "@/core/types";

/** Decide a ação considerando botão, modo e Ctrl. */
export function decideAction(opts: {
  button: 0 | 1 | 2; // 0=esq, 2=dir
  mode: Mode;
  ctrlDown: boolean;
}): "place" | "delete" | "brush" {
  const { button, mode, ctrlDown } = opts;
  if (ctrlDown) return "brush";

  if (mode === "place") {
    return button === 2 ? "delete" : "place";
  }
  if (mode === "delete") {
    return button === 2 ? "place" : "delete";
  }
  return "brush";
}
