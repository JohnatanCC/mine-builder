import { useWorld } from "../state/world.store";

export function HUDStatus() {
    const mode = useWorld(s => s.mode);
    const current = useWorld(s => s.current);
    const isStroke = useWorld(s => !!s.currentStroke);

    return (
        <div style={{
            position: "absolute",
            right: 10, top: 44, // um pouco acima do FPS (que fica bottom:10)
            background: "rgba(0,0,0,0.55)",
            color: "#eee",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            padding: "6px 8px",
            fontSize: 12,
            zIndex: 9,
            pointerEvents: "none"
        }}>
            <span style={{ opacity: 0.9 }}>Modo:</span> <strong>{mode === "place" ? "Place" : "Delete"}</strong>
            {" · "}
            <span style={{ opacity: 0.9 }}>Bloco:</span> <strong>{current}</strong>
            {" · "}
            <span style={{ opacity: 0.9 }}>Stroke:</span>{" "}
            <strong style={{ color: isStroke ? "#0f0" : "#aaa" }}>
                {isStroke ? "Ativo" : "—"}
            </strong>
        </div>
    );
}
