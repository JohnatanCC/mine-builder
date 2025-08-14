// src/ui/SaveLoadPanel.tsx
import * as React from "react";
import { useRef, useState, useEffect } from "react";
import {
    exportJSON,
    importJSON,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearWorld,
} from "../systems/world/serializer";
import { useWorld } from "../state/world.store";
import { APP_VERSION } from "../core/version";
import { Section } from "./Section";

const SLOT_KEYS = ["slot1", "slot2", "slot3"] as const;

const colors = {
    panel: "#1a1a1a",
    panelAlt: "#141414",
    border: "#2b2b2b",
    text: "#e8e8e8",
    dim: "#cfcfcf",
    accent: "#3aa655",
    danger: "#b85c1e",
};

const wrap: React.CSSProperties = {
    position: "absolute",
    right: 300, // posicione onde preferir; combine com SettingsPanel
    top: 120,
    zIndex: 10,
    pointerEvents: "auto",
    color: colors.text,
    fontSize: 12,
    imageRendering: "pixelated" as any,
    background: `
    linear-gradient(180deg, ${colors.panel} 0%, ${colors.panelAlt} 100%),
    repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 6px, rgba(0,0,0,0.03) 6px 12px)
  `,
    borderRadius: 10,
    border: `2px solid ${colors.border}`,
    padding: 10,
    width: 300,
};

const headerRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingBottom: 6,
    borderBottom: `1px solid ${colors.border}`,
    marginBottom: 8,
};

const titleStyle: React.CSSProperties = {
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: "uppercase",
};

const toggleBtn: React.CSSProperties = {
    padding: "4px 8px",
    borderRadius: 8,
    border: `1px solid ${colors.border}`,
    background: "linear-gradient(180deg, #1f1f1f 0%, #151515 100%)",
    color: colors.text,
    cursor: "pointer",
};

const row: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
};

const oneColRow: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 8,
};

const btn = (enabled = true): React.CSSProperties => ({
    padding: "6px 10px",
    borderRadius: 8,
    border: `1px solid ${enabled ? colors.border : "#3a3a3a"}`,
    background: enabled
        ? "linear-gradient(180deg, #1f1f1f 0%, #151515 100%)"
        : "linear-gradient(180deg, #202020 0%, #1a1a1a 100%)",
    color: enabled ? colors.text : "#888",
    cursor: enabled ? "pointer" : "default",
    textTransform: "uppercase",
    fontWeight: 800,
    letterSpacing: 0.4,
});

const btnAccent: React.CSSProperties = {
    ...btn(true),
    borderColor: "#2a7a3f",
    background: `linear-gradient(180deg, ${colors.accent} 0%, #2a7a3f 100%)`,
    color: "#0b1f0f",
};

const btnDanger: React.CSSProperties = {
    ...btn(true),
    borderColor: "#6c3a12",
    background: "linear-gradient(180deg, #40220d 0%, #2a1608 100%)",
    color: "#f8dcb3",
};

const statusText: React.CSSProperties = {
    marginTop: 4,
    fontFamily: "monospace",
    color: colors.dim,
    opacity: 0.9,
};

const LS_KEY = "ui.saveLoadPanel.open";

