// UPDATE: src/ui/BlockIcon.tsx
// (apenas pequena limpeza: tooltip agora vem do shadcn; mantemos suporte a title se alguém usar fora do catálogo)
import * as React from "react";
import type { BlockType } from "@/core/types";
import { resolveBlockIconURL } from "@/systems/textures/blockIcon";
import { TINT_LEAVES, TINT_GRASS } from "@/core/constants";
import { tintImageURLToDataURL } from "@/ui/tint";

type Props = {
  type: BlockType;
  size?: number;        // default 42
  className?: string;
  title?: string;       // opcional – shadcn Tooltip cobre no catálogo
};

const transparent1x1 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

const needsTint = (t: BlockType) => t === "grass" || t.endsWith("_leaves");
const tintFor = (t: BlockType) => (t === "grass" ? TINT_GRASS : TINT_LEAVES);

/** Ícone 2D leve, com tint p/ folhas/grama se necessário. */
export function BlockIcon({ type, size = 42, className, title }: Props) {
  const baseURL = resolveBlockIconURL(type) ?? transparent1x1;
  const [src, setSrc] = React.useState(baseURL);

  React.useEffect(() => {
    let alive = true;
    if (!needsTint(type)) {
      setSrc(baseURL);
      return () => {};
    }
    tintImageURLToDataURL(baseURL, tintFor(type))
      .then((u) => {
        if (alive) setSrc(u);
      })
      .catch(() => {
        if (alive) setSrc(baseURL);
      });
    return () => {
      alive = false;
    };
  }, [type, baseURL]);

  const style: React.CSSProperties = {
    width: size,
    height: size,
    display: "block",
    imageRendering: "pixelated" as any,
    borderRadius: 8,
    overflow: "hidden",
    background: "linear-gradient(180deg,#202020,#151515)",
    cursor: "pointer",
  };

  return <img src={src} alt={title ?? type} title={title} style={style} className={className} />;
}
