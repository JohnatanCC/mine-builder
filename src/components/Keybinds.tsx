// UPDATE: src/components/Keybinds.tsx
import * as React from "react";
import { useWorld } from "@/state/world.store";
import { HOTKEYS, isHotkey, hasModifier } from "@/core/keys";

/** Liga atalhos globais:
 * - Ctrl (ou Cmd) mantém isCtrlDown=true enquanto pressionado  → pincel temporário
 * - Ctrl+Z → undo | Shift+Ctrl+Z → redo | Ctrl+Y → redo
 */
export const Keybinds: React.FC = () => {
    const setCtrlDown = useWorld((s) => s.setCtrlDown);
    const undo = useWorld((s) => s.undo);
    const redo = useWorld((s) => s.redo);
    const canUndo = useWorld((s) => s.canUndo());
    const canRedo = useWorld((s) => s.canRedo());

    React.useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            // Atualiza estado do Ctrl/Cmd
            if (hasModifier(e, 'CTRL')) setCtrlDown(true);

            // Undo / Redo com hotkeys centralizadas
            if (hasModifier(e, 'CTRL')) {
                // Ctrl+Z (ou Shift+Ctrl+Z para redo)
                if (isHotkey(e, HOTKEYS.UNDO)) {
                    e.preventDefault();
                    if (e.shiftKey && canRedo) {
                        redo();
                    } else if (canUndo) {
                        undo();
                    }
                }
                // Ctrl+Y (redo alternativo)
                if (isHotkey(e, HOTKEYS.REDO)) {
                    e.preventDefault();
                    if (canRedo) redo();
                }
            }
        };
        
        const onKeyUp = (e: KeyboardEvent) => {
            // Remove estado do Ctrl/Cmd quando solto
            if (!e.ctrlKey && !e.metaKey) setCtrlDown(false);
        };
        
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, [setCtrlDown, undo, redo, canUndo, canRedo]);

    return null;
};
