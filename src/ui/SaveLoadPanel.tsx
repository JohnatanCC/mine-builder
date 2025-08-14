import { useRef, useState } from "react";
import { exportJSON, importJSON, saveToLocalStorage, loadFromLocalStorage, clearWorld } from "../systems/world/serializer";
import { useWorld } from "../state/world.store";
import { APP_VERSION } from "../core/version";

const SLOT_KEYS = ["slot1", "slot2", "slot3"] as const;

export function SaveLoadPanel() {
    const undo = useWorld(s => s.undo);
    const redo = useWorld(s => s.redo);
    const canUndo = useWorld(s => s.canUndo());
    const canRedo = useWorld(s => s.canRedo());

    const fileRef = useRef<HTMLInputElement>(null);
    const [status, setStatus] = useState<string>("");

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
            setTimeout(() => setStatus(""), 1500);
        } catch (e: any) {
            setStatus(e?.message || "Falha ao carregar");
            setTimeout(() => setStatus(""), 2000);
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
                setTimeout(() => setStatus(""), 2000);
                e.target.value = "";
            }
        };
        reader.readAsText(f);
    };

    return (
        <div
            style={{
                position: "absolute",
                left: 10,
                top: 58, // abaixo do VersionBadge
                zIndex: 10,
                pointerEvents: "auto",
                background: "rgba(21,21,21,0.80)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: 8,
                color: "#ddd",
                fontSize: 12,
                display: "grid",
                gap: 6,
            }}
        >
            <div style={{ display: "flex", gap: 6 }}>
                <button disabled={!canUndo} onClick={undo} title="Ctrl+Z"
                    style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid #555", background: "#222", color: canUndo ? "#eee" : "#777", cursor: canUndo ? "pointer" : "default" }}>
                    ↶ Undo
                </button>
                <button disabled={!canRedo} onClick={redo} title="Ctrl+Y"
                    style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid #555", background: "#222", color: canRedo ? "#eee" : "#777", cursor: canRedo ? "pointer" : "default" }}>
                    ↷ Redo
                </button>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button onClick={() => saveSlot(0)} style={btn}>Salvar 1</button>
                <button onClick={() => loadSlot(0)} style={btn}>Carregar 1</button>
                <button onClick={() => saveSlot(1)} style={btn}>Salvar 2</button>
                <button onClick={() => loadSlot(1)} style={btn}>Carregar 2</button>
                <button onClick={() => saveSlot(2)} style={btn}>Salvar 3</button>
                <button onClick={() => loadSlot(2)} style={btn}>Carregar 3</button>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
                <button onClick={onExport} style={btn}>Exportar JSON</button>
                <button onClick={onImportClick} style={btn}>Importar JSON</button>
                <button onClick={() => { clearWorld(); setStatus("Mundo limpo"); setTimeout(() => setStatus(""), 1500); }} style={btnWarn}>Limpar</button>
                <input ref={fileRef} type="file" accept="application/json" onChange={onImportFile} hidden />
            </div>

            {status && <div style={{ opacity: 0.85 }}>{status}</div>}
        </div>
    );
}

const btn: React.CSSProperties = {
    padding: "4px 8px",
    borderRadius: 8,
    border: "1px solid #555",
    background: "#222",
    color: "#eee",
    cursor: "pointer",
};
const btnWarn: React.CSSProperties = {
    ...btn, border: "1px solid #7b3f00", background: "#331e0a", color: "#f8dcb3"
};
