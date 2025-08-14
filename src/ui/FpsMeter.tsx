import { useEffect, useRef, useState } from "react";

export default function FpsMeter() {
  const [fps, setFps] = useState(0);
  const frames = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      const now = performance.now();
      frames.current++;

      // Atualiza a cada segundo
      if (now >= lastTime.current + 500) {
        setFps(frames.current);
        frames.current = 0;
        lastTime.current = now;
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        padding: "4px 8px",
        background: "rgba(0,0,0,0.5)",
        color: "#0f0",
        fontSize: "14px",
        fontFamily: "monospace",
        borderRadius: "4px",
        zIndex: 10,            
        pointerEvents: "auto",    
      }}
    >
      {fps} FPS
    </div>
  );
}
