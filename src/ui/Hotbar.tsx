import * as THREE from "three";
import { useRef } from "react";
import { useWorld } from "../state/world.store";
import { getBlockTextures, type BlockTextures } from "../textures";
import type { BlockType } from "../core/types";
import { BLOCK_LABEL } from "../core/labels";

const ALL_BLOCKS: BlockType[] = [
  // Pedras & afins
  "stone","stone_brick","cobblestone","glass",
  // Madeiras (pranchas)
  "oak_planks","spruce_planks","birch_planks",
  // Troncos
  "oak_log","spruce_log","birch_log",
  // Folhas
  "oak_leaves","spruce_leaves","birch_leaves",
  // Solo
  "grass","dirt",
  // opcional legacy:
  // "oak",
];

const ICON_MAP: Record<BlockType, keyof BlockTextures> = {
  oak: "oak",
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

function texToDataURL(t: THREE.Texture): string {
  const img: any = (t as any).image;
  if (img instanceof HTMLCanvasElement) return img.toDataURL();
  return img?.src ?? "";
}

export function Hotbar() {
  const current = useWorld((s) => s.current);
  const setCurrent = useWorld((s) => s.setCurrent);
  const tex = getBlockTextures();

  const stripRef = useRef<HTMLDivElement>(null);
  // scroll lateral com roda do mouse
  const onWheel = (e: React.WheelEvent) => {
    if (!stripRef.current) return;
    stripRef.current.scrollLeft += e.deltaY * 0.5;
  };

  return (
    <div
      onWheel={onWheel}
      style={{
        position: "absolute",
        left: "50%",
        bottom: 14,
        transform: "translateX(-50%)",
        zIndex: 10,
        pointerEvents: "auto",
        background: "rgba(20,20,20,0.65)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 12,
        padding: 8,
        maxWidth: "calc(100vw - 160px)",
        overflow: "hidden",
      }}
    >
      <div
        ref={stripRef}
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "thin",
          paddingBottom: 2,
        }}
      >
        {ALL_BLOCKS.map((type, idx) => {
          const key = ICON_MAP[type];
          const src = texToDataURL(tex[key]);
          const selected = current === type;
          const keycap = idx < 10 ? ((idx + 1) % 10).toString() : "";

          return (
            <button
              key={type}
              onClick={() => setCurrent(type)}
              title={`${BLOCK_LABEL[type]}${keycap ? ` — ${keycap}` : ""}`}
              style={{
                padding: 0,
                borderRadius: 8,
                border: selected ? "2px solid #ffd166" : "1px solid #444",
                background: "transparent",
                cursor: "pointer",
                outline: "none",
                position: "relative",
              }}
            >
              <img
                src={src}
                alt={BLOCK_LABEL[type]}
                style={{
                  width: 40,
                  height: 40,
                  imageRendering: "pixelated",
                  display: "block",
                  borderRadius: 6,
                  filter: selected ? "drop-shadow(0 0 6px rgba(255,209,102,0.6))" : "none",
                }}
              />
              {keycap && (
                <span
                  style={{
                    position: "absolute",
                    right: 4,
                    bottom: 2,
                    fontSize: 10,
                    color: "#eee",
                    opacity: 0.8,
                    fontFamily: "monospace",
                  }}
                >
                  {keycap}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
