import { useMemo, useState, useEffect } from "react";
import { REGISTRY, getLabel } from "@/core/blocks/registry";
import type { BlockType } from "@/core/types";
import { useWorld } from "@/state/world.store";
import { BlockIcon } from "@/ui/BlockIcon";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3X3 } from "lucide-react";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

// Block categories with semantic colors
const CATEGORIES = {
  all: {
    label: "Todos",
    color: "text-slate-600 border-slate-200",
    icon: "🏗️"
  },
  stone: {
    label: "Pedras",
    color: "text-stone-600 border-stone-200",
    icon: "🗿"
  },
  wood: {
    label: "Madeiras",
    color: "text-amber-600 border-amber-200", 
    icon: "🪵"
  },
  glass: {
    label: "Vidros",
    color: "text-cyan-600 border-cyan-200",
    icon: "🪟"
  },
  decoration: {
    label: "Decoração",
    color: "text-purple-600 border-purple-200",
    icon: "🎨"
  },
  utility: {
    label: "Utilitários",
    color: "text-orange-600 border-orange-200",
    icon: "⚙️"
  },
  nature: {
    label: "Natureza",
    color: "text-emerald-600 border-emerald-200",
    icon: "🌿"
  }
} as const;

function useAllBlocks(): BlockType[] {
  return useMemo(() => Object.keys(REGISTRY) as BlockType[], []);
}

function groupBlocksByCategory(blocks: BlockType[]) {
  const groups: Record<keyof typeof CATEGORIES, BlockType[]> = {
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
    groups.all.push(blockType);
    
    // Categorizar blocos baseado em suas propriedades e categorias do registry
    if (category === 'stone' || category === 'brick' || category === 'concrete' || category === 'copper' || category === 'tuff') {
      groups.stone.push(blockType);
    } else if (category === 'wood' || category === 'log') {
      groups.wood.push(blockType);
    } else if (category === 'glass' || blockDef.isGlass) {
      groups.glass.push(blockType);
    } else if (blockType.includes('wool') || blockType === 'bookshelf') {
      groups.decoration.push(blockType);
    } else if (category === 'leaves' || blockType.includes('grass') || blockType.includes('dirt') || 
               blockType === 'moss_block' || blockType === 'mud' || blockType === 'snow' || 
               blockType === 'shroomlight') {
      groups.nature.push(blockType);
    } else {
      // Utilitários: crafting_table, redstone_lamp_on, iron_bars, trapdoors, etc.
      groups.utility.push(blockType);
    }
  });

  return groups;
}

interface BlockGridProps {
  items: BlockType[];
  current: BlockType;
  onPick: (t: BlockType) => void;
}

function BlockGrid({ items, current, onPick }: BlockGridProps) {
  const { isMobile } = useResponsive();
  
  const gridCols = isMobile ? "grid-cols-3" : "grid-cols-5";
  const blockSize = isMobile ? "h-14 w-14" : "h-16 w-16";

  return (
    <div className={cn("grid gap-2 p-2", gridCols)}>
      {items.map((blockType) => {
        const selected = blockType === current;
        return (
          <button
            key={blockType}
            onClick={() => onPick(blockType)}
            aria-label={getLabel(blockType)}
            aria-pressed={selected}
            className={cn(
              blockSize,
              "flex items-center justify-center rounded-md border-2 transition-all duration-200 hover:scale-105",
              selected 
                ? "border-primary bg-primary/10 ring-2 ring-primary/20" 
                : "border-border bg-card hover:border-primary/50 hover:bg-accent"
            )}
          >
            <BlockIcon type={blockType} />
          </button>
        );
      })}
    </div>
  );
}

export function BlockPalette() {
  const allBlocks = useAllBlocks();
  const current = useWorld(s => s.current);
  const setCurrent = useWorld(s => s.setCurrent);
  const { isMobile } = useResponsive();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<keyof typeof CATEGORIES>("all");

  const groupedBlocks = useMemo(() => groupBlocksByCategory(allBlocks), [allBlocks]);

  const filteredBlocks = useMemo(() => {
    if (!searchTerm) return groupedBlocks;
    
    const term = searchTerm.toLowerCase();
    const filtered: typeof groupedBlocks = {
      all: [],
      stone: [],
      wood: [],
      glass: [],
      decoration: [],
      utility: [],
      nature: []
    };

    Object.entries(groupedBlocks).forEach(([category, blocks]) => {
      filtered[category as keyof typeof CATEGORIES] = blocks.filter(block =>
        getLabel(block).toLowerCase().includes(term) ||
        block.toLowerCase().includes(term)
      );
    });

    return filtered;
  }, [groupedBlocks, searchTerm]);

  // Keyboard shortcuts for categories
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      const categoryKeys: Record<string, keyof typeof CATEGORIES> = {
        '1': 'all',
        '2': 'stone',
        '3': 'wood', 
        '4': 'glass',
        '5': 'decoration',
        '6': 'utility',
        '7': 'nature'
      };

      const category = categoryKeys[e.key];
      if (category) {
        setActiveCategory(category);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const containerWidth = isMobile ? "w-full" : "w-80";

  return (
    <div className={cn("flex flex-col bg-card max-h-screen", containerWidth)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
        <h2 className="text-sm font-semibold">Blocos</h2>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Grid3X3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar blocos... (Ctrl+F)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Categories */}
      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as keyof typeof CATEGORIES)} className="flex flex-col flex-1 overflow-hidden">
        <div className="px-2 py-1 border-b border-border flex-shrink-0">
          <TabsList className={cn(
            "w-full h-auto p-1 gap-1 grid",
            isMobile ? "grid-cols-4" : "grid-cols-7"
          )}>
            {Object.entries(CATEGORIES).map(([key, category]) => (
              <TabsTrigger
                key={key}
                value={key}
                className={cn(
                  "text-xs font-medium transition-all flex flex-col items-center justify-center py-2 px-1",
                  isMobile ? "min-h-[2.5rem]" : "min-h-[3rem]",
                  category.color,
                  "data-[state=active]:bg-background data-[state=active]:shadow-sm"
                )}
              >
                <span className={cn("mb-1", isMobile ? "text-xs" : "text-sm")}>{category.icon}</span>
                <span className="leading-tight text-center">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Block Grids */}
        <div className="flex-1 overflow-hidden">
          {Object.entries(CATEGORIES).map(([key]) => (
            <TabsContent key={key} value={key} className="mt-0 h-full">
              <div className={cn(
                "h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
                isMobile ? "max-h-[50vh]" : "max-h-[65vh]"
              )}>
                <BlockGrid
                  items={filteredBlocks[key as keyof typeof CATEGORIES]}
                  current={current}
                  onPick={setCurrent}
                />
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {/* Footer with current selection */}
      <div className="p-3 border-t border-border bg-muted/30 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center rounded border bg-background">
            <BlockIcon type={current} />
          </div>
          <span className="text-sm font-medium">{getLabel(current)}</span>
        </div>
      </div>
    </div>
  );
}
