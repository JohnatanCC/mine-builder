// UPDATE: src/ui/panels/LeftTools.tsx
// (não muda layout; só garante que o catálogo está sempre visível)
import * as React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Square, Eraser, Brush, Undo2, Redo2, Grid3X3, BoxSelect } from "lucide-react";
import { BlockCatalogPanel } from "@/ui/catalog/BlockCatalogPanel";
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
          className="m-1 h-12 w-12 data-[state=on]:bg-primary/15 data-[state=on]:text-primary"
        >
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const LeftTools: React.FC = () => {
  const [mode, setMode] = React.useState<"place" | "remove" | "brush">("place");

  return (
    <>
      {/* Barra de ferramentas existente */}
      <div className="flex h-full flex-col items-center py-2">


        <Tool label="Colocar (LMB)" pressed={mode === "place"} onPressedChange={() => setMode("place")}><Square className="h-5 w-5" /></Tool>
        <Tool label="Remover (RMB)" pressed={mode === "remove"} onPressedChange={() => setMode("remove")}><Eraser className="h-5 w-5" /></Tool>
        <Tool label="Pincel (Ctrl+Arrastar)" pressed={mode === "brush"} onPressedChange={() => setMode("brush")}><Brush className="h-5 w-5" /></Tool>
        <div className="my-2 h-px w-10 bg-border" />
        <Tool label="Desfazer (Z)"><Undo2 className="h-5 w-5" /></Tool>
        <Tool label="Refazer (Y)"><Redo2 className="h-5 w-5" /></Tool>
        <div className="my-2 h-px w-10 bg-border" />
        <Tool label="Grade no chão"><Grid3X3 className="h-5 w-5" /></Tool>
        <Tool label="Seleção (experimentos)"><BoxSelect className="h-5 w-5" /></Tool>
        <BlockCatalogPanel />
      </div>
    </>
  );
};
