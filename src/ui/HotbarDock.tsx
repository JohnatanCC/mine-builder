// UPDATE: src/ui/HotbarDock.tsx
import * as React from "react";
import { useWorld } from "@/state/world.store";
import { getLabel } from "@/core/blocks/registry";
import { BlockIcon } from "@/ui/BlockIcon";
import { UI_HOTBAR_GAP, UI_HOTBAR_SLOT_SIZE } from "@/core/constants";
import { cn } from "@/lib/utils"; // se tiver seu util de classnames; senão remova e use template-strings

export const HotbarDock: React.FC = () => {
    const current = useWorld((s) => s.current);
    const setCurrent = useWorld((s) => s.setCurrent);
    const quickbar = useWorld((s) => s.quickbar); // ✅ agora existe no store

    // atalhos 1..0
    React.useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.repeat) return;
            const map: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5, "7": 6, "8": 7, "9": 8, "0": 9 };
            const idx = map[e.key];
            if (idx == null) return;
            const type = quickbar[idx];
            if (!type) return;
            e.preventDefault();
            setCurrent(type);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [quickbar, setCurrent]);

    return (
        <div
            className="mx-auto flex items-center justify-center"
            style={{
                // usa UI_HOTBAR_GAP de verdade (evita warning "never read")
                gap: UI_HOTBAR_GAP,
                height: UI_HOTBAR_SLOT_SIZE + 10,
            }}
        >
            {quickbar.map((type, i) => {
                const selected = current === type;
                return (
                    <button
                        key={`${type}-${i}`}
                        onClick={() => setCurrent(type)}
                        title={`${getLabel(type)} — tecla ${i === 9 ? 0 : i + 1}`}
                        className={cn(
                            "relative rounded-xl border transition-colors",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/60",
                            selected
                                ? "border-lime-400 bg-gradient-to-b from-lime-400/15 to-transparent"
                                : "border-border/60 bg-gradient-to-b from-muted/40 to-background hover:border-border"
                        )}
                        style={{
                            width: UI_HOTBAR_SLOT_SIZE,
                            height: UI_HOTBAR_SLOT_SIZE,
                        }}
                    >
                        <BlockIcon type={type} size={UI_HOTBAR_SLOT_SIZE - 6} />
                        <span
                            className="absolute right-1.5 top-1 rounded-sm bg-black/85 px-1.5 py-0.5 text-[11px] font-mono leading-none text-neutral-100"
                            aria-hidden
                        >
                            {i === 9 ? 0 : i + 1}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
