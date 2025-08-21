// src/components/AmbientAudio.tsx
import * as React from "react";
import { useWorld } from "../state/world.store";
import { AMBIENT_TRACKS } from "../audio/ambient";

export function AmbientAudio() {
  const enabled = useWorld((s) => s.audioEnabled);
  const volume = useWorld((s) => s.audioVolume);
  const trackId = useWorld((s) => s.currentTrack);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [armed, setArmed] = React.useState(false);

  React.useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio();
      a.loop = true;
      a.preload = "auto";
      a.crossOrigin = "anonymous";
      audioRef.current = a;
    }
  }, []);

  // destravar autoplay no primeiro gesto
  React.useEffect(() => {
    if (!enabled || armed) return;
    const tryPlay = async () => {
      if (!audioRef.current) return;
      try {
        await audioRef.current.play();
        setArmed(true);
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
  }, [enabled, armed]);

  React.useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.volume = Math.max(0, Math.min(1, volume));

    const src = AMBIENT_TRACKS[trackId] || "";
    if (src && a.src !== src) {
      a.src = src;
      a.currentTime = 0;
    }

    if (!enabled || !src) {
      a.pause();
      return;
    }
    a.play().catch(() => {
      /* aguardará gesto */
    });
  }, [enabled, volume, trackId]);

  // pausa ao esconder aba
  React.useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onVis = () => {
      if (document.hidden) a.pause();
      else if (enabled) a.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [enabled]);

  return null;
}
