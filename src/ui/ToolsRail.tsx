// SUGESTÃO: src/ui/panels/ToolsRail.tsx
import * as React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Square, Eraser, Brush, Undo2, Redo2, Grid3X3, BoxSelect } from "lucide-react";
import { PiMouseLeftClickFill, PiMouseRightClickFill } from "react-icons/pi";

const Tool: React.FC<React.PropsWithChildren<{
  label: string; pressed?: boolean; onPressedChange?: (v: boolean) => void;
}>> = ({ label, pressed, onPressedChange, children }) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          aria-label={label}
          pressed={pressed}
          onPressedChange={onPressedChange}
          className="mb-1 h-10 w-10 rounded-lg border bg-background/80 backdrop-blur data-[state=on]:bg-primary/15 data-[state=on]:text-primary"
        >
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const ToolsRail: React.FC = () => {
  const [mode, setMode] = React.useState<"place" | "remove" | "brush">("place");
  return (
    <div className="flex gap-1 flex-col items-center rounded-sm border bg-card/90 p-1 shadow-lg">
      <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex justify-center items-center"><kbd className="rounded bg-muted p-1 mr-1"><PiMouseLeftClickFill /> </kbd> Coloca</span>
        <span className="flex justify-center items-center"><kbd className="rounded bg-muted p-1 mr-1"><PiMouseRightClickFill /> </kbd> Remove</span>
        <span className="flex justify-center items-center"><kbd className="rounded bg-muted p-1 mr-1">Ctrl</kbd> Pincel</span>
      </div>
      <div className="flex flex-row items-center justify-center gap-1">
        <Tool label="Colocar (LMB)" pressed={mode === "place"} onPressedChange={() => setMode("place")}><Square className="h-3 w-3" /></Tool>
        <Tool label="Remover (RMB)" pressed={mode === "remove"} onPressedChange={() => setMode("remove")}><Eraser className="h-3 w-3" /></Tool>
        <Tool label="Pincel (Ctrl+Arrastar)" pressed={mode === "brush"} onPressedChange={() => setMode("brush")}><Brush className="h-3 w-3" /></Tool>

        <div className="my-2 h-px w-4 bg-border/70" />

        <Tool label="Desfazer (Z)"><Undo2 className="h-3 w-3" /></Tool>
        <Tool label="Refazer (Y)"><Redo2 className="h-3 w-3" /></Tool>

        <div className="my-2 h-px w-4 bg-border/70" />

        <Tool label="Grade no chão"><Grid3X3 className="h-3 w-3" /></Tool>
        <Tool label="Seleção (experimentos)"><BoxSelect className="h-3 w-3" /></Tool>
      </div>
    </div>
  );
};
