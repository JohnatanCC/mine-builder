// NEW: src/ui/panels/TerrainPanel.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorld } from "@/state/world.store";
import { generateIslandSnapshot, mergeConstruction, type IslandKind } from "@/terrain/generate";
import { toast } from "sonner";

export const TerrainPanel: React.FC = () => {
  const loadSnapshot = useWorld(s => s.loadSnapshot);

  const [kind, setKind] = React.useState<IslandKind>("mini");
  const [radius, setRadius] = React.useState(16);
  const [seed, setSeed] = React.useState<number>(() => Math.floor(Math.random() * 1e9));
  const [file, setFile] = React.useState<File | null>(null);
  const [yOffset, setYOffset] = React.useState(1);

  const onGenerate = async () => {
    try {
      const terrain = generateIslandSnapshot({ kind, radius, seed, seaLevel: 0 });

      let construction: any = null;
      if (file) {
        const txt = await file.text();
        construction = JSON.parse(txt);
      }

      const merged = mergeConstruction(terrain, construction, { x: 0, y: yOffset, z: 0 });
      loadSnapshot(merged);
      toast("Terreno gerado!");
    } catch (e) {
      console.error(e);
      toast("Falha ao gerar terreno / carregar construção");
    }
  };

  const rerollSeed = () => setSeed(Math.floor(Math.random() * 1e9));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs">Tipo</Label>
        <Select value={kind} onValueChange={(v) => setKind(v as IslandKind)}>
          <SelectTrigger className="h-8 w-40">
            <SelectValue placeholder="Escolha…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mini">Mini</SelectItem>
            <SelectItem value="atoll">Atol</SelectItem>
            <SelectItem value="plateau">Planalto</SelectItem>
            <SelectItem value="mesa">Mesa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs">Raio ({radius})</Label>
        <div className="flex items-center gap-2">
          <Slider className="w-48" value={[radius]} min={8} max={48} step={1} onValueChange={([v]) => setRadius(v)} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs">Seed</Label>
        <div className="flex items-center gap-2">
          <Input className="h-8 w-36 text-xs" value={seed} onChange={(e)=>setSeed(Number(e.target.value||0))}/>
          <Button size="sm" variant="secondary" onClick={rerollSeed}>Reroll</Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs">Construção (opcional)</Label>
        <Input type="file" className="h-8 w-60 text-xs"
               accept=".json,application/json"
               onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      </div>

      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs">Altura da construção (+Y)</Label>
        <Slider className="w-48" value={[yOffset]} min={-8} max={16} step={1} onValueChange={([v])=>setYOffset(v)} />
      </div>

      <Button className="mt-2" onClick={onGenerate}>Gerar terreno</Button>
    </div>
  );
};
