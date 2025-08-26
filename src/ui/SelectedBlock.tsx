import * as React from "react";
import { useWorld } from "@/state/world.store";
import { BlockIcon } from "@/ui/BlockIcon";
import { getLabel, REGISTRY } from "@/core/blocks/registry";
import { Button } from "@/components/ui/button";
import { Box, Layers3, Square } from "lucide-react";
import type { BlockVariant } from "@/core/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const VARIANT_CONFIG = {
  block: {
    icon: Box,
    label: "Bloco",
    description: "Bloco completo"
  },
  stairs: {
    icon: Layers3,
    label: "Escada",
    description: "Bloco em formato de escada"
  },
  slab: {
    icon: Square,
    label: "Laje",
    description: "Bloco em formato de laje"
  }
} as const;

export const SelectedBlock: React.FC = () => {
  const current = useWorld((s) => s.current);
  const currentVariant = useWorld((s) => s.currentVariant);
  const setCurrentVariant = useWorld((s) => s.setCurrentVariant);
  
  const blockInfo = REGISTRY[current];
  const category = blockInfo?.category || "Geral";

  const handleVariantChange = (variant: BlockVariant) => {
    setCurrentVariant(variant);
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card/95 backdrop-blur px-4 py-3 shadow-lg">
      <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
        Selecionado:
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-md border bg-muted/30 flex items-center justify-center">
            <BlockIcon type={current} size={32} />
          </div>
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[9px] font-bold">
            ✓
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-sm font-medium leading-tight">
            {getLabel(current)}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {category}
          </div>
        </div>
      </div>

      {/* Separador */}
      <div className="w-px h-8 bg-border" />

      {/* Variantes */}
      <div className="flex items-center gap-1">
        <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium mr-2">
          Forma:
        </div>
        <TooltipProvider delayDuration={300}>
          {(Object.entries(VARIANT_CONFIG) as [BlockVariant, typeof VARIANT_CONFIG[BlockVariant]][]).map(([variant, config]) => {
            const Icon = config.icon;
            const isSelected = currentVariant === variant;
            
            return (
              <Tooltip key={variant}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVariantChange(variant)}
                    className={[
                      "h-8 w-8 p-0 transition-all duration-200",
                      isSelected 
                        ? "ring-2 ring-primary/20 shadow-sm" 
                        : "hover:bg-accent"
                    ].join(" ")}
                    aria-pressed={isSelected}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  <div className="font-medium">{config.label}</div>
                  <div className="text-muted-foreground">{config.description}</div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
};
