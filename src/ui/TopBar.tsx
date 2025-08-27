// UPDATE: src/ui/TopBar.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileDown, FileUp, Layers, Info, Sun, Moon, Laptop2 } from "lucide-react";
import { exportWorldJSON, handleImportFile } from "../systems/world/serializer";
import { useThemeContext } from "@/ui/theme/ThemeProvider";
import { useWorld } from "@/state/world.store";
import Logo from "../assets/mb_logo.png";

export const TopBar: React.FC = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useThemeContext();

 // 🔢 contador de blocos (selector leve)
 const blockCount = useWorld(s => s.blocks.size);

  const onImportClick = () => fileInputRef.current?.click();
  const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleImportFile(file);
    e.target.value = "";
  };

  return (
    <div className="flex items-center justify-between text-sm border-b px-3 py-2">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-6 h-6" />
          <span className="font-semibold">Mine Builder</span>
          <span className="text-xs text-muted-foreground">v0.5.0</span>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {blockCount} blocos
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Tema */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              Tema
              {theme === "dark" ? <Moon className="h-4 w-4" /> : theme === "light" ? <Sun className="h-4 w-4" /> : <Laptop2 className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="h-4 w-4 mr-2" /> Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="h-4 w-4 mr-2" /> Escuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Laptop2 className="h-4 w-4 mr-2" /> Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Projeto */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Layers className="h-4 w-4 mr-1" />
              Projeto
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportWorldJSON}>
              <FileDown className="h-4 w-4 mr-2" /> Exportar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onImportClick}>
              <FileUp className="h-4 w-4 mr-2" /> Importar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Info className="h-4 w-4 mr-2" /> Sobre
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onImportFile} />
      </div>
    </div>
  );
};