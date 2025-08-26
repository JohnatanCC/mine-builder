// UPDATE: src/ui/panels/BlockCatalog.tsx
import * as React from "react";
import { useMemo, useState, useEffect } from "react";
import { REGISTRY, getLabel } from "@/core/blocks/registry";
import type { BlockType } from "@/core/types";
import { useWorld } from "@/state/world.store";
import { BlockIcon } from "@/ui/BlockIcon";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowUpAZ, Grid3X3, Grid2X2, Maximize2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "./BlockCatalog.css";

function useAllBlocks(): BlockType[] {
  return useMemo(() => Object.keys(REGISTRY) as BlockType[], []);
}

// Função para agrupar blocos por categoria
function groupBlocksByCategory(blocks: BlockType[]) {
  const groups: Record<string, BlockType[]> = {
    stone: [],
    wood: [],
    concrete: [],
    misc: [],
  };

  blocks.forEach(blockType => {
    const blockDef = REGISTRY[blockType];
    if (!blockDef) return;
    
    const category = blockDef.category;
    if (category === 'stone' || category === 'brick') {
      groups.stone.push(blockType);
    } else if (category === 'wood' || category === 'log' || category === 'leaves') {
      groups.wood.push(blockType);
    } else if (category === 'concrete') {
      groups.concrete.push(blockType);
    } else {
      groups.misc.push(blockType);
    }
  });

  return groups;
}

function BlocksGrid({
  items,
  current,
  onPick,
  gridSize = "normal",
}: {
  items: BlockType[];
  current: BlockType;
  onPick: (t: BlockType) => void;
  gridSize?: "compact" | "normal" | "large";
}) {
  const SLOT_SIZES = {
    compact: 48,
    normal: 58,
    large: 68,
  };
  
  const COLUMNS = {
    compact: 6,
    normal: 5,
    large: 4,
  };

  const SLOT = SLOT_SIZES[gridSize];
  const COLS = COLUMNS[gridSize];
  const GAP = 6;

  return (
    <div
      className="grid transition-all duration-200"
      style={{
        gridTemplateColumns: `repeat(${COLS}, ${SLOT}px)`,
        gap: GAP,
        padding: "2px 0",
      }}
    >
      <TooltipProvider delayDuration={200}>
        {items.map((t) => {
          const selected = t === current;
          return (
            <Tooltip key={t}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onPick(t)}
                  aria-label={getLabel(t)}
                  aria-pressed={selected}
                  style={{ 
                    width: SLOT, 
                    height: SLOT,
                  }}
                  className={[
                    "relative flex items-center justify-center rounded-md border",
                    "bg-muted/30 hover:bg-accent hover:text-accent-foreground",
                    "focus:outline-none focus:ring-1 focus:ring-ring",
                    "transition-all duration-150 hover:scale-105",
                    selected
                      ? "ring-2 ring-primary border-primary/70 bg-primary/15 scale-105"
                      : "hover:border-primary/30",
                  ].join(" ")}
                >
                  <BlockIcon type={t} size={SLOT - 12} />
                  {selected && (
                    <span
                      className="pointer-events-none absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-md"
                    >
                      ✓
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {getLabel(t)}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}

export const BlockCatalog: React.FC = () => {
  const current = useWorld((s) => s.current);
  const setCurrent = useWorld((s) => s.setCurrent);

  const all = useAllBlocks();
  const [tab, setTab] = useState<"stone" | "wood" | "concrete" | "misc">("stone");
  const [q, setQ] = useState("");
  const [alpha, setAlpha] = useState(false);
  const [gridSize, setGridSize] = useState<"compact" | "normal" | "large">("normal");

  const blockGroups = useMemo(() => groupBlocksByCategory(all), [all]);
  const source = blockGroups[tab] || [];

  // Atalhos de teclado para navegar entre categorias
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Apenas processar se não estiver digitando em um input
      if (e.target instanceof HTMLInputElement) return;
      
      switch(e.key) {
        case '1':
          setTab('stone');
          break;
        case '2':
          setTab('wood');
          break;
        case '3':
          setTab('concrete');
          break;
        case '4':
          setTab('misc');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

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
    <Card className="ml-2 border-0 w-[320px] flex h-full flex-col bg-background/95">
      
      {/* Bloco atual compacto */}
      <div className="p-2 border-b border-muted-foreground/10 bg-muted/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-muted/30 flex items-center justify-center border border-primary/20">
            <BlockIcon type={current} size={24} />
          </div>
          <span className="text-sm font-medium truncate">{getLabel(current)}</span>
        </div>
      </div>

      {/* Categorias */}
      <div className="p-2">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="h-8 grid grid-cols-4 w-full">
            <TabsTrigger className="h-7 px-1 text-xs" value="stone" title="Pedras (Tecla 1)">
              🏗️
            </TabsTrigger>
            <TabsTrigger className="h-7 px-1 text-xs" value="wood" title="Madeiras (Tecla 2)">
              🌳
            </TabsTrigger>
            <TabsTrigger className="h-7 px-1 text-xs" value="concrete" title="Cores (Tecla 3)">
              🎨
            </TabsTrigger>
            <TabsTrigger className="h-7 px-1 text-xs" value="misc" title="Especiais (Tecla 4)">
              ✨
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Controles */}
      <div className="px-2 pb-2 flex items-center gap-2">
        <Input
          placeholder="Buscar..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-7 flex-1 text-sm"
        />

        <div className="flex items-center gap-1">
          <Button
            variant={gridSize === "compact" ? "default" : "outline"}
            size="sm"
            onClick={() => setGridSize("compact")}
            className="h-7 w-7 p-0"
            title="Compacto"
          >
            <Grid3X3 className="h-3 w-3" />
          </Button>

          <Button
            variant={gridSize === "normal" ? "default" : "outline"}
            size="sm"
            onClick={() => setGridSize("normal")}
            className="h-7 w-7 p-0"
            title="Normal"
          >
            <Grid2X2 className="h-3 w-3" />
          </Button>

          <Button
            variant={gridSize === "large" ? "default" : "outline"}
            size="sm"
            onClick={() => setGridSize("large")}
            className="h-7 w-7 p-0"
            title="Grande"
          >
            <Maximize2 className="h-3 w-3" />
          </Button>

          <Button
            variant={alpha ? "default" : "outline"}
            size="sm"
            onClick={() => setAlpha((v) => !v)}
            className="h-7 w-7 p-0"
            title="A-Z"
          >
            <ArrowUpAZ className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Grid de blocos */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2 custom-scrollbar">
        {filtered.length > 0 ? (
          <BlocksGrid 
            items={filtered} 
            current={current} 
            onPick={setCurrent} 
            gridSize={gridSize}
          />
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">
            <div className="flex flex-col items-center gap-2">
              {q ? (
                <>
                  <span className="text-lg">🔍</span>
                  <span>Nenhum bloco encontrado</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setQ("")}
                    className="text-xs"
                  >
                    Limpar
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-lg">📦</span>
                  <span>Nenhum bloco disponível</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
