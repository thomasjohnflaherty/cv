import { useEffect, useRef, useCallback } from "react";

interface MorphTextProps {
  from: string;
  to: string;
  progress: number; // 0 = fully "from", 1 = fully "to"
  fontFamily: string;
  fontSize: number;
  fontWeight?: number;
  color: string;
  className?: string;
}

interface CharPosition {
  char: string;
  x: number;
}

/**
 * Morphs between two text strings by:
 * - Shared prefix stays in place
 * - Matched characters (same letter) slide from old position to new
 * - Unmatched characters fade in/out
 */
export function MorphText({
  from,
  to,
  progress,
  fontFamily,
  fontSize,
  fontWeight = 500,
  color,
  className,
}: MorphTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || fontSize < 10) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const canvasWidth = canvas.parentElement?.clientWidth || canvas.clientWidth;
    if (canvasWidth === 0) return;

    const canvasHeight = fontSize * 1.5;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.height = `${canvasHeight}px`;
    ctx.scale(dpr, dpr);

    const font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.font = font;
    ctx.textBaseline = "top";

    // Measure character positions for both strings
    const measurePositions = (text: string): CharPosition[] => {
      const positions: CharPosition[] = [];
      let x = 0;
      for (const char of text) {
        positions.push({ char, x });
        x += ctx.measureText(char).width;
      }
      return positions;
    };

    const fromPositions = measurePositions(from);
    const toPositions = measurePositions(to);

    // Find shared prefix length
    let sharedPrefix = 0;
    while (
      sharedPrefix < from.length &&
      sharedPrefix < to.length &&
      from[sharedPrefix] === to[sharedPrefix]
    ) {
      sharedPrefix++;
    }

    // Match remaining characters between from and to
    // Build a mapping: for each "to" char after prefix, find matching "from" char
    const fromSuffix = from.slice(sharedPrefix);
    const toSuffix = to.slice(sharedPrefix);
    const fromUsed = new Set<number>();
    const matches: Map<number, number> = new Map(); // toIdx -> fromIdx (relative to suffix)

    for (let ti = 0; ti < toSuffix.length; ti++) {
      for (let fi = 0; fi < fromSuffix.length; fi++) {
        if (!fromUsed.has(fi) && toSuffix[ti].toLowerCase() === fromSuffix[fi].toLowerCase()) {
          matches.set(ti, fi);
          fromUsed.add(fi);
          break;
        }
      }
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const y = fontSize * 0.2;

    // Eased progress for smoother feel
    const t = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    // 1. Draw shared prefix (always fully visible)
    for (let i = 0; i < sharedPrefix; i++) {
      const fp = fromPositions[i];
      ctx.fillStyle = color;
      ctx.globalAlpha = 1;
      ctx.fillText(fp.char, fp.x, y);
    }

    // 2. Draw "from" suffix characters (fade out / slide)
    for (let fi = 0; fi < fromSuffix.length; fi++) {
      const absIdx = sharedPrefix + fi;
      const fp = fromPositions[absIdx];
      if (!fp) continue;

      // Check if this char is matched to a "to" char
      let isMatched = false;
      let targetX = fp.x;
      for (const [ti, matchedFi] of matches) {
        if (matchedFi === fi) {
          isMatched = true;
          const tp = toPositions[sharedPrefix + ti];
          if (tp) targetX = tp.x;
          break;
        }
      }

      if (isMatched) {
        // Slide from old position to new
        const currentX = fp.x + (targetX - fp.x) * t;
        ctx.fillStyle = color;
        ctx.globalAlpha = 1;
        ctx.fillText(fp.char, currentX, y);
      } else {
        // Fade out
        ctx.fillStyle = color;
        ctx.globalAlpha = 1 - t;
        if (ctx.globalAlpha > 0.01) {
          ctx.fillText(fp.char, fp.x, y);
        }
      }
    }

    // 3. Draw "to" suffix characters that are NOT matched (fade in)
    for (let ti = 0; ti < toSuffix.length; ti++) {
      if (matches.has(ti)) continue; // already drawn via from-side slide

      const absIdx = sharedPrefix + ti;
      const tp = toPositions[absIdx];
      if (!tp) continue;

      ctx.fillStyle = color;
      ctx.globalAlpha = t;
      if (ctx.globalAlpha > 0.01) {
        ctx.fillText(tp.char, tp.x, y);
      }
    }

    ctx.globalAlpha = 1;
  }, [from, to, progress, fontFamily, fontSize, fontWeight, color]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", display: "block" }}
    />
  );
}
