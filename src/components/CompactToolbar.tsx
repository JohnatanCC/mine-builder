import * as React from "react";
import { Button } from "@/components/ui/button";
import { 
  Square, Eraser, Brush, Minus, Copy, Palette, 
  RotateCw, RotateCcw, Undo2, Redo2, Grid3X3,
  Sun, Sunset, Moon
} from "lucide-react";
import { useWorld } from "@/state/world.store";
import type { Mode, Tool } from "@/core/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const isMode = (m: Mode, s: "place" | "delete" | "brush") => String(m) === s;
const toMode = (s: "place" | "delete" | "brush") => s as unknown as Mode;

interface CompactToolProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  tooltip: string;
  variant?: "default" | "success" | "destructive";
}

const CompactTool: React.FC<CompactToolProps> = ({ 
  icon, isActive, onClick, tooltip, variant = "default" 
}) => {
  const baseClasses = "h-9 w-9 rounded-lg border-2 transition-all duration-200 shadow-sm";
  const variantClasses = {
    default: isActive 
      ? "bg-primary/20 text-primary border-primary/50 shadow-primary/20" 
      : "hover:bg-muted border-border/50 hover:border-primary/30 hover:shadow-md",
    success: isActive 
      ? "bg-emerald-100 text-emerald-700 border-emerald-400 shadow-emerald-200" 
      : "hover:bg-emerald-50 border-border/50 hover:border-emerald-300",
    destructive: isActive 
      ? "bg-red-100 text-red-700 border-red-400 shadow-red-200" 
      : "hover:bg-red-50 border-border/50 hover:border-red-300"
  };

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className={`${baseClasses} ${variantClasses[variant]}`}
            onClick={onClick}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const CompactToolbar: React.FC = () => {
  const mode = useWorld(s => s.mode);
  const setMode = useWorld(s => s.setMode);
  
  const currentTool = useWorld(s => s.currentTool);
  const setCurrentTool = useWorld(s => s.setCurrentTool);
  const lineStart = useWorld(s => s.lineStart);
  const setLineStart = useWorld(s => s.setLineStart);
  
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

  const EnvIcon = env === "day" ? Sun : env === "dusk" ? Sunset : Moon;

  const handleModeChange = (newMode: "place" | "delete" | "brush") => {
    setMode(toMode(newMode));
    setCurrentTool("brush");
    setLineStart(null);
  };

  const handleToolChange = (tool: Tool) => {
    if (currentTool === tool) {
      setCurrentTool("brush");
      if (tool === "line") setLineStart(null);
    } else {
      setCurrentTool(tool);
    }
  };

  // Atalhos de teclado
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== document.body) return; // Evita conflito com inputs
      
      switch (e.key.toLowerCase()) {
        case 'q':
          e.preventDefault();
          handleModeChange("place");
          break;
        case 'w':
          e.preventDefault();
          handleModeChange("delete");
          break;
        case 'e':
          e.preventDefault();
          handleModeChange("brush");
          break;
        case 'l':
          e.preventDefault();
          handleToolChange("line");
          break;
        case 'c':
          e.preventDefault();
          handleToolChange("copy");
          break;
        case 'p':
          e.preventDefault();
          handleToolChange("paint");
          break;
        case 'escape':
          e.preventDefault();
          setLineStart(null);
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
  }, [handleModeChange, handleToolChange, setLineStart, showWire, setShowWire, cycleEnv, canUndo, undo, canRedo, redo, rotateBlockHorizontal, rotateBlockVertical]);

  return (
    <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-muted-foreground mr-2">Ferramentas</span>
      {/* Indicador de modo atual */}
      <div className={`flex items-center gap-2 rounded-lg border-2 px-3 py-1.5 text-sm font-medium shadow-sm ${
        isMode(mode, "place") ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-emerald-100" :
        isMode(mode, "delete") ? "bg-red-50 text-red-700 border-red-300 shadow-red-100" :
        "bg-blue-50 text-blue-700 border-blue-300 shadow-blue-100"
      }`}>
        <span className={`h-2.5 w-2.5 rounded-full ${
          isMode(mode, "place") ? "bg-emerald-500" :
          isMode(mode, "delete") ? "bg-red-500" :
          "bg-blue-500"
        }`} />
        <span className="uppercase tracking-wide font-semibold">
          {isMode(mode, "place") ? "Colocar" : isMode(mode, "delete") ? "Remover" : "Pincel"}
        </span>
      </div>

      <div className="h-8 w-px bg-border mx-1" />

      {/* Modos */}
      <div className="flex items-center gap-2">
        <CompactTool
          icon={<Square className="h-4 w-4" />}
          isActive={isMode(mode, "place")}
          onClick={() => handleModeChange("place")}
          tooltip="Modo Colocar (Q)"
          variant="success"
        />
        
        <CompactTool
          icon={<Eraser className="h-4 w-4" />}
          isActive={isMode(mode, "delete")}
          onClick={() => handleModeChange("delete")}
          tooltip="Modo Remover (W)"
          variant="destructive"
        />
        
        <CompactTool
          icon={<Brush className="h-4 w-4" />}
          isActive={isMode(mode, "brush")}
          onClick={() => handleModeChange("brush")}
          tooltip="Modo Pincel (E)"
        />
      </div>

      <div className="h-8 w-px bg-border mx-1" />

      {/* Ferramentas */}
      <div className="flex items-center gap-2">
        <CompactTool
          icon={
            <div className="relative">
              <Minus className="h-4 w-4" />
              {lineStart && (
                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              )}
            </div>
          }
          isActive={currentTool === "line"}
          onClick={() => handleToolChange("line")}
          tooltip="Ferramenta Linha (L)"
        />
        
        <CompactTool
          icon={<Copy className="h-4 w-4" />}
          isActive={currentTool === "copy"}
          onClick={() => handleToolChange("copy")}
          tooltip="Ferramenta Cópia (C)"
        />
        
        <CompactTool
          icon={<Palette className="h-4 w-4" />}
          isActive={currentTool === "paint"}
          onClick={() => handleToolChange("paint")}
          tooltip="Ferramenta Pintura (P)"
        />
      </div>

      <div className="h-8 w-px bg-border mx-1" />

      {/* Rotação */}
      <div className="flex items-center gap-2">
        <CompactTool
          icon={<RotateCw className="h-4 w-4" />}
          onClick={rotateBlockHorizontal}
          tooltip="Rotação Horizontal (R)"
        />
        
        <CompactTool
          icon={<RotateCcw className="h-4 w-4" />}
          onClick={rotateBlockVertical}
          tooltip="Rotação Vertical (T)"
        />
      </div>

      <div className="h-8 w-px bg-border mx-1" />

      {/* Histórico */}
      <div className="flex items-center gap-2">
        <CompactTool
          icon={<Undo2 className="h-4 w-4" />}
          onClick={() => canUndo && undo()}
          tooltip="Desfazer (Ctrl+Z)"
        />
        
        <CompactTool
          icon={<Redo2 className="h-4 w-4" />}
          onClick={() => canRedo && redo()}
          tooltip="Refazer (Ctrl+Y)"
        />
      </div>

      <div className="h-8 w-px bg-border mx-1" />

      {/* Configurações */}
      <div className="flex items-center gap-2">
        <CompactTool
          icon={<Grid3X3 className="h-4 w-4" />}
          isActive={showWire}
          onClick={() => setShowWire(!showWire)}
          tooltip="Wireframe (G)"
        />
        
        <CompactTool
          icon={<EnvIcon className="h-4 w-4" />}
          onClick={cycleEnv}
          tooltip="Mudar Ambiente (F)"
        />
      </div>
    </div>
  );
};
