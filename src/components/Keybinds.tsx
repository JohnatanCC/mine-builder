// NEW FILE: src/components/Keybinds.tsx
import * as React from "react";
import { useWorld } from "@/state/world.store";

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
            if (e.ctrlKey || e.metaKey) setCtrlDown(true);

            // Undo / Redo
            if (e.ctrlKey || e.metaKey) {
                // Ctrl+Z
                if (e.key.toLowerCase() === "z") {
                    e.preventDefault();
                    if (e.shiftKey) {
                        if (canRedo) redo();
                    } else {
                        if (canUndo) undo();
                    }
                }
                // Ctrl+Y
                if (e.key.toLowerCase() === "y") {
                    e.preventDefault();
                    if (canRedo) redo();
                }
            }
        };
        const onKeyUp = (e: KeyboardEvent) => {
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
