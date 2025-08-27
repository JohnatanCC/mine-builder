// UPDATE: src/systems/textures/pngLoader.ts
import {
  TextureLoader,
  NearestFilter,
  NearestMipmapNearestFilter,
  RepeatWrapping,
  SRGBColorSpace,
  DataTexture,
  RGBAFormat,
  UnsignedByteType,
  type Texture,
} from "three";
import { loadingCounter } from "@/state/loading.store";
export const LEGACY_ROOT = "/src/assets/textures/blocks";
export const PACKS_ROOT  = "/src/assets/textures/packs";

export const LEGACY_PNG_URLS = import.meta.glob(
  "/src/assets/textures/blocks/**/*.{png,jpg,jpeg,webp}",
  { as: "url", eager: true }
) as Record<string, string>;

export const PACKS_PNG_URLS = import.meta.glob(
  "/src/assets/textures/packs/**/*.{png,jpg,jpeg,webp}",
  { as: "url", eager: true }
) as Record<string, string>;

const loader = new TextureLoader();

// 🔒 cache de textura por URL (dedupe e evita redecodificar várias vezes)
const TEX_CACHE = new Map<string, Promise<Texture>>();

export async function loadVoxelTexture(url: string): Promise<Texture> {
  const cached = TEX_CACHE.get(url);
  if (cached) return cached;

  loadingCounter.inc();
  const p = new Promise<Texture>((resolve, reject) => {
    loader.load(
      url,
      (t) => {
        t.colorSpace = SRGBColorSpace;
        t.magFilter = NearestFilter;
        t.minFilter = NearestMipmapNearestFilter;
        t.wrapS = RepeatWrapping;
        t.wrapT = RepeatWrapping;
        t.generateMipmaps = true;
        resolve(t);
      },
      undefined,
      (err) => reject(err)
    );
  }).finally(() => {
    loadingCounter.dec();
  });

  TEX_CACHE.set(url, p);
  return p;
}

// ===== helpers de resolução (idem antes) =====
export function folderVariants(type: string): string[] {
  const kebab = type.replace(/_/g, "-");
  const snake = type.replace(/-/g, "_");
  return Array.from(new Set([type, kebab, snake]));
}

const EXT = ["png", "jpg", "jpeg", "webp"] as const;
const FACE_ALIASES: Record<string, string[]> = {
  icon: ["icon"],
  all: ["all"],
  top: ["top", "up"],
  bottom: ["bottom", "down"],
  "top-bottom": ["top-bottom", "topbottom", "top_bottom"],
  front: ["front", "north", "z+", "forward", "side1"],
  north: ["north", "front", "z+", "forward", "side1"],
  south: ["south", "back", "z-", "backward", "side2"],
  east: ["east", "x+", "right", "side3"],
  west: ["west", "x-", "left", "side4"],
  side: ["side"],
  side1: ["side1", "north", "front"],
  side2: ["side2", "south", "back"],
  side3: ["side3", "east", "right"],
  side4: ["side4", "west", "left"],
};

function findInMap(
  map: Record<string, string>,
  base: string,
  folder: string,
  filenameNoExt: string
): string | undefined {
  for (const ext of EXT) {
    const path = `${base}/${folder}/${filenameNoExt}.${ext}`;
    const url = map[path];
    if (url) return url;
  }
  return undefined;
}

export function findBlockFileURL(
  blockType: string,
  faceKey: keyof typeof FACE_ALIASES,
  pack?: string
): string | undefined {
  const folders = folderVariants(blockType);

  if (pack) {
    for (const f of folders)
      for (const name of FACE_ALIASES[faceKey]) {
        const u = findInMap(PACKS_PNG_URLS, `${PACKS_ROOT}/${pack}/blocks`, f, name);
        if (u) return u;
      }
  }

  for (const f of folders)
    for (const name of FACE_ALIASES[faceKey]) {
      const u = findInMap(LEGACY_PNG_URLS, LEGACY_ROOT, f, name);
      if (u) return u;
    }

  return undefined;
}

export function debugListAvailable(blockType: string, pack?: string): string[] {
  const folders = folderVariants(blockType);
  const keys = [...Object.keys(LEGACY_PNG_URLS), ...Object.keys(PACKS_PNG_URLS)];
  const prefixes = pack
    ? [`${PACKS_ROOT}/${pack}/blocks/`, `${LEGACY_ROOT}/`]
    : [`${LEGACY_ROOT}/`];
  return keys.filter(
    (k) => prefixes.some((p) => k.startsWith(p)) && folders.some((f) => k.includes(`/${f}/`))
  );
}

export function placeholderTexture(hex = 0x9c9c9c): Texture {
  const data = new Uint8Array([(hex >> 16) & 255, (hex >> 8) & 255, hex & 255, 255]);
  const tex = new DataTexture(data, 1, 1, RGBAFormat, UnsignedByteType);
  tex.colorSpace = SRGBColorSpace;
  tex.magFilter = NearestFilter;
  tex.minFilter = NearestFilter;
  tex.needsUpdate = true;
  return tex;
}
