import { useEffect, useState } from "react";
import { APP_VERSION } from "../core/version";
import { ChangelogModal } from "./ChangelogModal";

const STORAGE_KEY = "seen-version";

export function VersionBadge() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen !== APP_VERSION) {
      // primeira vez nesta versão → abre e marca como vista
      setOpen(true);
      localStorage.setItem(STORAGE_KEY, APP_VERSION);
    }
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={`Versão ${APP_VERSION} — clique para ver novidades`}
        style={{
          position: "absolute",
          left: 10,
          top: 36, // logo abaixo do FPS
          zIndex: 10,
          padding: "4px 8px",
          borderRadius: 8,
          border: "1px solid #4b5563",
          background: "rgba(21,21,21,0.8)",
          color: "#a7f3d0",
          fontFamily: "monospace",
          fontSize: 12,
          cursor: "pointer",
          pointerEvents: "auto",
        }}
      >
        v{APP_VERSION}
      </button>
      <ChangelogModal
        version="0.1.0"
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
