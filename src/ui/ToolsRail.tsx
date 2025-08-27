// UPDATE: src/ui/panels/ToolsRail.tsx
import * as React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Square, Eraser, Brush, Undo2, Redo2, Grid3X3, Sun, Sunset, Moon, RotateCw, RotateCcw, Minus, Copy, Palette } from "lucide-react";
import { useWorld } from "@/state/world.store";
import type { Mode, Tool } from "@/core/types";

const isMode = (m: Mode, s: "place" | "delete" | "brush") => String(m) === s;
const toMode = (s: "place" | "delete" | "brush") => s as unknown as Mode;

const Tool: React.FC<React.PropsWithChildren<{
  label: string; 
  pressed?: boolean; 
  onPressedChange?: (v: boolean) => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "success" | "rotation";
  shortcut?: string;
}>> = ({ label, pressed, onPressedChange, disabled, variant = "default", shortcut, children }) => {
  const variantClasses = {
    default: "data-[state=on]:bg-primary/15 data-[state=on]:text-primary",
    destructive: "data-[state=on]:bg-red-100 data-[state=on]:text-red-700 hover:bg-red-50",
    success: "data-[state=on]:bg-green-100 data-[state=on]:text-green-700 hover:bg-green-50",
    rotation: "data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700 hover:bg-blue-50"
  };

  const displayLabel = shortcut ? `${label} (${shortcut})` : label;

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
              "transition-all duration-200 ease-out shadow-sm relative",
              variantClasses[variant],
              disabled 
                ? "opacity-40 cursor-not-allowed" 
                : pressed 
                  ? "scale-95 shadow-inner border-primary/30 ring-2 ring-primary/20" 
                  : "hover:scale-105 hover:shadow-md active:scale-95 border-border/50 hover:border-primary/20",
            ].join(" ")}
          >
            {children}
            {/* Indicador visual para ferramentas ativas */}
            {pressed && (
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
            )}
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs font-medium">
          {displayLabel}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ToolsRail: React.FC = () => {
  const mode = useWorld(s => s.mode);
  const setMode = useWorld(s => s.setMode);

  const undo = useWorld(s => s.undo);
  const redo = useWorld(s => s.redo);
  const canUndo = useWorld(s => s.canUndo());
  const canRedo = useWorld(s => s.canRedo());

  const showWire = useWorld(s => s.showWire);
  const setShowWire = useWorld(s => s.setShowWire);

  const env = useWorld(s => s.envPreset);
  const cycleEnv = useWorld(s => s.cycleEnvPreset);

  const rotateBlockHorizontal = useWorld(s => s.rotateBlockHorizontal);
  const rotateBlockVertical = useWorld(s => s.rotateBlockVertical);
  const currentRotation = useWorld(s => s.currentRotation);

  // Tools state
  const currentTool = useWorld(s => s.currentTool);
  const setCurrentTool = useWorld(s => s.setCurrentTool);
  const lineStart = useWorld(s => s.lineStart);
  const setLineStart = useWorld(s => s.setLineStart);

  const effectiveBrush = isMode(mode, "brush");

  const EnvIcon = env === "day" ? Sun : env === "dusk" ? Sunset : Moon;
  const envLabel = env === "day" ? "Céu: Dia" : env === "dusk" ? "Céu: Tarde" : "Céu: Noite";

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return; // Evita conflito com inputs
      
      switch (e.key.toLowerCase()) {
        case 'q':
          e.preventDefault();
          setMode(toMode("place"));
          setCurrentTool("brush"); // Reset tool when changing mode
          setLineStart(null); // Clear line start
          break;
        case 'w':
          e.preventDefault();
          setMode(toMode("delete"));
          setCurrentTool("brush"); // Reset tool when changing mode
          setLineStart(null); // Clear line start
          break;
        case 'e':
          e.preventDefault();
          setMode(toMode("brush"));
          setCurrentTool("brush"); // Reset tool when changing mode
          setLineStart(null); // Clear line start
          break;
        case 'l':
          e.preventDefault();
          setCurrentTool("line");
          break;
        case 'c':
          e.preventDefault();
          setCurrentTool("copy");
          break;
        case 'p':
          e.preventDefault();
          setCurrentTool("paint");
          break;
        case 'escape':
          e.preventDefault();
          setLineStart(null); // Cancel line
          break;
        case 'r':
          e.preventDefault();
          rotateBlockHorizontal();
          break;
        case 't':
          e.preventDefault();
          rotateBlockVertical();
          break;
        case 'g':
          e.preventDefault();
          setShowWire(!showWire);
          break;
        case 'f':
          e.preventDefault();
          cycleEnv();
          break;
        case 'z':
          if (e.ctrlKey) {
            e.preventDefault();
            if (canUndo) undo();
          }
          break;
        case 'y':
          if (e.ctrlKey) {
            e.preventDefault();
            if (canRedo) redo();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setMode, setCurrentTool, setLineStart, showWire, setShowWire, cycleEnv, canUndo, undo, canRedo, redo, rotateBlockHorizontal, rotateBlockVertical]);

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
          label="Modo Colocar"
          pressed={isMode(mode, "place")}
          onPressedChange={(v) => v && setMode(toMode("place"))}
          variant="success"
          shortcut="Q"
        >
          <Square className="h-4 w-4" />
        </Tool>

        <Tool
          label="Modo Remover"
          pressed={isMode(mode, "delete")}
          onPressedChange={(v) => v && setMode(toMode("delete"))}
          variant="destructive"
          shortcut="W"
        >
          <Eraser className="h-4 w-4" />
        </Tool>

        <Tool
          label="Modo Pincel"
          pressed={effectiveBrush}
          onPressedChange={(v) => v && setMode(toMode("brush"))}
          shortcut="E"
        >
          <Brush className="h-4 w-4" />
        </Tool>

        <Tool
          label={lineStart ? "Ferramenta Linha (Clique para finalizar)" : "Ferramenta Linha"}
          pressed={currentTool === "line"}
          onPressedChange={(v) => {
            if (v) {
              setCurrentTool("line");
            } else {
              setCurrentTool("brush"); // volta para brush quando desativado
              setLineStart(null); // Clear line start when deactivating
            }
          }}
          shortcut="L"
        >
          <Minus className="h-4 w-4" />
          {lineStart && (
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-orange-500 border-2 border-background animate-pulse" />
          )}
        </Tool>

        <Tool
          label="Ferramenta Cópia"
          pressed={currentTool === "copy"}
          onPressedChange={(v) => {
            if (v) {
              setCurrentTool("copy");
            } else {
              setCurrentTool("brush");
            }
          }}
          shortcut="C"
        >
          <Copy className="h-4 w-4" />
        </Tool>

        <Tool
          label="Ferramenta Pintura"
          pressed={currentTool === "paint"}
          onPressedChange={(v) => {
            if (v) {
              setCurrentTool("paint");
            } else {
              setCurrentTool("brush");
            }
          }}
          shortcut="P"
        >
          <Palette className="h-4 w-4" />
        </Tool>
      </div>

      {/* Divisor */}
      <div className="h-7 w-px bg-border/50" />

      {/* Ferramentas de rotação */}
      <div className="flex items-center gap-1.5">
        <Tool
          label="Rotação Horizontal"
          onPressedChange={rotateBlockHorizontal}
          variant="rotation"
          shortcut="R"
        >
          <RotateCw className="h-4 w-4" />
        </Tool>

        <Tool
          label="Rotação Vertical"
          onPressedChange={rotateBlockVertical}
          variant="rotation"
          shortcut="T"
        >
          <RotateCcw className="h-4 w-4" />
        </Tool>

        {/* Indicador de rotação atual */}
        <div className="flex flex-col items-center text-xs text-muted-foreground ml-2">
          <div className="font-mono text-[10px] leading-tight">
            X:{currentRotation?.x || 0}°
          </div>
          <div className="font-mono text-[10px] leading-tight">
            Y:{currentRotation?.y || 0}°
          </div>
        </div>
      </div>

      {/* Divisor */}
      <div className="h-7 w-px bg-border/50" />

      {/* Ações de histórico */}
      <div className="flex items-center gap-1.5">
        <Tool 
          label="Desfazer" 
          onPressedChange={() => canUndo && undo()}
          disabled={!canUndo}
          shortcut="Ctrl+Z"
        >
          <Undo2 className="h-4 w-4" />
        </Tool>
        <Tool 
          label="Refazer" 
          onPressedChange={() => canRedo && redo()}
          disabled={!canRedo}
          shortcut="Ctrl+Y"
        >
          <Redo2 className="h-4 w-4" />
        </Tool>
      </div>

      {/* Divisor */}
      <div className="h-7 w-px bg-border/50" />

      {/* Configurações */}
      <div className="flex items-center gap-1.5">
        <Tool
          label="Wireframe"
          pressed={showWire}
          onPressedChange={() => setShowWire(!showWire)}
          shortcut="G"
        >
          <Grid3X3 className="h-4 w-4" />
        </Tool>

        <Tool 
          label={envLabel} 
          onPressedChange={cycleEnv}
          shortcut="F"
        >
          <EnvIcon className="h-4 w-4" />
        </Tool>
      </div>
    </div>
  );
};
