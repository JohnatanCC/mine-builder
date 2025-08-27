// UPDATE: src/ui/panels/BlockCatalog.tsx - Melhorias organizacionais v0.5.0
import * as React from "react";
import { useMemo, useState, useEffect } from "react";
import { REGISTRY, getLabel } from "@/core/blocks/registry";
import type { BlockType } from "@/core/types";
import { useWorld } from "@/state/world.store";
import { BlockIcon } from "@/ui/BlockIcon";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpAZ, Search, X, Grid3X3, TreePine, Square, Palette, Settings, Leaf, Mountain } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function useAllBlocks(): BlockType[] {
  return useMemo(() => Object.keys(REGISTRY) as BlockType[], []);
}

// Categorização de blocos
const BLOCK_CATEGORIES = {
  all: {
    label: "Todos",
    color: "text-slate-100",
    icon: Grid3X3,
    activeColor: "data-[state=active]:text-slate-700 data-[state=active]:bg-slate-50"
  },
  stone: {
    label: "Pedras",
    color: "text-stone-300",
    icon: Mountain,
    activeColor: "data-[state=active]:text-stone-700 data-[state=active]:bg-stone-50"
  },
  wood: {
    label: "Madeiras",
    color: "text-amber-300",
    icon: TreePine,
    activeColor: "data-[state=active]:text-amber-700 data-[state=active]:bg-amber-50"
  },
  glass: {
    label: "Vidros", 
    color: "text-cyan-300",
    icon: Square,
    activeColor: "data-[state=active]:text-cyan-700 data-[state=active]:bg-cyan-50"
  },
  decoration: {
    label: "Decoração",
    color: "text-purple-300",
    icon: Palette,
    activeColor: "data-[state=active]:text-purple-700 data-[state=active]:bg-purple-50"
  },
  utility: {
    label: "Utilitários", 
    color: "text-orange-300",
    icon: Settings,
    activeColor: "data-[state=active]:text-orange-700 data-[state=active]:bg-orange-50"
  },
  nature: {
    label: "Natureza",
    color: "text-emerald-300",
    icon: Leaf,
    activeColor: "data-[state=active]:text-emerald-700 data-[state=active]:bg-emerald-50"
  }
} as const;

type BlockCategory = keyof typeof BLOCK_CATEGORIES;

function categorizeBlocks(blocks: BlockType[]): Record<BlockCategory, BlockType[]> {
  const categorized: Record<BlockCategory, BlockType[]> = {
    all: [],
    stone: [],
    wood: [],
    glass: [],
    decoration: [],
    utility: [],
    nature: []
  };

  blocks.forEach(blockType => {
    const blockDef = REGISTRY[blockType];
    if (!blockDef) return;
    
    const category = blockDef.category;
    
    // Adicionar a "Todos"
    categorized.all.push(blockType);
    
    // Categorização baseada no registry e propriedades
    if (category === 'stone' || category === 'brick' || category === 'concrete' || category === 'copper' || category === 'tuff') {
      categorized.stone.push(blockType);
    } else if (category === 'wood' || category === 'log') {
      categorized.wood.push(blockType);
    } else if (category === 'glass' || blockDef.isGlass) {
      categorized.glass.push(blockType);
    } else if (blockType.includes('wool') || blockType === 'bookshelf') {
      categorized.decoration.push(blockType);
    } else if (category === 'leaves' || blockType.includes('grass') || blockType.includes('dirt') || 
               blockType === 'moss_block' || blockType === 'mud' || blockType === 'snow' || 
               blockType === 'shroomlight') {
      categorized.nature.push(blockType);
    } else {
      // Utilitários: crafting_table, redstone_lamp_on, iron_bars, trapdoors, etc.
      categorized.utility.push(blockType);
    }
  });

  return categorized;
}

