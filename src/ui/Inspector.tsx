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
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

/* ----------------- UI helpers ----------------- */
const Row: React.FC<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => (
  <div className="flex items-center justify-between py-1.5">
    <Label className="text-sm">{label}</Label>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

function fmt(ts?: number) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ----------------- Inspector ----------------- */
export const Inspector: React.FC = () => {

  // Áudio (estado global)
  const audioEnabled = useWorld((s) => s.audioEnabled);
  const setAudioEnabled = useWorld((s) => s.setAudioEnabled);
  const audioVolume = useWorld((s) => s.audioVolume);
  const setAudioVolume = useWorld((s) => s.setAudioVolume);
  const tracks = useWorld((s) => s.audioTracks);
  const currentTrack = useWorld((s) => s.currentTrack);
  const setCurrentTrack = useWorld((s) => s.setCurrentTrack);

  const hasTracks = (tracks?.length ?? 0) > 0;
  const [vol, setVol] = React.useState(audioVolume);
  React.useEffect(() => setVol(audioVolume), [audioVolume]);

  const renderPreset = useWorld(s => s.renderPreset);
  const setRenderPreset = useWorld(s => s.setRenderPreset);

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

  const refreshSlots = React.useCallback(() => setSlots(listSlots()), []);

  const saveToSlot = React.useCallback(
    (n: number) => {
      const snap = useWorld.getState().getSnapshot();
      saveSlot(n, snap, "0.2.x");
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

  // Slot row simplificado
  const SlotRow: React.FC<{ n: number; ts?: number }> = ({ n, ts }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">Slot {n}</span>
        {ts && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => loadFromSlot(n)}
          disabled={!ts}
        >
          Carregar
        </Button>
        <Button size="sm" onClick={() => saveToSlot(n)}>
          Salvar
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => clearSlotUI(n)}
          disabled={!ts}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Auto row simplificado
  const AutoRow: React.FC = () => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">Auto-save</span>
        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        {autoMeta && <span className="text-xs text-muted-foreground">{fmt(autoMeta.updatedAt)}</span>}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={restoreAuto}
          disabled={!autoMeta}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        {saving && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
      </div>
    </div>
  );

  return (
    <div className="h-full w-full">
      {/* Header simples */}
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-medium">Inspector</h2>
      </div>

      {/* Conteúdo minimalista */}
      <div className="p-4">
        <Accordion
          type="multiple"
          defaultValue={["render", "audio", "world"]}
          className="w-full"
        >
          {/* Renderização */}
          <AccordionItem value="render" className="border-b">
            <AccordionTrigger className="py-3 hover:no-underline">
              <span className="text-sm font-medium">Renderização</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <Row label="Predefinição">
                <Select value={renderPreset} onValueChange={(v) => setRenderPreset(v as any)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quality">Qualidade</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </Row>
            </AccordionContent>
          </AccordionItem>

          {/* Áudio */}
          <AccordionItem value="audio" className="border-b">
            <AccordionTrigger className="py-3 hover:no-underline">
              <span className="text-sm font-medium">Áudio</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <Row label="Música ambiente">
                <Switch checked={audioEnabled} onCheckedChange={setAudioEnabled} />
              </Row>

              <Row label="Trilha atual">
                <Select
                  value={currentTrack || ""}
                  onValueChange={(v) => setCurrentTrack(v)}
                  disabled={!audioEnabled}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Nenhuma" />
                  </SelectTrigger>
                  <SelectContent>
                    {hasTracks
                      ? tracks.map((id: string) => (
                        <SelectItem key={id} value={id}>{id}</SelectItem>
                      ))
                      : <SelectItem value="">Nenhuma</SelectItem>}
                  </SelectContent>
                </Select>
              </Row>

              <Row label="Volume">
                <div className="flex items-center gap-2">
                  <Slider
                    value={[vol]}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-24"
                    disabled={!audioEnabled || !hasTracks}
                    onValueChange={([v]) => setVol(v)}
                    onValueCommit={([v]) => setAudioVolume(v)}
                  />
                  <span className="w-10 text-xs tabular-nums">
                    {(vol * 100) | 0}%
                  </span>
                </div>
              </Row>
            </AccordionContent>
          </AccordionItem>

          {/* Mundo e Salvamento */}
          <AccordionItem value="world" className="border-b">
            <AccordionTrigger className="py-3 hover:no-underline">
              <span className="text-sm font-medium">Mundo & Salvamento</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-1">
                <AutoRow />
                {slots.map(({ slot, meta }) => (
                  <SlotRow key={slot} n={slot} ts={meta?.updatedAt} />
                ))}
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="mt-4 w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
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
