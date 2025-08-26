import * as React from "react";
import { useWorld } from "@/state/world.store";
import { BlockIcon } from "@/ui/BlockIcon";
import { getLabel, REGISTRY } from "@/core/blocks/registry";

export const SelectedBlock: React.FC = () => {
  const current = useWorld((s) => s.current);
  const blockInfo = REGISTRY[current];
  const category = blockInfo?.category || "Geral";

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
    </div>
  );
};
