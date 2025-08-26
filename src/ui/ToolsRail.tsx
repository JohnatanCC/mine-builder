// UPDATE: src/ui/panels/ToolsRail.tsx
import * as React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Square, Eraser, Brush, Undo2, Redo2, Grid3X3, Sun, Sunset, Moon } from "lucide-react";
import { useWorld } from "@/state/world.store";
import type { Mode } from "@/core/types";

const isMode = (m: Mode, s: "place" | "delete" | "brush") => String(m) === s;
const toMode = (s: "place" | "delete" | "brush") => s as unknown as Mode;

const Tool: React.FC<React.PropsWithChildren<{
  label: string; 
  pressed?: boolean; 
  onPressedChange?: (v: boolean) => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "success";
}>> = ({ label, pressed, onPressedChange, disabled, variant = "default", children }) => {
  const variantClasses = {
    default: "data-[state=on]:bg-primary/15 data-[state=on]:text-primary",
    destructive: "data-[state=on]:bg-red-100 data-[state=on]:text-red-700 hover:bg-red-50",
    success: "data-[state=on]:bg-green-100 data-[state=on]:text-green-700 hover:bg-green-50"
  };

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            aria-label={label}
            pressed={pressed}
            onPressedChange={onPressedChange}
            disabled={disabled}
            className={[
              "h-9 w-9 rounded-md border bg-background/90 backdrop-blur",
              "transition-all duration-200 ease-out shadow-sm",
              variantClasses[variant],
              disabled 
                ? "opacity-40 cursor-not-allowed" 
                : pressed 
                  ? "scale-95 shadow-inner border-primary/30" 
                  : "hover:scale-105 hover:shadow-md active:scale-95 border-border/50 hover:border-primary/20",
            ].join(" ")}
          >
            {children}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ToolsRail: React.FC = () => {
  const mode = useWorld(s => s.mode);
  const setMode = useWorld(s => s.setMode);
  const isCtrlDown = useWorld(s => s.isCtrlDown);

  const undo = useWorld(s => s.undo);
  const redo = useWorld(s => s.redo);
  const canUndo = useWorld(s => s.canUndo());
  const canRedo = useWorld(s => s.canRedo());

  const showWire = useWorld(s => s.showWire);
  const setShowWire = useWorld(s => s.setShowWire);

  const env = useWorld(s => s.envPreset);
  const cycleEnv = useWorld(s => s.cycleEnvPreset);

  const effectiveBrush = isCtrlDown || isMode(mode, "brush");

  const EnvIcon = env === "day" ? Sun : env === "dusk" ? Sunset : Moon;
  const envLabel = env === "day" ? "Céu: Dia (alternar)" : env === "dusk" ? "Céu: Tarde (alternar)" : "Céu: Noite (alternar)";

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card/95 backdrop-blur px-4 py-3 shadow-lg">
      {/* Indicador de modo compacto */}
      <div className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium ${
        isMode(mode, "place") ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
        isMode(mode, "delete") ? "bg-rose-50 text-rose-700 border-rose-200" :
        "bg-sky-50 text-sky-700 border-sky-200"
      }`}>
        <span className={`h-2.5 w-2.5 rounded-full ${
          isMode(mode, "place") ? "bg-emerald-500" :
          isMode(mode, "delete") ? "bg-rose-500" :
          "bg-sky-500"
        }`} />
        <span className="uppercase tracking-wide">
          {isMode(mode, "place") ? "Colocar" : isMode(mode, "delete") ? "Remover" : "Pincel"}
        </span>
      </div>

      {/* Divisor */}
      <div className="h-7 w-px bg-border/50" />

      {/* Ferramentas principais - horizontal */}
      <div className="flex items-center gap-1.5">
        <Tool
          label="Modo Colocar (Clique Esquerdo)"
          pressed={isMode(mode, "place")}
          onPressedChange={(v) => v && setMode(toMode("place"))}
          variant="success"
        >
          <Square className="h-4 w-4" />
        </Tool>

        <Tool
          label="Modo Remover (Clique Direito)"
          pressed={isMode(mode, "delete")}
          onPressedChange={(v) => v && setMode(toMode("delete"))}
          variant="destructive"
        >
          <Eraser className="h-4 w-4" />
        </Tool>

        <Tool
          label="Modo Pincel (Ctrl + Arrastar)"
          pressed={effectiveBrush}
          onPressedChange={(v) => v && setMode(toMode("brush"))}
        >
          <Brush className="h-4 w-4" />
        </Tool>
      </div>

      {/* Divisor */}
      <div className="h-7 w-px bg-border/50" />

      {/* Ações de histórico */}
      <div className="flex items-center gap-1.5">
        <Tool 
          label="Desfazer (Ctrl+Z)" 
          onPressedChange={() => canUndo && undo()}
          disabled={!canUndo}
        >
          <Undo2 className="h-4 w-4" />
        </Tool>
        <Tool 
          label="Refazer (Ctrl+Y)" 
          onPressedChange={() => canRedo && redo()}
          disabled={!canRedo}
        >
          <Redo2 className="h-4 w-4" />
        </Tool>
      </div>

      {/* Divisor */}
      <div className="h-7 w-px bg-border/50" />

      {/* Configurações */}
      <div className="flex items-center gap-1.5">
        <Tool
          label={showWire ? "Ocultar Wireframe" : "Mostrar Wireframe"}
          pressed={showWire}
          onPressedChange={() => setShowWire(!showWire)}
        >
          <Grid3X3 className="h-4 w-4" />
        </Tool>

        <Tool label={envLabel} onPressedChange={cycleEnv}>
          <EnvIcon className="h-4 w-4" />
        </Tool>
      </div>
    </div>
  );
};