function BlocksGrid({
  items,
  current,
  onPick,
}: {
  items: BlockType[];
  current: BlockType;
  onPick: (t: BlockType) => void;
}) {
  const SLOT = 56;
  const GAP = 6;

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(5, ${SLOT}px)`,
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
                  style={{ width: SLOT, height: SLOT }}
                  className={[
                    "relative flex items-center justify-center border transition-all duration-200",
                    "bg-muted/30 hover:bg-accent hover:text-accent-foreground hover:scale-105",
                    "focus:outline-none focus:ring-1 focus:ring-ring",
                    "active:scale-95",
                    selected
                      ? "ring-1 ring-primary border-primary bg-primary/10"
                      : "border-border hover:border-primary/30",
                  ].join(" ")}
                >
                  <BlockIcon type={t} size={SLOT - 6} />
                  {selected && (
                    <span
                      className="pointer-events-none absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-md animate-in zoom-in-50 duration-200"
                      title="Selecionado"
                    >
                      ✓
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs font-medium">
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
  const [category, setCategory] = useState<BlockCategory>("all");
  const [q, setQ] = useState("");
  const [alpha, setAlpha] = useState(false);

  // Categorizar todos os blocos
  const categorizedBlocks = useMemo(() => categorizeBlocks(all), [all]);

  // Fonte baseada na categoria atual
  const source = categorizedBlocks[category];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let arr = source;
    if (needle) {
      arr = arr.filter((t) => {
        const label = getLabel(t).toLowerCase();
        const blockType = t.toLowerCase();
        const blockCategory = REGISTRY[t]?.category?.toLowerCase() || "";
        return (
          label.includes(needle) ||
          blockType.includes(needle) ||
          blockCategory.includes(needle)
        );
      });
    }
    if (alpha) arr = [...arr].sort((a, b) => getLabel(a).localeCompare(getLabel(b)));
    return arr;
  }, [source, q, alpha]);

  // Keyboard shortcuts para busca e categorias
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      // Ctrl+F para busca
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('.block-search-input')?.focus();
        return;
      }

      // Números 1-7 para categorias
      const categoryKeys: Record<string, BlockCategory> = {
        '1': 'all',
        '2': 'stone',
        '3': 'wood', 
        '4': 'glass',
        '5': 'decoration',
        '6': 'utility',
        '7': 'nature'
      };
      
      if (categoryKeys[e.key]) {
        setCategory(categoryKeys[e.key]);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="h-full max-h-screen flex flex-col bg-transparent">
      {/* Header com categorias */}
      <div className="mb-2 space-y-2 p-2 border-b flex-shrink-0">
        {/* Tabs de categoria */}
        <div>
          <Tabs value={category} onValueChange={(v) => setCategory(v as BlockCategory)}>
            <TabsList className="h-auto w-full flex flex-wrap justify-center p-1 gap-x-1 gap-y-2 min-h-[3rem] bg-transparent">
              {Object.entries(BLOCK_CATEGORIES).map(([key, cat]) => {
                const IconComponent = cat.icon;
                const categoryNumber = Object.keys(BLOCK_CATEGORIES).indexOf(key) + 1;
                
                return (
                    <TabsTrigger
                      key={key}
                      value={key as BlockCategory}
                      className={`h-8 px-3 cursor-pointer text-xs font-medium transition-all relative flex items-center justify-center min-w-[4rem] border border-border ${cat.activeColor}`}
                      title={`${cat.label} (${categoryNumber})`}
                    >
                      <IconComponent
                        className={`absolute -top-2 left-1/2 transform -translate-x-1/2 h-3 w-3 ${cat.color}`}
                      />
                      <span
                        className={`text-[10px] leading-none mt-1 ${cat.color}`}
                      >
                        {cat.label}
                      </span>
                    </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Busca melhorada */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar blocos... (Ctrl+F)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="block-search-input h-8 pl-9 pr-9 text-sm transition-all focus:ring-1 focus:ring-primary/20"
            />
            {q && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQ("")}
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          <Button
            variant={alpha ? "default" : "outline"}
            size="sm"
            onClick={() => setAlpha((v) => !v)}
            className="h-8 px-3 transition-all"
            title="Ordenar alfabeticamente (A-Z)"
          >
            <ArrowUpAZ className="h-4 w-4" />
          </Button>
        </div>

        {/* Contador de resultados */}
        {q && (
          <div className="text-xs text-muted-foreground bg-muted/30 px-2 py-1">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "{q}"
          </div>
        )}
      </div>

      {/* Grid de blocos */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="h-full max-h-[65vh] overflow-y-auto scrollbar-thin px-2 pb-2">
          {filtered.length > 0 ? (
            <BlocksGrid items={filtered} current={current} onPick={setCurrent} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-sm text-muted-foreground mb-2">
                {q ? `Nenhum bloco encontrado para "${q}"` : "Nenhum bloco disponível"}
              </div>
              {q && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setQ("")}
                  className="text-xs"
                >
                  Limpar busca
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
