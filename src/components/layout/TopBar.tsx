import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Settings, 
  Sun, 
  Moon, 
  Laptop, 
  Menu,
  FileDown,
  FileUp
} from "lucide-react";
import { useWorld } from "@/state/world.store";
import { useThemeContext } from "@/ui/theme/ThemeProvider";
import { useResponsive } from "@/hooks/useResponsive";
import { SettingsModal } from "@/components/modals";
import { exportWorldJSON, handleImportFile } from "@/systems/world/serializer";
import Logo from "@/assets/mb_logo.png";

export function TopBar() {
  const { isMobile } = useResponsive();
  const { theme, setTheme } = useThemeContext();
  const blockCount = useWorld(s => s.blocks.size);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const onImportClick = () => fileInputRef.current?.click();
  const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleImportFile(file);
    e.target.value = "";
  };

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Laptop;

  return (
    <header className="flex h-12 items-center justify-between px-4 bg-background">
      {/* Left: Logo & Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Mine Builder" className="h-6 w-6" />
          <span className="font-semibold text-sm">Mine Builder</span>
          <Badge variant="outline" className="text-xs font-mono">
            v0.4.0
          </Badge>
        </div>

        {!isMobile && (
          <Badge variant="secondary" className="text-xs">
            {blockCount} blocos
          </Badge>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Desktop Actions */}
        {!isMobile && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onImportClick}
              className="h-8 px-2"
            >
              <FileUp className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={exportWorldJSON}
              className="h-8 px-2"
            >
              <FileDown className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <ThemeIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4 mr-2" />
                  Claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4 mr-2" />
                  Escuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Laptop className="h-4 w-4 mr-2" />
                  Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        {/* Settings */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              {isMobile ? <Menu className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <SettingsModal />
          </DialogContent>
        </Dialog>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={onImportFile}
        className="hidden"
      />
    </header>
  );
}
