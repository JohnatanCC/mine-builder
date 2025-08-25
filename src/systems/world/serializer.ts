// UPDATE: src/systems/serializer.ts
import { useWorld } from "@/state/world.store";
import { toast } from "sonner";
import type { WorldSnapshot } from "@/core/types";

// Versão atual da aplicação - atualizar a cada release
const CURRENT_VERSION = "0.4.0";

type ImportResult =
  | { ok: true; version: string }
  | { ok: false; code: "NOVERSION" | "INCOMPATIBLE" | "NOWORLD" | "PARSE"; detail?: string };

type WorldSaveData = {
  version: string;
  timestamp: number;
  world: WorldSnapshot;
  metadata?: {
    appVersion: string;
    userAgent?: string;
    platform?: string;
  };
};

function parseVersion(v: string) {
  const [major, minor, patch] = v.split(".").map((n) => parseInt(n, 10) || 0);
  return { major, minor, patch };
}

function isVersionCompatible(fileVersion: string): boolean {
  const app = parseVersion(CURRENT_VERSION);
  const file = parseVersion(fileVersion);
  // Aceita versões da mesma major.minor (ex: 0.4.x)
  return file.major === app.major && file.minor === app.minor;
}

/** Captura o snapshot atual do mundo via store */
export function exportWorldJSON() {
  const snapshot = useWorld.getState().getSnapshot();
  const data: WorldSaveData = {
    version: CURRENT_VERSION,
    timestamp: Date.now(),
    world: snapshot,
    metadata: {
      appVersion: CURRENT_VERSION,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    },
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mine-builder-world-${CURRENT_VERSION}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast("Exportado: Mundo exportado em JSON.");
}

/** Lê o arquivo, valida versão e aplica no estado */
export async function importWorldJSON(file: File): Promise<ImportResult> {
  try {
    const text = await file.text();
    const json = JSON.parse(text);

    if (!json?.version) return { ok: false, code: "NOVERSION" };
    if (!isVersionCompatible(json.version)) return { ok: false, code: "INCOMPATIBLE" };
    if (!json?.world) return { ok: false, code: "NOWORLD" };

    // aplica no estado do jogo
    useWorld.getState().loadSnapshot(json.world);

    return { ok: true, version: json.version };
  } catch (e: any) {
    console.error("[importWorldJSON] parse/apply error:", e);
    return { ok: false, code: "PARSE", detail: String(e?.message || e) };
  }
}

/** Helper para UI: executa import e mostra toasts */
export async function handleImportFile(file: File) {
  const res = await importWorldJSON(file);
  if (res.ok) {
    toast(`Mundo importado: Compatível com ${res.version}.`);
  } else {
    const messages = {
      NOVERSION: "Arquivo inválido: faltam metadados de versão.",
      INCOMPATIBLE: `Versão incompatível: aceite apenas ${CURRENT_VERSION.split(".").slice(0, 2).join(".")}.x`,
      NOWORLD: "Arquivo inválido: não contém dados de mundo.",
      PARSE: "Erro ao ler o JSON.",
    } as const;
    toast(
      `Falha ao importar: ${messages[res.code]}${res.detail ? ` (${res.detail})` : ""}`
    );
  }
}
