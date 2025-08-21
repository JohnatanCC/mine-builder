// NEW FILE (ou UPDATE se já existir): src/components/AmbientAudio.tsx
import * as React from "react";
import { useWorld } from "@/state/world.store";
import { AMBIENT_TRACKS, type AmbientId } from "@/audio/ambient";

/**
 * Player global de música ambiente:
 * - Um único <audio> (não há duplicação).
 * - Mudar volume NÃO reinicia a música.
 * - Só troca `src` ao mudar o id da trilha.
 * - Autoplay somente após um gesto do usuário.
 * - Pausa quando a aba fica oculta, retoma ao voltar.
 */
export function AmbientAudio() {
  const enabled = useWorld((s) => s.audioEnabled);
  const volume = useWorld((s) => s.audioVolume);
  const trackId = useWorld((s) => s.currentTrack);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const armedRef = React.useRef(false);
  const currentIdRef = React.useRef<AmbientId | "">("");

  // cria único elemento <audio>
  React.useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.loop = true;
      a.preload = "auto";
      a.crossOrigin = "anonymous";
      a.volume = Math.max(0, Math.min(1, volume)); // volume inicial
      audioRef.current = a;
    }
  }, []); // não dependa de volume aqui para não reiniciar

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
        // ficará aguardando novo gesto
      }
    };

    window.addEventListener("pointerdown", tryPlay);
    window.addEventListener("keydown", tryPlay);
    return () => {
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
  }, [enabled]);

  // sincroniza enabled/volume/trackId sem reiniciar à toa
  React.useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    // 1) volume em tempo real (NÃO reinicia)
    a.volume = Math.max(0, Math.min(1, volume));

    // 2) track: só troca se o id mudar
    const nextId: AmbientId | "" = (trackId as AmbientId) || "";
    if (currentIdRef.current !== nextId) {
      currentIdRef.current = nextId;

      const nextSrc = nextId ? AMBIENT_TRACKS[nextId] : "";
      if (nextSrc) {
        // evita reatribuir a mesma src (que pode estar absoluta no atributo)
        if (a.src !== nextSrc) a.src = nextSrc;
      } else {
        // nenhum id selecionado: remove src
        a.removeAttribute("src");
      }
    }

    // 3) play/pause conforme estado
    const hasSrc = !!a.src;
    if (!enabled || !hasSrc) {
      a.pause();
      return;
    }
    if (a.paused) {
      a.play().catch(() => {
        // aguardará gesto do usuário
      });
    }
  }, [enabled, volume, trackId]);

  // pausa ao esconder aba e retoma ao voltar
  React.useEffect(() => {
    const onVis = () => {
      const a = audioRef.current;
      if (!a) return;
      if (document.hidden) a.pause();
      else if (enabled && a.src) a.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [enabled]);

  return null;
}
