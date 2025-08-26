import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Save, Download, Upload, Trash2 } from "lucide-react";
import { useWorld } from "@/state/world.store";
import { loadSlot, saveSlot, clearSlot, listSlots, loadAuto, applySnapshot } from "@/systems/localSaves";
import { exportWorldJSON, handleImportFile } from "@/systems/world/serializer";
import { toast } from "sonner";

function fmt(ts?: number) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleString([], { 
    month: "short", 
    day: "numeric", 
    hour: "2-digit", 
    minute: "2-digit" 
  });
}

export function SettingsModal() {
  // Audio state
  const audioEnabled = useWorld(s => s.audioEnabled);
  const setAudioEnabled = useWorld(s => s.setAudioEnabled);
  const audioVolume = useWorld(s => s.audioVolume);
  const setAudioVolume = useWorld(s => s.setAudioVolume);
  const tracks = useWorld(s => s.audioTracks);
  const currentTrack = useWorld(s => s.currentTrack);
  const setCurrentTrack = useWorld(s => s.setCurrentTrack);

  // Render settings
  const renderPreset = useWorld(s => s.renderPreset);
  const setRenderPreset = useWorld(s => s.setRenderPreset);

  // Saves
  const [slots, setSlots] = React.useState(() => listSlots());
  const [autoMeta, setAutoMeta] = React.useState(() => loadAuto());
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [vol, setVol] = React.useState(audioVolume);
  React.useEffect(() => setVol(audioVolume), [audioVolume]);

  const refreshSlots = React.useCallback(() => {
    setSlots(listSlots());
    setAutoMeta(loadAuto());
  }, []);

  const saveToSlot = React.useCallback((n: number) => {
    const snap = useWorld.getState().getSnapshot();
    saveSlot(n, snap, "0.4.0");
    refreshSlots();
    toast.success(`Slot ${n} salvo`);
  }, [refreshSlots]);

  const loadFromSlot = React.useCallback((n: number) => {
    const data = loadSlot(n);
    if (!data) {
      toast.error(`Slot ${n} está vazio`);
      return;
    }
    applySnapshot(data.snapshot);
    toast.success(`Slot ${n} carregado`);
  }, []);

  const clearSlotUI = React.useCallback((n: number) => {
    clearSlot(n);
    refreshSlots();
    toast.success(`Slot ${n} limpo`);
  }, [refreshSlots]);

  const onClearWorld = () => {
    useWorld.setState({
      blocks: new Map(),
      past: [],
      future: [],
      currentStroke: null,
      effects: [],
    });
    toast.success("Mundo limpo");
  };

  const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImportFile(file);
      toast.success("Mundo importado");
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>Configurações</DialogTitle>
      </DialogHeader>

      <Tabs defaultValue="audio" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="audio" className="text-blue-600 border-blue-200">
            <Volume2 className="h-4 w-4 mr-2" />
            Áudio
          </TabsTrigger>
          <TabsTrigger value="saves" className="text-green-600 border-green-200">
            <Save className="h-4 w-4 mr-2" />
            Saves
          </TabsTrigger>
          <TabsTrigger value="import" className="text-purple-600 border-purple-200">
            <Upload className="h-4 w-4 mr-2" />
            Arquivos
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-orange-600 border-orange-200">
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Audio Tab */}
        <TabsContent value="audio" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Música ambiente</Label>
              <Switch checked={audioEnabled} onCheckedChange={setAudioEnabled} />
            </div>

            {audioEnabled && (
              <>
                <div className="space-y-2">
                  <Label>Volume: {Math.round(vol * 100)}%</Label>
                  <Slider
                    value={[vol]}
                    onValueChange={([value]) => setVol(value)}
                    onValueCommit={([value]) => setAudioVolume(value)}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {tracks && tracks.length > 0 && (
                  <div className="space-y-2">
                    <Label>Trilha atual</Label>
                    <Select value={currentTrack || ""} onValueChange={setCurrentTrack}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar trilha" />
                      </SelectTrigger>
                      <SelectContent>
                        {tracks.map((track) => (
                          <SelectItem key={track} value={track}>
                            {track.replace(/\.[^/.]+$/, "")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* Saves Tab */}
        <TabsContent value="saves" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto-save</Label>
              <Badge variant="outline">
                {autoMeta?.updatedAt ? fmt(autoMeta.updatedAt) : "Nunca"}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Slots manuais</Label>
              {[1, 2, 3, 4, 5].map((n) => {
                const slot = slots.find((s) => s.slot === n);
                const meta = slot?.meta;
                return (
                  <div key={n} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">Slot {n}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {meta ? fmt(meta.updatedAt) : "Vazio"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => saveToSlot(n)}
                      >
                        Salvar
                      </Button>
                      {meta && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadFromSlot(n)}
                          >
                            Carregar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Limpar Slot {n}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => clearSlotUI(n)}>
                                  Limpar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Import/Export Tab */}
        <TabsContent value="import" className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-20 flex-col"
              >
                <Upload className="h-6 w-6 mb-2" />
                Importar
              </Button>
              <Button
                variant="outline"
                onClick={exportWorldJSON}
                className="h-20 flex-col"
              >
                <Download className="h-6 w-6 mb-2" />
                Exportar
              </Button>
            </div>

            <Separator />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Mundo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Limpar mundo?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Todos os blocos serão removidos. Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onClearWorld}>
                    Limpar Mundo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Qualidade de renderização</Label>
              <Select value={renderPreset} onValueChange={setRenderPreset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa (melhor performance)</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta (melhor qualidade)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={onImportFile}
        className="hidden"
      />
    </div>
  );
}
