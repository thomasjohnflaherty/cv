import { useEffect, useRef, useState, useCallback } from "react";

interface GlitchTextProps {
  text: string;
  fontFamily: string;
  fontSize: number;
  color?: string;
  className?: string;
}

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?/\\|";

/**
 * Renders text on canvas with a glitch/scramble reveal effect.
 * Characters start as random glyphs and resolve into the real text
 * when the element enters the viewport.
 */
export function GlitchText({ text, fontFamily, fontSize, color = "#e5e5e5", className }: GlitchTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const hasStarted = useRef(false);

  const duration = 1200; // ms for full reveal
  const staggerPerChar = 60; // ms delay between each character starting to resolve

  const draw = useCallback(
    (currentProgress: number) => {
      const canvas = canvasRef.current;
      if (!canvas || fontSize < 10) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const canvasWidth = canvas.parentElement?.clientWidth || canvas.clientWidth;
      if (canvasWidth === 0) return;

      const font = `${fontSize}px ${fontFamily}`;

      // Size canvas first
      const canvasHeight = fontSize * 1.4;
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      canvas.style.height = `${canvasHeight}px`;
      ctx.scale(dpr, dpr);

      // Clear
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.font = font;
      ctx.textBaseline = "top";

      // Draw each character
      let charIndex = 0;
      let x = 0;
      const y = fontSize * 0.15; // slight top offset

      for (const char of text) {
        if (char === " ") {
          x += ctx.measureText(" ").width;
          charIndex++;
          continue;
        }

        const charDelay = charIndex * staggerPerChar;
        const totalTime = currentProgress * duration + text.length * staggerPerChar * currentProgress;
        const charProgress = Math.max(0, Math.min(1, (totalTime - charDelay) / 300));

        if (charProgress >= 1) {
          ctx.fillStyle = color;
          ctx.globalAlpha = 1;
          ctx.fillText(char, x, y);
        } else if (charProgress > 0) {
          const isReal = Math.random() < charProgress * charProgress;
          const displayChar = isReal ? char : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.4 + charProgress * 0.6;
          ctx.fillText(displayChar, x, y);
        } else {
          const glitchChar = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.15;
          ctx.fillText(glitchChar, x, y);
        }

        x += ctx.measureText(char).width;
        charIndex++;
      }

      ctx.globalAlpha = 1;
    },
    [text, fontFamily, fontSize, color, staggerPerChar, duration]
  );

  // Trigger animation when element enters viewport
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          startTimeRef.current = performance.now();

          const animate = (time: number) => {
            const elapsed = time - startTimeRef.current;
            const totalChars = text.replace(/\s/g, "").length;
            const totalDuration = duration + totalChars * staggerPerChar;
            const p = Math.min(1, elapsed / totalDuration);

            draw(p);

            if (p < 1) {
              animFrameRef.current = requestAnimationFrame(animate);
            } else {
              setRevealed(true);
            }
          };

          animFrameRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(canvas);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [text, draw, duration]);

  // Draw initial scrambled state
  useEffect(() => {
    if (!hasStarted.current) {
      draw(0);
    }
  }, [draw]);

  // If revealed, show regular text for accessibility/selectability
  if (revealed) {
    return (
      <span
        className={className}
        style={{ fontSize: `${fontSize}px`, fontFamily, color, lineHeight: 1.2, display: "block" }}
      >
        {text}
      </span>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", display: "block" }}
    />
  );
}
