// NEW FILE: src/ui/catalog/BlockCatalogPanel.tsx
import * as React from "react";
import { overlayOffsets } from "@/core/constants";
import { REGISTRY, getLabel } from "@/core/blocks/registry";
import type { BlockType } from "@/core/types";
import { useWorld } from "@/state/world.store";
import { BlockIcon } from "@/ui/BlockIcon";

/* shadcn/ui */
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/* lucide */
import { ArrowUpAZ } from "lucide-react";

const SLOT = 56;           // px do ícone na grade
const GAP = 8;             // gap entre ícones
const COLUMNS = 5;         // sempre 5 colunas (pedido do usuário)
const PANEL_W = overlayOffsets.leftX() + COLUMNS * SLOT + (COLUMNS - 1) * GAP;

export const BlockCatalogPanel: React.FC = () => {
    const [q, setQ] = React.useState("");
    const [alpha, setAlpha] = React.useState(false);
    const [tab, setTab] = React.useState<"blocks" | "decor">("blocks");

    const setCurrent = useWorld((s) => s.setCurrent);
    const current = useWorld((s) => s.current);

    const all = React.useMemo(() => Object.keys(REGISTRY) as BlockType[], []);
    const filtered = React.useMemo(() => {
        const needle = q.trim().toLowerCase();
        let arr = all.filter((t) => {
            if (tab === "decor") return false; // futuro: filtrar por categoria de decoração
            return true;
        });
        if (needle) {
            arr = arr.filter(
                (t) => getLabel(t).toLowerCase().includes(needle) || t.includes(needle)
            );
        }
        if (alpha) arr = [...arr].sort((a, b) => getLabel(a).localeCompare(getLabel(b)));
        return arr;
    }, [all, q, alpha, tab]);

    return (
        <Card
            className="fixed z-20 border "
            style={{
                left: overlayOffsets.leftX(),
                top: overlayOffsets.topY(),
                bottom: overlayOffsets.bottomY(),
                width: COLUMNS * SLOT + (COLUMNS - 1) * GAP + 16, // + bordas/padding
                pointerEvents: "auto",
            }}
        >
            <CardContent className="p-3 h-full flex flex-col">
                {/* Cabeçalho */}
                <div className="mb-2 flex items-center gap-2">
                    <Input
                        placeholder="Pesquisar blocos…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="h-9 text-sm"
                    />
                    <Button
                        size="sm"
                        variant={alpha ? "default" : "secondary"}
                        onClick={() => setAlpha((v) => !v)}
                        className="gap-1.5"
                        title="Ordenar A–Z"
                    >
                        <ArrowUpAZ className="h-4 w-4" />
                        A–Z
                    </Button>
                </div>

                {/* Tabs (futuro: decoração, etc.) */}
                <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-2">
                    <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="blocks">Blocos</TabsTrigger>
                        <TabsTrigger value="decor">Decoração</TabsTrigger>
                    </TabsList>
                    <TabsContent value="blocks" />
                    <TabsContent value="decor" />
                </Tabs>

                {/* Grade fixa 5 colunas, scroll vertical */}
                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns: `repeat(${COLUMNS}, ${SLOT}px)`,
                            gap: GAP,
                        }}
                    >
                        {filtered.map((type) => {
                            const selected = current === type;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setCurrent(type)}
                                    title={getLabel(type)}
                                    className={[
                                        "relative rounded-xl border transition-colors",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/60",
                                        selected
                                            ? "border-lime-400 bg-gradient-to-b from-lime-400/15 to-transparent"
                                            : "border-border/60 bg-gradient-to-b from-muted/40 to-background hover:border-border",
                                    ].join(" ")}
                                    style={{ width: SLOT, height: SLOT }}
                                >
                                    <BlockIcon type={type} size={SLOT - 8} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
