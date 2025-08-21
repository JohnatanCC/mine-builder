// UPDATE: src/components/AmbientAudio.tsx
import { AMBIENT_TRACKS } from "@/audio/ambient";
import { useWorld } from "@/state/world.store";
import * as React from "react";


/**
 * Player de música ambiente:
 * - ÚNICO elemento <audio> (memoizado em ref).
 * - Não recria/repõe a `src` quando apenas volume muda.
 * - Track muda somente quando `trackId` muda (comparação por id).
 * - Autoplay somente após gesto (pointer/keydown).
 * - Pausa ao esconder a aba.
 */
export function AmbientAudio() {
    const enabled = useWorld((s) => s.audioEnabled);
    const volume = useWorld((s) => s.audioVolume);
    const trackId = useWorld((s) => s.currentTrack);

    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const armedRef = React.useRef(false);
    const currentTrackRef = React.useRef<string | null>(null);

    // cria único <audio>
    React.useEffect(() => {
        if (!audioRef.current) {
            const a = new Audio();
            a.loop = true;
            a.preload = "auto";
            a.crossOrigin = "anonymous";
            a.volume = Math.max(0, Math.min(1, volume));
            audioRef.current = a;
        }
    }, []); // volume inicial só aqui

    // destrava autoplay no primeiro gesto
    React.useEffect(() => {
        if (!enabled || armedRef.current) return;

        const tryPlay = async () => {
            const a = audioRef.current;
            if (!a) return;
            try {
                await a.play();
                armedRef.current = true;
                window.removeEventListener("pointerdown", tryPlay);
                window.removeEventListener("keydown", tryPlay);
            } catch {
                /* aguarda próximo gesto */
            }
        };

        window.addEventListener("pointerdown", tryPlay);
        window.addEventListener("keydown", tryPlay);
        return () => {
            window.removeEventListener("pointerdown", tryPlay);
            window.removeEventListener("keydown", tryPlay);
        };
    }, [enabled]);

    // reage a enabled/volume/trackId
    React.useEffect(() => {
        const a = audioRef.current;
        if (!a) return;

        // 1) volume: NÃO reinicia música
        a.volume = Math.max(0, Math.min(1, volume));

        // 2) track: troca apenas se id mudou (evita comparar URL resolvida)
        const nextId = trackId || "";
        if (currentTrackRef.current !== nextId) {
            const nextSrc = AMBIENT_TRACKS[nextId] || "";
            currentTrackRef.current = nextId;

            if (nextSrc) {
                // só atribui src quando há trilha válida
                if (a.src !== nextSrc) a.src = nextSrc;
            } else {
                // sem trilha selecionada
                a.removeAttribute("src");
            }
        }

        // 3) play/pause conforme enabled + existência de trilha
        const hasSrc = !!a.src;
        if (!enabled || !hasSrc) {
            a.pause();
            return;
        }

        // chama play() apenas quando necessário
        if (a.paused) {
            a.play().catch(() => {
                /* aguardará gesto do usuário */
            });
        }
    }, [enabled, volume, trackId]);

    // pausa ao esconder a aba / retoma ao voltar
    React.useEffect(() => {
        const onVis = () => {
            const a = audioRef.current;
            if (!a) return;
            if (document.hidden) a.pause();
            else if (enabled && a.src) a.play().catch(() => { });
        };
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, [enabled]);

    return null;
}
