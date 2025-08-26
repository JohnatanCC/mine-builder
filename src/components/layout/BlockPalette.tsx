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
  building: {
    label: "Construção",
    color: "text-slate-600 border-slate-200",
    blocks: ["stone", "brick", "cobblestone", "concrete", "glass"]
  },
  nature: {
    label: "Natureza", 
    color: "text-emerald-600 border-emerald-200",
    blocks: ["wood", "log", "leaves", "grass", "dirt", "sand"]
  },
  decoration: {
    label: "Decoração",
    color: "text-purple-600 border-purple-200", 
    blocks: ["wool", "carpet", "flower", "painting"]
  },
  utility: {
    label: "Utilitários",
    color: "text-orange-600 border-orange-200",
    blocks: ["ladder", "door", "chest", "workbench"]
  }
} as const;

function useAllBlocks(): BlockType[] {
  return useMemo(() => Object.keys(REGISTRY) as BlockType[], []);
}

function groupBlocksByCategory(blocks: BlockType[]) {
  const groups: Record<keyof typeof CATEGORIES, BlockType[]> = {
    building: [],
    nature: [],
    decoration: [],
    utility: []
  };

  blocks.forEach(blockType => {
    const blockDef = REGISTRY[blockType];
    if (!blockDef) return;
    
    const category = blockDef.category;
    
    // Categorize blocks based on their properties
    if (category === 'stone' || category === 'brick' || blockType.includes('concrete') || blockType.includes('glass')) {
      groups.building.push(blockType);
    } else if (category === 'wood' || category === 'log' || category === 'leaves' || blockType.includes('grass') || blockType.includes('dirt')) {
      groups.nature.push(blockType);
    } else if (blockType.includes('wool') || blockType.includes('carpet') || blockType.includes('flower')) {
      groups.decoration.push(blockType);
    } else {
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
  const { isMobile, isTablet } = useResponsive();
  
  const gridCols = isMobile ? "grid-cols-3" : isTablet ? "grid-cols-4" : "grid-cols-5";
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
  const [activeCategory, setActiveCategory] = useState<keyof typeof CATEGORIES>("building");

  const groupedBlocks = useMemo(() => groupBlocksByCategory(allBlocks), [allBlocks]);

  const filteredBlocks = useMemo(() => {
    if (!searchTerm) return groupedBlocks;
    
    const term = searchTerm.toLowerCase();
    const filtered: typeof groupedBlocks = {
      building: [],
      nature: [],
      decoration: [],
      utility: []
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
        '1': 'building',
        '2': 'nature', 
        '3': 'decoration',
        '4': 'utility'
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
    <div className={cn("flex flex-col bg-card", containerWidth)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h2 className="text-sm font-semibold">Blocos</h2>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Grid3X3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar blocos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Categories */}
      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as keyof typeof CATEGORIES)}>
        <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 m-2 h-auto p-1">
          {Object.entries(CATEGORIES).map(([key, category]) => (
            <TabsTrigger
              key={key}
              value={key}
              className={cn(
                "text-xs font-medium transition-all",
                category.color,
                "data-[state=active]:bg-background data-[state=active]:shadow-sm"
              )}
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Block Grids */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(CATEGORIES).map(([key]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <BlockGrid
                items={filteredBlocks[key as keyof typeof CATEGORIES]}
                current={current}
                onPick={setCurrent}
              />
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {/* Footer with current selection */}
      <div className="p-3 border-t border-border bg-muted/30">
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
