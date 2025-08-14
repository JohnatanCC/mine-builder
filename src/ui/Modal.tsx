import { useEffect, type ReactNode } from "react";

export function Modal({
  open,
  onClose,
  children,
  width = 560,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number;
  title?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width,
          maxWidth: "90vw",
          background: "rgba(25,25,25,0.95)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12,
          padding: 16,
          color: "#eee",
          boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 style={{ margin: "0 0 10px 0" }}>{title}</h2>}
        {children}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button
            onClick={onClose}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #555",
              background: "#222",
              color: "#ddd",
              cursor: "pointer",
            }}
          >
            Fechar (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
