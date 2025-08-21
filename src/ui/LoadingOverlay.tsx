// NEW FILE: src/ui/LoadingOverlay.tsx
import * as React from "react";
import { useLoading } from "@/state/loading.store";
export function LoadingOverlay({ minShowMs = 500 }: { minShowMs?: number }) {
    const pending = useLoading((s) => s.pending);
    const [visible, setVisible] = React.useState(false);
    const hideAtRef = React.useRef<number>(0);

    React.useEffect(() => {
        if (pending > 0) {
            // começou a carregar
            hideAtRef.current = 0;
            setVisible(true);
        } else {
            // terminou: aguarda um pouquinho para não piscar
            hideAtRef.current = performance.now() + minShowMs;
            const id = setTimeout(() => {
                if (performance.now() >= hideAtRef.current) setVisible(false);
            }, minShowMs);
            return () => clearTimeout(id);
        }
    }, [pending, minShowMs]);

    if (!visible) return null;

    // estilos inline para simplicidade
    const shell: React.CSSProperties = {
        position: "fixed",
        inset: 0,
        background:
            "linear-gradient(180deg, rgba(12,12,12,0.95) 0%, rgba(8,8,8,0.95) 100%), repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 6px, rgba(0,0,0,0.03) 6px 12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        pointerEvents: "none",
    };

    const card: React.CSSProperties = {
        pointerEvents: "auto",
        padding: "18px 22px",
        borderRadius: 14,
        border: "2px solid #2b2b2b",
        background: "linear-gradient(180deg, #1b1b1b 0%, #111 100%)",
        boxShadow: "0 10px 32px rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        gap: 14,
    };

    const spinner: React.CSSProperties = {
        width: 34,
        height: 34,
        borderRadius: "50%",
        border: "4px solid rgba(255,255,255,0.15)",
        borderTopColor: "#6ee784",
        animation: "mb_spin 0.9s linear infinite",
        boxShadow: "0 0 12px rgba(110,231,132,0.35)",
    };

    const title: React.CSSProperties = {
        color: "#e6ffe6",
        fontWeight: 700,
        fontSize: 16,
        textShadow: "0 0 8px rgba(110,231,132,0.35)",
        fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'",
        letterSpacing: 0.2,
    };

    const subtitle: React.CSSProperties = {
        color: "#c8c8c8",
        fontSize: 13,
        opacity: 0.9,
        marginTop: 2,
        fontFamily: "monospace",
    };

    return (
        <div style={shell}>
            <style>{`
        @keyframes mb_spin { to { transform: rotate(360deg); } }
        @keyframes mb_blink { 0%, 80%, 100% { opacity: 0.15 } 40% { opacity: 1 } }
      `}</style>

            <div style={card}>
                <div style={spinner} />
                <div>
                    <div style={title}>Carregando pacotes…</div>
                    <div style={subtitle}>
                        Texturas/PNG ({pending}){" "}
                        <span style={{ animation: "mb_blink 1.4s infinite" }}>.</span>
                        <span style={{ animation: "mb_blink 1.4s 0.2s infinite" }}>.</span>
                        <span style={{ animation: "mb_blink 1.4s 0.4s infinite" }}>.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
