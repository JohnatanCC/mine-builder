// NEW FILE: src/ui/panels/BlockCatalog.tsx
import * as React from "react";
import { useMemo, useState } from "react";
import { REGISTRY, getLabel } from "@/core/blocks/registry";
import type { BlockType } from "@/core/types";
import { useWorld } from "@/state/world.store";
import { BlockIcon } from "@/ui/BlockIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpAZ } from "lucide-react";

function useAllBlocks(): BlockType[] {
  return useMemo(() => Object.keys(REGISTRY) as BlockType[], []);
}

function BlocksGrid({
  items,
  onPick,
}: {
  items: BlockType[];
  onPick: (t: BlockType) => void;
}) {
  const SLOT = 65;
  const GAP = 8;   

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(5, ${SLOT}px)`,
        gap: GAP,
        padding: "4px 0"
      }}
    >
      {items.map((t) => (
        <button
          key={t}
          onClick={() => onPick(t)}
          style={{ width: SLOT, height: SLOT }}
          title={getLabel(t)}
          className="relative flex items-center justify-center rounded-lg border bg-muted hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          <BlockIcon type={t} size={SLOT - 4} />
        </button>
      ))}
    </div>
  );
}
export const BlockCatalog: React.FC = () => {
  const setCurrent = useWorld((s) => s.setCurrent);
  const all = useAllBlocks();
  const [tab, setTab] = useState<"blocks" | "decor">("blocks");
  const [q, setQ] = useState("");
  const [alpha, setAlpha] = useState(false);
  const source = tab === "blocks" ? all : [];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let arr = source;
    if (needle) {
      arr = arr.filter(
        (t) => getLabel(t).toLowerCase().includes(needle) || t.includes(needle)
      );
    }
    if (alpha) arr = [...arr].sort((a, b) => getLabel(a).localeCompare(getLabel(b)));
    return arr;
  }, [source, q, alpha]);
  return (
    <Card
      className={[
        "ml-2 border-0 w-[360px]",
        "flex h-full flex-col",
      ].join(" ")}
    >
      <div className="mb-2 flex items-center gap-2">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="h-8">
            <TabsTrigger className="h-8 px-3 text-xs" value="blocks">
              Blocos
            </TabsTrigger>
            <TabsTrigger className="h-8 px-3 text-xs" value="decor">
              Decoração
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Input
          placeholder="Pesquisar…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-8 flex-1 text-sm"
        />

        <Button
          variant={alpha ? "default" : "secondary"}
          size="sm"
          onClick={() => setAlpha((v) => !v)}
          title="Ordenar A–Z"
          className="gap-1.5"
        >
          <ArrowUpAZ className="h-4 w-4" />
          <span className="text-xs">A–Z</span>
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <Tabs value={tab}>
          <TabsContent value="blocks" className="mt-0 d-flex">
            <BlocksGrid items={filtered} onPick={setCurrent} />
          </TabsContent>
          <TabsContent value="decor" className="mt-0">
            <div className="text-sm text-muted-foreground">
              Em breve: itens de decoração.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};
