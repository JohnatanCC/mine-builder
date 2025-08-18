import { useWorld } from "../../state/world.store";
import { groupStyle, titleStyle } from "./theme";
import { Row, Slider, Select, Toggle } from "./ui";

export function AudioSection() {
    const enabled = useWorld(s => s.audioEnabled);
    const setEnabled = useWorld(s => s.setAudioEnabled);

    const volume = useWorld(s => s.audioVolume);
    const setVolume = useWorld(s => s.setAudioVolume);

    const tracks = useWorld(s => s.audioTracks);
    const current = useWorld(s => s.currentTrack);
    const setCurrent = useWorld(s => s.setCurrentTrack);

    const hasTracks = tracks.length > 0;

    return (
        <div style={groupStyle}>
            <div style={titleStyle}>Áudio</div>

            <Row label="Música ambiente">
                <Toggle
                    checked={enabled}
                    onChange={setEnabled}
                    label={enabled ? "ON" : "OFF"}
                />
            </Row>

            <Row label="Trilha">
                <Select
                    value={current}
                    onChange={setCurrent}
                    options={
                        hasTracks
                            ? tracks.map(id => ({ value: id, label: id })) // mostra "Ambient#1"
                            : [{ value: "", label: "(nenhuma encontrada)" }]
                    }
                    title="Selecione a música (nome do arquivo)"
                />
            </Row>

            <Slider
                label="Volume"
                min={0} max={1} step={0.01}
                value={volume}
                onChange={setVolume}
                fmt={n => `${(n * 100) | 0}%`}
                disabled={!enabled || !hasTracks}
            />
        </div>
    );
}
