// UPDATE: src/ui/TopBar.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileDown, FileUp, Layers, Info, ChevronDown, Sun, Moon, Laptop2 } from "lucide-react";
import { exportWorldJSON, handleImportFile } from "../systems/world/serializer";
import { useThemeContext } from "@/ui/theme/ThemeProvider";
import { useWorld } from "@/state/world.store";
import { Badge } from "@/components/ui/badge";
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
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <img src={Logo} alt="Logo" className="inline w-6 mr-2" />
          <span className="font-semibold tracking-wide ">
          Mine‑Builder
          </span>
          </div>
        <span className="rounded-sm bg-muted px-1.5 py-0.5  leading-none text-muted-foreground">v0.4.0</span>
        <Badge variant="secondary" className="ml-2 rounded-sm">Blocos: {blockCount}</Badge>
      </div>

      <div className="flex items-center gap-2">
        {/* Tema */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="gap-1">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : theme === "light" ? <Sun className="h-4 w-4" /> : <Laptop2 className="h-4 w-4" />}
              Tema
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2"><Sun className="h-4 w-4" /> Claro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2"><Moon className="h-4 w-4" /> Escuro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2"><Laptop2 className="h-4 w-4" /> Sistema</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Projeto */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary" className="gap-1">
              <Layers className="h-4 w-4" />
              Projeto
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Projeto</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={exportWorldJSON} className="gap-2">
              <FileDown className="h-4 w-4" /> Exportar mundo (JSON)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onImportClick} className="gap-2">
              <FileUp className="h-4 w-4" /> Importar mundo (JSON)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <Info className="h-4 w-4" /> Sobre
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onImportFile} />
      </div>
    </div>
  );
};