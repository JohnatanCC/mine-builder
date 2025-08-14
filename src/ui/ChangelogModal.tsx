
type Props = {
  version: string;            // ex: "0.1.0"
  isOpen: boolean;
  onClose: () => void;
};

export function ChangelogModal({ version, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 640,
          maxWidth: "92vw",
          maxHeight: "86vh",
          overflow: "auto",
          background: "#121212",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12,
          boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
          color: "#ddd",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            background: "#121212",
            zIndex: 1,
          }}
        >
          <div style={{ fontWeight: 700 }}>
            Mine Builder — Changelog <span style={{ opacity: 0.8 }}>(v{version})</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Fechar
          </button>
        </div>

        <div style={{ padding: 16, display: "grid", gap: 18, fontSize: 14, lineHeight: 1.45 }}>
          <section>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 16, color: "#fff" }}>
              v0.1.0 — Beta (2025-08-14)
            </h3>

            <h4 style={{ margin: "12px 0 6px 0", color: "#fff" }}>UX</h4>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li><strong>VersionBadge</strong> com modal de changelog; lembra última versão vista em <code>localStorage</code>.</li>
              <li><strong>Ghost/Preview</strong> do bloco alvo (não intercepta raycast).</li>
              <li><strong>Hotbar/HUD</strong> no rodapé (pode ocultar nas Configurações).</li>
              <li><strong>Guia de Controles</strong> (H / ?), alinhado aos novos comandos.</li>
            </ul>

            <h4 style={{ margin: "12px 0 6px 0", color: "#fff" }}>Recursos</h4>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li><strong>Conta-gotas</strong>: clique do meio ou Alt+Clique seleciona o tipo do bloco mirado.</li>
              <li>
                <strong>Brush com arrasto</strong>: segure <kbd>Ctrl</kbd> para construir (botão esquerdo) ou destruir
                (botão direito) rapidamente. Sem Ctrl, clique simples coloca/remove apenas 1 bloco.
              </li>
              <li><strong>Undo/Redo</strong> por “stroke” — Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z ou Ctrl/Cmd+Y.</li>
              <li><strong>Salvar/Carregar/Exportar/Importar</strong> snapshots (serializer em JSON).</li>
            </ul>

            <h4 style={{ margin: "12px 0 6px 0", color: "#fff" }}>Arquitetura & Performance</h4>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li><strong>Block Registry</strong>: centraliza tipos/labels/materiais/preview.</li>
              <li><strong>Zustand em slices</strong> + selectors (renders mais leves).</li>
              <li><strong>Wireframe OFF</strong> por padrão + versão mesclada quando ligado (menos draw calls).</li>
              <li><strong>Neblina (Fog)</strong> opcional com slider de intensidade.</li>
              <li>Proteção anti-clique acidental (cooldown + limiar de arrasto).</li>
              <li>Histórico com limite interno para evitar crescimento infinito.</li>
            </ul>
          </section>

          <section>
            <h4 style={{ margin: "12px 0 6px 0", color: "#fff" }}>Dicas rápidas</h4>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Segurar <kbd>Ctrl</kbd> também <em>trava a câmera</em> (Orbit desabilita) para facilitar o brush.</li>
              <li>Numbers <kbd>1..0</kbd> mudam o bloco ativo.</li>
              <li>Use o painel de Save/Load para snaphots rápidos do mundo.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
