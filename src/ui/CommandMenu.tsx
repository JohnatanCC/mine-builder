// UPDATE: src/ui/CommandMenu.tsx
import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { exportWorldJSON, handleImportFile } from "@/systems/world/serializer";
import { useWorld } from "@/state/world.store";
import { useThemeContext } from "@/ui/theme/ThemeProvider";
import { HOTKEYS, isHotkey, hasModifier } from "@/core/keys";

// Evitamos selectors que retornem objetos/tuplas.
// Seletores simples -> sem "getSnapshot should be cached" e sem loops.

export const CommandMenu: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  // tema
  const { setTheme } = useThemeContext();

  // selectors simples (referências estáveis)
  const undo = useWorld((s) => s.undo);
  const redo = useWorld((s) => s.redo);

  // abrir via Ctrl+K / ⌘K usando hotkeys centralizadas
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (hasModifier(e, 'CTRL') && isHotkey(e, HOTKEYS.COMMAND_MENU)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // input de arquivo para Import
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const onImportClick = React.useCallback(() => fileInputRef.current?.click(), []);
  const onImportFile = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) await handleImportFile(f);
    e.target.value = "";
  }, []);

  // ações
  const clearWorld = React.useCallback(() => {
    useWorld.setState({
      blocks: new Map(),
      past: [],
      future: [],
      currentStroke: null,
      effects: [],
    });
  }, []);

  // onSelect do CommandItem espera (value: string) => void
  const onSelectExport = React.useCallback((_: string) => {
    exportWorldJSON();
    setOpen(false);
  }, []);
  const onSelectImport = React.useCallback((_: string) => {
    onImportClick();
    setOpen(false);
  }, [onImportClick]);
  const onSelectClear = React.useCallback((_: string) => {
    clearWorld();
    setOpen(false);
  }, [clearWorld]);
  const onSelectUndo = React.useCallback((_: string) => {
    undo();
    setOpen(false);
  }, [undo]);
  const onSelectRedo = React.useCallback((_: string) => {
    redo();
    setOpen(false);
  }, [redo]);
  const onSelectThemeLight = React.useCallback((_: string) => {
    setTheme("light");
    setOpen(false);
  }, [setTheme]);
  const onSelectThemeDark = React.useCallback((_: string) => {
    setTheme("dark");
    setOpen(false);
  }, [setTheme]);
  const onSelectThemeSystem = React.useCallback((_: string) => {
    setTheme("system");
    setOpen(false);
  }, [setTheme]);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Comando…" />
        <CommandList>
          <CommandEmpty>Nada encontrado.</CommandEmpty>

          <CommandGroup heading="Projeto">
            <CommandItem value="export" onSelect={onSelectExport}>
              Exportar mundo (JSON)
            </CommandItem>
            <CommandItem value="import" onSelect={onSelectImport}>
              Importar mundo (JSON)
            </CommandItem>
            <CommandItem value="clear" onSelect={onSelectClear}>
              Limpar mundo
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Edição">
            <CommandItem value="undo" onSelect={onSelectUndo}>Desfazer</CommandItem>
            <CommandItem value="redo" onSelect={onSelectRedo}>Refazer</CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Tema">
            <CommandItem value="theme-light" onSelect={onSelectThemeLight}>Claro</CommandItem>
            <CommandItem value="theme-dark" onSelect={onSelectThemeDark}>Escuro</CommandItem>
            <CommandItem value="theme-system" onSelect={onSelectThemeSystem}>Sistema</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={onImportFile}
      />
    </>
  );
};
