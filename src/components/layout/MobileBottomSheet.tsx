import * as React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, Grid3X3 } from "lucide-react";
import { useWorld } from "@/state/world.store";
import { getLabel } from "@/core/blocks/registry";
import { BlockIcon } from "@/ui/BlockIcon";
import { BlockPalette } from "./BlockPalette";

export function MobileBottomSheet() {
  const current = useWorld(s => s.current);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-t border-border bg-card">
      {/* Quick Bar */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg border bg-background">
            <BlockIcon type={current} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{getLabel(current)}</p>
            <Badge variant="outline" className="text-xs">{current}</Badge>
          </div>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              <ChevronUp className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="bottom" 
            className="h-[80vh] p-0"
            onInteractOutside={() => setIsOpen(false)}
          >
            <BlockPalette />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
