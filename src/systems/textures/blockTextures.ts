// UPDATE: src/systems/textures/blockTextures.v1.ts
import {
  MeshStandardMaterial,
  MeshLambertMaterial,
  type MeshStandardMaterialParameters,
  type Material,
  type Texture,
} from "three";
import {
  findBlockFileURL,
  loadVoxelTexture,
  placeholderTexture,
} from "./pngLoader";
import type { BlockType } from "@/core/types";

// 🔒 cache de materiais por (pack|shading|type)
const MAT_CACHE = new Map<string, Promise<Material[]>>();

// Tipo para mapeamento de texturas
interface TextureMapping {
  top: string | undefined;
  bottom: string | undefined;
  north: string | undefined;
  south: string | undefined;
  east: string | undefined;
  west: string | undefined;
}

/**
 * Sistema dinâmico de resolução de texturas para blocos
 * Suporta top-bottom, side1-4, front e todas as variações existentes
 */
export function resolveBlockTextures(type: BlockType, pack?: string): TextureMapping {
  // URLs específicas por face
  const urlAll = findBlockFileURL(type, "all", pack);
  const urlIcon = findBlockFileURL(type, "icon", pack);
  const urlTop = findBlockFileURL(type, "top", pack);
  const urlBottom = findBlockFileURL(type, "bottom", pack);
  const urlTopBottom = findBlockFileURL(type, "top-bottom" as any, pack);
  const urlSide = findBlockFileURL(type, "side", pack);
  const urlFront = findBlockFileURL(type, "front" as any, pack);
  
  // URLs específicas para cada lado
  const urlNorth = findBlockFileURL(type, "north", pack) || findBlockFileURL(type, "side1" as any, pack) || urlFront;
  const urlSouth = findBlockFileURL(type, "south", pack) || findBlockFileURL(type, "side2" as any, pack);
  const urlEast = findBlockFileURL(type, "east", pack) || findBlockFileURL(type, "side3" as any, pack);
  const urlWest = findBlockFileURL(type, "west", pack) || findBlockFileURL(type, "side4" as any, pack);

  // Lógica de fallback inteligente
  const getTopTexture = () => {
    return urlTop ?? urlTopBottom ?? urlAll ?? urlSide ?? urlIcon;
  };

  const getBottomTexture = () => {
    return urlBottom ?? urlTopBottom ?? urlAll ?? urlSide ?? urlIcon;
  };

  const getSideTexture = (specificUrl?: string) => {
    return specificUrl ?? urlSide ?? urlAll ?? urlTop ?? urlIcon;
  };

  return {
    top: getTopTexture(),
    bottom: getBottomTexture(),
    north: getSideTexture(urlNorth),
    south: getSideTexture(urlSouth),
    east: getSideTexture(urlEast),
    west: getSideTexture(urlWest),
  };
}

function cacheKey(type: BlockType, shading: "standard" | "lambert", pack?: string) {
  return `${pack ?? "legacy"}|${shading}|${type}`;
}

/** público: pega materiais com cache */
export function getBlockMaterialsCached(
  type: BlockType,
  shading: "standard" | "lambert" = "standard",
  pack?: string
): Promise<Material[]> {
  const key = cacheKey(type, shading, pack);
  if (MAT_CACHE.has(key)) return MAT_CACHE.get(key)!;
  const p = buildBlockMaterialsV1(type, shading, pack);
  MAT_CACHE.set(key, p);
  return p;
}

/** constrói (sem cache) – usado internamente pelo wrapper acima */
export async function buildBlockMaterialsV1(
  type: BlockType,
  shading: "standard" | "lambert" = "standard",
  pack?: string
): Promise<Material[]> {
  const rough: Pick<MeshStandardMaterialParameters, "roughness" | "metalness"> = {
    roughness: 1,
    metalness: 0,
  };

  // Sistema dinâmico de mapeamento de texturas
  const textureMapping = await resolveBlockTextures(type, pack);

  async function tex(url?: string): Promise<Texture> {
    if (!url) return placeholderTexture();
    try {
      return await loadVoxelTexture(url); // já vem com cache por URL
    } catch {
      return placeholderTexture();
    }
  }

  // Carrega todas as texturas necessárias
  const [tPX, tNX, tPY, tNY, tPZ, tNZ] = await Promise.all([
    tex(textureMapping.east),
    tex(textureMapping.west),
    tex(textureMapping.top),
    tex(textureMapping.bottom),
    tex(textureMapping.south),
    tex(textureMapping.north),
  ]);

  const mk = (map: Texture): Material =>
    shading === "lambert"
      ? new MeshLambertMaterial({ map })
      : new MeshStandardMaterial({ ...rough, map });

  const mats: Material[] = [mk(tPX), mk(tNX), mk(tPY), mk(tNY), mk(tPZ), mk(tNZ)];

  // === TINT (grass top e folhas) ===
  const FACE_INDEX = { px: 0, nx: 1, py: 2, ny: 3, pz: 4, nz: 5 } as const;
  type FaceKey = keyof typeof FACE_INDEX;
  const TINT_RULES: Partial<Record<BlockType, { color: number; faces?: FaceKey[] }>> = {
    grass: { color: 0x60b04c, faces: ["py"] },
    oak_leaves: { color: 0x3e8f3e },
    spruce_leaves: { color: 0x3a7540 },
    birch_leaves: { color: 0x6ec26d },
  };
  const rule = TINT_RULES[type];
  if (rule) {
    const indices = (rule.faces ?? (Object.keys(FACE_INDEX) as FaceKey[])).map(
      (f) => FACE_INDEX[f]
    );
    for (const i of indices) {
      const m = mats[i] as any;
      if (m?.color) m.color.setHex(rule.color);
    }
  }

  return mats;
}
