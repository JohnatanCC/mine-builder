import { useWorld } from "../state/world.store";

export function ControlsGuide() {
    const showHelp = useWorld((s) => s.showHelp);
    const setShowHelp = useWorld((s) => s.setShowHelp);

    if (!showHelp) return null;

    return (
        <div
            onClick={() => setShowHelp(false)}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                display: "grid",
                placeItems: "center",
                zIndex: 9998,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: 760,
                    maxWidth: "94vw",
                    maxHeight: "88vh",
                    overflow: "auto",
                    background: "#121212",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    boxShadow: "0 10px 42px rgba(0,0,0,0.45)",
                    color: "#ddd",
                    padding: 16,
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <h3 style={{ margin: 0, color: "#fff" }}>Guia de Controles</h3>
                    <button
                        onClick={() => setShowHelp(false)}
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#fff",
                            padding: "6px 10px",
                            borderRadius: 8,
                            cursor: "pointer",
                        }}
                    >
                        Fechar (Esc)
                    </button>
                </div>

                <div style={{ display: "grid", gap: 16 }}>
                    <section>
                        <h4 style={{ margin: "10px 0 6px 0", color: "#fff" }}>Mouse</h4>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            <li><strong>Esquerdo:</strong> coloca <em>1</em> bloco (no voxel adjacente ao bloco mirado).</li>
                            <li><strong>Direito:</strong> remove <em>1</em> bloco.</li>
                            <li><strong>Ctrl + Arrastar (Esquerdo):</strong> brush de construção (coloca vários, agrupado no Undo).</li>
                            <li><strong>Ctrl + Arrastar (Direito):</strong> brush de destruição (remove vários, agrupado no Undo).</li>
                            <li><strong>Botão do meio</strong> ou <strong>Alt+Clique</strong>: conta-gotas (seleciona o tipo do bloco mirado).</li>
                            <li><strong>Orbit</strong> (girar/zoom): padrão do mouse; <em>segurar Ctrl</em> <strong>trava a câmera</strong> para facilitar o brush.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 style={{ margin: "10px 0 6px 0", color: "#fff" }}>Teclado</h4>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            <li><strong>1..0:</strong> seleciona rapidamente o tipo de bloco.</li>
                            <li><strong>Ctrl/Cmd + Z:</strong> Undo (desfaz um stroke inteiro).</li>
                            <li><strong>Ctrl/Cmd + Shift + Z</strong> ou <strong>Ctrl/Cmd + Y:</strong> Redo.</li>
                            <li><strong>H</strong> ou <strong>?</strong> (Shift+/): abre/fecha este guia.</li>
                            <li><strong>Esc:</strong> fecha o guia.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 style={{ margin: "10px 0 6px 0", color: "#fff" }}>Interface</h4>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            <li><strong>Hotbar/HUD:</strong> seleção por clique; pode ser ocultada nas Configurações.</li>
                            <li><strong>Wireframe:</strong> OFF por padrão (mais leve). Quando ligado, usa uma versão mesclada (menos draw calls).</li>
                            <li><strong>Neblina (Fog):</strong> opção nas Configurações, com slider de intensidade.</li>
                            <li><strong>VersionBadge:</strong> mostra a versão atual; clique para abrir o changelog.</li>
                            <li><strong>Save/Load:</strong> snapshots no <code>localStorage</code>, além de export/import em JSON.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 style={{ margin: "10px 0 6px 0", color: "#fff" }}>Dicas</h4>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                            <li>O brush só acelera com <strong>Ctrl</strong> pressionado — sem Ctrl, um clique coloca/remove apenas um bloco.</li>
                            <li>Anti-clique acidental: clique rápido exige movimento pequeno e respeita um cooldown interno.</li>
                            <li>Undo/Redo respeita o agrupamento por <em>stroke</em> (arrastos contam como uma ação).</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
