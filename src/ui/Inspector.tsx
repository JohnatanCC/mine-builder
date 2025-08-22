// UPDATE: src/ui/panels/RightInspector.tsx
import * as React from "react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useWorld } from "@/state/world.store";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { loadSlot, saveSlot, clearSlot, listSlots, saveAuto, loadAuto, applySnapshot } from "@/systems/localSaves";
import { Loader2, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
// ⬇️ imports para a seção de Áudio
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { TerrainPanel } from "./TerrainPanel";

/* ----------------- UI helpers ----------------- */
const Row: React.FC<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => (
  <div className="flex items-center justify-between gap-3 py-1">
    <Label className="text-[11px] text-muted-foreground">{label}</Label>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

const Value: React.FC<{ v: number }> = ({ v }) => (
  <span className="w-10 text-right tabular-nums text-[11px] text-muted-foreground">
    {v.toFixed(2)}
  </span>
);

function fmt(ts?: number) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ----------------- Inspector ----------------- */
export const Inspector: React.FC = () => {
  // Luz
  const lightSpeed = useWorld((s) => s.lightSpeed);
  const setLightSpeed = useWorld((s) => s.setLightSpeed);
  const lightIntensity = useWorld((s) => s.lightIntensity);
  const setLightIntensity = useWorld((s) => s.setLightIntensity);

  // Áudio (estado global)
  const audioEnabled = useWorld((s) => s.audioEnabled);
  const setAudioEnabled = useWorld((s) => s.setAudioEnabled);
  const audioVolume = useWorld((s) => s.audioVolume);
  const setAudioVolume = useWorld((s) => s.setAudioVolume);
  const tracks = useWorld((s) => s.audioTracks);
  const currentTrack = useWorld((s) => s.currentTrack);
  const setCurrentTrack = useWorld((s) => s.setCurrentTrack);

  const hasTracks = (tracks?.length ?? 0) > 0;

  // Sliders (UI local)
  const [ls, setLS] = React.useState(lightSpeed);
  const [li, setLI] = React.useState(lightIntensity);
  const [vol, setVol] = React.useState(audioVolume);
  React.useEffect(() => setLS(lightSpeed), [lightSpeed]);
  React.useEffect(() => setLI(lightIntensity), [lightIntensity]);
  React.useEffect(() => setVol(audioVolume), [audioVolume]);

  // Limpar mundo
  const onClearWorld = () => {
    useWorld.setState({
      blocks: new Map(),
      past: [],
      future: [],
      currentStroke: null,
      effects: [],
    });
  };

  // Slots + Auto-save
  const [slots, setSlots] = React.useState(() => listSlots());
  const [saving, setSaving] = React.useState(false);
  const [autoMeta, setAutoMeta] = React.useState(() => loadAuto());
  const [lastSavedSlot, setLastSavedSlot] = React.useState<number | null>(null);
  const refreshSlots = React.useCallback(() => setSlots(listSlots()), []);

  const saveToSlot = React.useCallback(
    (n: number) => {
      const snap = useWorld.getState().getSnapshot();
      saveSlot(n, snap, "0.2.x");
      setLastSavedSlot(n);
      refreshSlots();
      toast(`Slot ${n} salvo — ${fmt(Date.now())}`);
    },
    [refreshSlots]
  );

  const loadFromSlot = React.useCallback((n: number) => {
    const data = loadSlot(n);
    if (!data) {
      toast(`❌ Slot ${n} está vazio`);
      return;
    }
    applySnapshot(data.snapshot);
    toast(`✅ Slot ${n} carregado — Último: ${fmt(data.updatedAt)}`);
  }, []);

  const clearSlotUI = React.useCallback(
    (n: number) => {
      clearSlot(n);
      refreshSlots();
      toast(`🗑️ Slot ${n} limpo`);
    },
    [refreshSlots]
  );

  // Auto-save a cada 60s
  React.useEffect(() => {
    const id = setInterval(() => {
      setSaving(true);
      const snap = useWorld.getState().getSnapshot();
      const meta = saveAuto(snap, "0.2.x");
      setAutoMeta(meta);
      const tid = setTimeout(() => setSaving(false), 600);
      return () => clearTimeout(tid);
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const restoreAuto = React.useCallback(() => {
    const auto = loadAuto();
    if (!auto) {
      toast("Nenhum auto‑save encontrado.");
      return;
    }
    applySnapshot(auto.snapshot);
    toast(`♻️ Auto‑save restaurado — ${fmt(auto.updatedAt)}`);
  }, []);

  // Slot row
  const SlotRow: React.FC<{ n: number; ts?: number }> = ({ n, ts }) => (
    <div className="flex items-center justify-between rounded-md border bg-card/50 px-2.5 py-2">
      <div className="min-w-0">
        <div className="text-xs font-medium leading-none">Slot {n}</div>
        <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {ts ? `Último: ${fmt(ts)}` : "Vazio"}
        </div>
      </div>
      <div className="ml-2 flex items-center gap-1">
        <Button size="sm" variant="secondary" className="h-7" onClick={() => loadFromSlot(n)}>
          Carregar
        </Button>
        <Button size="sm" className="h-7" onClick={() => saveToSlot(n)}>
          Salvar
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => clearSlotUI(n)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Apagar slot</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );

  // Auto row
  const AutoRow: React.FC = () => (
    <div className="flex items-center justify-between rounded-md border bg-muted/40 px-2.5 py-2">
      <div className="min-w-0">
        <div className="text-xs font-medium leading-none">Auto (restauração)</div>
        <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
          {autoMeta ? `Último: ${fmt(autoMeta.updatedAt)}` : "ainda não realizado"}
        </div>
      </div>
      <div className="ml-2 flex items-center gap-1">
        <Button size="sm" variant="secondary" className="h-7" onClick={restoreAuto}>
          <RotateCcw className="mr-1 h-4 w-4" /> Carregar
        </Button>
        {saving ? (
          <span className="inline-flex items-center gap-1 rounded bg-card px-2 py-1 text-[11px]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Salvando…
          </span>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="h-full w-full">
      {/* Header do painel */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card/80 px-3 py-2 text-sm font-semibold backdrop-blur">
        <span>Inspector</span>
      </div>

      {/* Conteúdo */}
      <div className="p-2">
        <Accordion
          type="multiple"
          defaultValue={["light", "audio", "slots"]}
          className="w-full"
        >
          {/* Luz / Sombras */}
          <AccordionItem value="light">
            <AccordionTrigger>Luz / Sombras</AccordionTrigger>
            <AccordionContent className="pt-0">
              <Row label="Velocidade">
                <Slider
                  value={[ls]}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-40"
                  onValueChange={([v]) => setLS(v)}
                  onValueCommit={([v]) => setLightSpeed(v)}
                />
                <Value v={ls} />
              </Row>
              <Row label="Intensidade">
                <Slider
                  value={[li]}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-40"
                  onValueChange={([v]) => setLI(v)}
                  onValueCommit={([v]) => setLightIntensity(v)}
                />
                <Value v={li} />
              </Row>
            </AccordionContent>
          </AccordionItem>

          {/* Áudio */}
          <AccordionItem value="audio">
            <AccordionTrigger>Áudio</AccordionTrigger>
            <AccordionContent className="pt-0">
              <Row label="Música ambiente">
                <Switch checked={audioEnabled} onCheckedChange={setAudioEnabled} />
                <span className="text-[11px] text-muted-foreground w-8 text-right">
                  {audioEnabled ? "ON" : "OFF"}
                </span>
              </Row>

              <Row label="Trilha">
                <Select
                  value={currentTrack || ""}
                  onValueChange={(v) => setCurrentTrack(v)}
                >
                  <SelectTrigger className="w-44 h-7">
                    <SelectValue placeholder="(nenhuma)" />
                  </SelectTrigger>
                  <SelectContent>
                    {hasTracks
                      ? tracks.map((id: string) => (
                        <SelectItem key={id} value={id}>{id}</SelectItem>
                      ))
                      : <SelectItem value="">(nenhuma encontrada)</SelectItem>}
                  </SelectContent>
                </Select>
              </Row>

              <Row label="Volume">
                <Slider
                  value={[vol]}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-40"
                  disabled={!audioEnabled || !hasTracks}
                  onValueChange={([v]) => setVol(v)}
                  onValueCommit={([v]) => setAudioVolume(v)}
                />
                <span className="w-10 text-right tabular-nums text-[11px] text-muted-foreground">
                  {(vol * 100) | 0}%
                </span>
              </Row>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="terrain">
            <AccordionTrigger>Terreno</AccordionTrigger>
            <AccordionContent className="pt-0">
              <TerrainPanel />
            </AccordionContent>
          </AccordionItem>

          {/* Mundo / Slots */}
          <AccordionItem value="slots">
            <AccordionTrigger>Mundo / Slots</AccordionTrigger>
            <AccordionContent className="pt-1">
              <div className="flex flex-col gap-2">
                <AutoRow />
                {slots.map(({ slot, meta }) => (
                  <SlotRow key={slot} n={slot} ts={meta?.updatedAt} />
                ))}
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="mt-3 w-full">
                    Limpar mundo
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Limpar mundo?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação remove todos os blocos e zera o histórico. Não é possível desfazer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onClearWorld}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Limpar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
