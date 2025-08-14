import * as THREE from "three";
import * as React from "react";
import { useRef } from "react";
import { useWorld } from "../state/world.store";
import { getBlockTextures, type BlockTextures } from "../textures";
import type { BlockType } from "../core/types";
import { BLOCK_LABEL } from "../core/labels";

const ALL_BLOCKS: BlockType[] = [
  "stone","stone_brick","cobblestone","glass",
  "oak_planks","spruce_planks","birch_planks",
  "oak_log","spruce_log","birch_log",
  "oak_leaves","spruce_leaves","birch_leaves",
  "grass","dirt",
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

const shell: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: 12,
  transform: "translateX(-50%)",
  zIndex: 10,
  pointerEvents: "auto",
  maxWidth: "calc(100vw - 160px)",
  background: `
    linear-gradient(180deg, rgba(26,26,26,0.95) 0%, rgba(18,18,18,0.95) 100%),
    repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 6px, rgba(0,0,0,0.03) 6px 12px)
  `,
  border: "2px solid #2b2b2b",
  borderRadius: 12,
  padding: 8,
  imageRendering: "pixelated" as any,
};

const slotBtn = (selected: boolean): React.CSSProperties => ({
  padding: 0,
  borderRadius: 10,
  border: selected ? "2px solid #ffd166" : "2px solid #2b2b2b",
  background: selected
    ? "linear-gradient(180deg, rgba(255,209,102,0.15) 0%, rgba(0,0,0,0.05) 100%)"
    : "linear-gradient(180deg, #1f1f1f 0%, #151515 100%)",
  cursor: "pointer",
  outline: "none",
  position: "relative",
  boxShadow: selected ? "0 0 12px rgba(255,209,102,0.35)" : "none",
});

export function Hotbar() {
  const current = useWorld((s) => s.current);
  const setCurrent = useWorld((s) => s.setCurrent);
  const tex = getBlockTextures();

  const stripRef = useRef<HTMLDivElement>(null);
  const onWheel = (e: React.WheelEvent) => {
    if (!stripRef.current) return;
    stripRef.current.scrollLeft += e.deltaY * 0.5;
  };

  return (
    <div style={shell} onWheel={onWheel}>
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
              style={slotBtn(selected)}
            >
              <img
                src={src}
                alt={BLOCK_LABEL[type]}
                style={{
                  width: 42,
                  height: 42,
                  imageRendering: "pixelated",
                  display: "block",
                  borderRadius: 8,
                }}
              />
              {keycap && (
                <span
                  style={{
                    position: "absolute",
                    right: 4,
                    top: 2,
                    fontSize: 14,
                    color: "#eee",
                    background: "black",
                    padding: "4px",
                    width: "10px",
                    height: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "4px",
                    opacity: 0.85,
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
