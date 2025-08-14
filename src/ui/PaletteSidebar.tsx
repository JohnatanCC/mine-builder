import { BLOCK_LABEL } from "../core/labels";
import type { BlockType } from "../core/types";
import { useWorld } from "../state/world.store";
import { getBlockTextures, type BlockTextures } from "../textures";
import * as THREE from "three";


// Blocos exibidos
const PALETTE: BlockType[] = [
  "stone",
  "dirt",
  "grass",
  "oak_planks",
  "spruce_planks",
  "birch_planks",
  "oak_log",
  "spruce_log",
  "birch_log",
  "oak_leaves",
  "spruce_leaves",
  "birch_leaves",
  "glass",
  "stone_brick",
  "cobblestone",
  // "oak", // se quiser mostrar o legacy, descomente
];

// Mapeia BlockType -> chave da textura para thumbnail
const ICON_MAP: Record<BlockType, keyof BlockTextures> = {
  oak: "oak", // legacy

  stone: "stone",
  dirt: "dirt",
  grass: "grassTop",

  oak_planks: "oak",
  spruce_planks: "sprucePlanks",
  birch_planks: "birchPlanks",

  oak_log: "oakBark",
  spruce_log: "spruceBark",
  birch_log: "birchBark",

  oak_leaves: "oakLeaves",
  spruce_leaves: "spruceLeaves",
  birch_leaves: "birchLeaves",

  glass: "glass",
  stone_brick: "stoneBricks",
  cobblestone: "cobblestone",
};

// Converte CanvasTexture para dataURL
function texToDataURL(t: THREE.Texture): string {
  const img: any = (t as any).image;
  if (img instanceof HTMLCanvasElement) return img.toDataURL();
  return img?.src ?? "";
}

export function PaletteSidebar() {
  const current = useWorld((s) => s.current);
  const setCurrent = useWorld((s) => s.setCurrent);
  const tex = getBlockTextures();

  return (
    <div
      style={{
        position: "absolute",
        left: 10,
        top: "50%",
        transform: "translateY(-50%)",
        background: "rgba(0,0,0,0.6)",
        padding: 8,
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        maxHeight: "90%",
        overflowY: "auto",
        zIndex: 10,                 
        pointerEvents: "auto",    
      }}
    >
      {PALETTE.map((type) => {
        const key = ICON_MAP[type];
        const thumb = texToDataURL(tex[key]);
        const selected = current === type;

        return (
          <button
            key={type}
            onClick={() => setCurrent(type)}
            title={BLOCK_LABEL[type]}            
            style={{
              padding: 0,
              border: selected ? "2px solid #ffd166" : "1px solid #555",
              background: "transparent",
              cursor: "pointer",
              borderRadius: 6,
              outline: "none",
            }}
          >
            <img
              src={thumb}
              alt={BLOCK_LABEL[type]}
              style={{
                width: 36,
                height: 36,
                display: "block",
                imageRendering: "pixelated",
                borderRadius: 4,
                filter: selected ? "drop-shadow(0 0 4px rgba(255,209,102,0.6))" : "none",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}