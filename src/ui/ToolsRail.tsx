// UPDATE: src/ui/panels/ToolsRail.tsx
import * as React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Square, Eraser, Brush, Undo2, Redo2, Grid3X3, BoxSelect } from "lucide-react";
import { PiMouseLeftClickFill, PiMouseRightClickFill } from "react-icons/pi";
import { useWorld } from "@/state/world.store";
import type { Mode } from "@/core/types";

const isMode = (m: Mode, s: "place" | "delete" | "brush") => String(m) === s;
const toMode = (s: "place" | "delete" | "brush") => s as unknown as Mode;

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
          className={[
            "mb-1 h-10 w-10 rounded-lg border bg-background/80 backdrop-blur",
            "transition-transform duration-150 ease-out",
            "data-[state=on]:bg-primary/15 data-[state=on]:text-primary",
            pressed ? "scale-95 shadow-inner" : "hover:scale-98 active:scale-95",
          ].join(" ")}
        >
          {children}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">{label}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const ToolsRail: React.FC = () => {
  const mode = useWorld(s => s.mode);
  const setMode = useWorld(s => s.setMode);
  const isCtrlDown = useWorld(s => s.isCtrlDown);

  const undo = useWorld(s => s.undo);
  const redo = useWorld(s => s.redo);
  const canUndo = useWorld(s => s.canUndo());
  const canRedo = useWorld(s => s.canRedo());

  // “Brush” temporário quando Ctrl está pressionado (sem mudar state)
  const effectiveBrush = isCtrlDown || isMode(mode, "brush");

  const ModeChip: React.FC = () => (
    <div className="mt-1 mb-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] leading-none">
      <span className={`inline-block h-2 w-2 rounded-full ${
        isMode(mode, "place") ? "bg-emerald-500"
        : isMode(mode, "delete") ? "bg-rose-500"
        : "bg-sky-500"
      }`} />
      <span className="uppercase tracking-wide">
        {isMode(mode, "place") ? "Colocar"
          : isMode(mode, "delete") ? "Remover"
          : "Pincel"}
        {isCtrlDown && " (Ctrl)"}
      </span>
    </div>
  );

  return (
    <div className="flex gap-1 flex-col items-center rounded-sm border bg-card/90 p-1 shadow-lg">
      <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center"><kbd className="rounded bg-muted px-1 mr-1"><PiMouseLeftClickFill /></kbd> Coloca</span>
        <span className="flex items-center"><kbd className="rounded bg-muted px-1 mr-1"><PiMouseRightClickFill /></kbd> Remove</span>
        <span className="flex items-center"><kbd className="rounded bg-muted px-1 mr-1">Ctrl</kbd> Pincel</span>
      </div>

      {/* Indicador persistente de modo */}
      <ModeChip />

      <div className="flex flex-row items-center justify-center gap-1">
        <Tool
          label="Colocar (LMB)"
          pressed={isMode(mode, "place")}
          onPressedChange={(v) => v && setMode(toMode("place"))}
        >
          <Square className="h-4 w-4" />
        </Tool>

        <Tool
          label="Remover (RMB)"
          pressed={isMode(mode, "delete")}
          onPressedChange={(v) => v && setMode(toMode("delete"))}
        >
          <Eraser className="h-4 w-4" />
        </Tool>

        <Tool
          label="Pincel (Ctrl+Arrastar)"
          pressed={effectiveBrush}
          onPressedChange={(v) => v && setMode(toMode("brush"))}
        >
          <Brush className="h-4 w-4" />
        </Tool>

        <div className="my-2 h-px w-4 bg-border/70" />

        <Tool label="Desfazer (Ctrl+Z)" onPressedChange={() => canUndo && undo()}>
          <Undo2 className="h-4 w-4" />
        </Tool>
        <Tool label="Refazer (Ctrl+Y / Shift+Ctrl+Z)" onPressedChange={() => canRedo && redo()}>
          <Redo2 className="h-4 w-4" />
        </Tool>

        <div className="my-2 h-px w-4 bg-border/70" />

        <Tool label="Grade no chão"><Grid3X3 className="h-4 w-4" /></Tool>
        <Tool label="Seleção (experimentos)"><BoxSelect className="h-4 w-4" /></Tool>
      </div>
    </div>
  );
};
