// UPDATE: src/systems/textures/blockIcon.ts
import { findBlockFileURL } from "./pngLoader";
import type { BlockType } from "@/core/types";

const ICON_CACHE = new Map<string, string | undefined>();

/** Prioridade de arquivo para ícone: side → all → top → icon */
export function resolveBlockIconURL(type: BlockType, pack?: string): string | undefined {
  const key = `${pack ?? "legacy"}|${type}`;
  if (ICON_CACHE.has(key)) return ICON_CACHE.get(key)!;

  const url =
    findBlockFileURL(type, "side", pack) ??
    findBlockFileURL(type, "all",  pack) ??
    findBlockFileURL(type, "top",  pack) ??
    findBlockFileURL(type, "icon", pack);

  ICON_CACHE.set(key, url);
  return url;
}
