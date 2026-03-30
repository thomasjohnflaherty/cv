import { useState, useEffect, useRef, useCallback } from "react";
import { prepare, layout } from "@chenglou/pretext";

/**
 * Binary-searches for the largest font size that fits text
 * within containerWidth in a single line.
 *
 * prepare() runs once per text/font-family change.
 * layout() runs on resize (near-free: ~0.09ms).
 */
export function useFluidText(
  text: string,
  fontFamily: string,
  containerRef: React.RefObject<HTMLElement | null>,
  options?: { minSize?: number; maxSize?: number; fontWeight?: number }
) {
  const { minSize = 16, maxSize = 200, fontWeight = 300 } = options ?? {};
  const [fontSize, setFontSize] = useState(minSize);
  const preparedCache = useRef<Map<string, ReturnType<typeof prepare>>>(new Map());

  const getPrepared = useCallback(
    (size: number) => {
      const font = `${fontWeight} ${size}px ${fontFamily}`;
      const key = `${text}|${font}`;
      if (!preparedCache.current.has(key)) {
        preparedCache.current.set(key, prepare(text, font));
      }
      return preparedCache.current.get(key)!;
    },
    [text, fontFamily, fontWeight]
  );

  const calculate = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const width = el.clientWidth;
    if (width === 0) return;

    // Binary search for the largest font size that fits in 1 line
    let lo = minSize;
    let hi = maxSize;
    let best = minSize;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const prepared = getPrepared(mid);
      const result = layout(prepared, width, mid * 1.1); // lineHeight ~1.1

      if (result.lineCount <= 1) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }

    setFontSize(best);
  }, [containerRef, minSize, maxSize, getPrepared]);

  // Calculate on mount and resize
  useEffect(() => {
    calculate();

    const observer = new ResizeObserver(() => {
      // Clear prepared cache on resize since container width changed
      // (layout() is cheap but we need to re-search)
      calculate();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [calculate, containerRef]);

  return fontSize;
}