export function SaveLoadPanel() {
    const undo = useWorld((s) => s.undo);
    const redo = useWorld((s) => s.redo);
    const canUndo = useWorld((s) => s.canUndo());
    const canRedo = useWorld((s) => s.canRedo());

    const fileRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<string>("");

    // minimizar/expandir com persistência
    const [open, setOpen] = useState<boolean>(() => {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? raw === "1" : false; // começa recolhido por padrão
    });
    useEffect(() => {
        localStorage.setItem(LS_KEY, open ? "1" : "0");
    }, [open]);

    const saveSlot = (i: number) => {
        const key = `world_${SLOT_KEYS[i]}`;
        saveToLocalStorage(key);
        setStatus(`Salvo em ${SLOT_KEYS[i]}`);
        setTimeout(() => setStatus(""), 1500);
    };
    const loadSlot = (i: number) => {
        const key = `world_${SLOT_KEYS[i]}`;
        try {
            loadFromLocalStorage(key);
            setStatus(`Carregado ${SLOT_KEYS[i]}`);
        } catch (e: any) {
            setStatus(e?.message || "Falha ao carregar");
        } finally {
            setTimeout(() => setStatus(""), 1800);
        }
    };

    const onExport = () => {
        const json = exportJSON(2);
        const blob = new Blob([json], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `world-v${APP_VERSION}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const onImportClick = () => fileRef.current?.click();
    const onImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                importJSON(String(reader.result));
                setStatus("Importado com sucesso");
            } catch (err: any) {
                setStatus(err?.message || "JSON inválido");
            } finally {
                setTimeout(() => setStatus(""), 1800);
                e.target.value = "";
            }
        };
        reader.readAsText(f);
    };

    return (
        <div style={wrap}>
            {/* Cabeçalho com toggle */}
            <div style={headerRow}>
                <div style={titleStyle}>Salvar / Carregar</div>
                <button style={toggleBtn} onClick={() => setOpen((v) => !v)}>
                    {open ? "MINIMIZAR" : "EXPANDIR"}
                </button>
            </div>

            {!open ? (
                // Estado recolhido: mini resumo + ações rápidas
                <div style={oneColRow}>
                    <div style={{ color: colors.dim }}>
                        Use <b>Undo/Redo</b>, salve em slots ou exporte JSON. Clique em
                        <b> “EXPANDIR”</b> para ver todas as opções.
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button style={btn(canUndo)} disabled={!canUndo} onClick={undo} title="Ctrl+Z">
                            ↶ Undo
                        </button>
                        <button style={btn(canRedo)} disabled={!canRedo} onClick={redo} title="Ctrl+Y">
                            ↷ Redo
                        </button>
                        <button onClick={onExport} style={btnAccent}>
                            Exportar
                        </button>
                    </div>
                    {status && <div style={statusText}>{status}</div>}
                </div>
            ) : (
                // Estado expandido: seções empilhadas como o SettingsPanel
                <>
                    <Section title="Histórico">
                        <div style={{ display: "flex", gap: 8 }}>
                            <button style={btn(canUndo)} disabled={!canUndo} onClick={undo} title="Ctrl+Z">
                                ↶ Undo
                            </button>
                            <button style={btn(canRedo)} disabled={!canRedo} onClick={redo} title="Ctrl+Y">
                                ↷ Redo
                            </button>
                        </div>
                    </Section>

                    <Section title="Slots (rápido)">
                        <div style={{ ...row }}>
                            <button onClick={() => saveSlot(0)} style={btn(true)}>Salvar 1</button>
                            <button onClick={() => loadSlot(0)} style={btn(true)}>Carregar 1</button>
                            <button onClick={() => saveSlot(1)} style={btn(true)}>Salvar 2</button>
                            <button onClick={() => loadSlot(1)} style={btn(true)}>Carregar 2</button>
                            <button onClick={() => saveSlot(2)} style={btn(true)}>Salvar 3</button>
                            <button onClick={() => loadSlot(2)} style={btn(true)}>Carregar 3</button>
                        </div>
                    </Section>

                    <Section title="Importar / Exportar">
                        <div style={{ ...row }}>
                            <button onClick={onExport} style={btnAccent}>Exportar JSON</button>
                            <button onClick={onImportClick} style={btn(true)}>Importar JSON</button>
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="application/json"
                            onChange={onImportFile}
                            hidden
                        />
                    </Section>

                    <Section title="Zona de Risco">
                        <div style={{ ...oneColRow }}>
                            <button
                                onClick={() => {
                                    clearWorld();
                                    setStatus("Mundo limpo");
                                    setTimeout(() => setStatus(""), 1500);
                                }}
                                style={btnDanger}
                            >
                                Limpar Mundo
                            </button>
                        </div>
                    </Section>

                    {status && <div style={statusText}>{status}</div>}
                </>
            )}
        </div>
    );
}
