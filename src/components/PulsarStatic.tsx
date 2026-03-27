import { useEffect, useRef, useState } from "react";

interface DataPoint {
  x: number;
  z: number;
}

/**
 * Static pulsar ridge plot rendered as inline SVG.
 * No animation, no D3 dependency — just path strings.
 * Used in the PDF resume where D3/rAF isn't available.
 */
export function PulsarStatic({ width = 250, height = 300, color = "#2563eb" }: {
  width?: number;
  height?: number;
  color?: string;
}) {
  const [paths, setPaths] = useState<string[]>([]);
  const [fills, setFills] = useState<string[]>([]);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    fetch("/cp1919.csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const grouped = new Map<number, DataPoint[]>();
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(",");
          const y = Number(parts[1]);
          grouped.set(y, [...(grouped.get(y) || []), { x: Number(parts[0]), z: Number(parts[2]) }]);
        }

        const allPulses = Array.from(grouped.values());
        const displayPulses = allPulses.filter((_, i) => i % 3 === 0); // every 3rd for compact view
        const numLines = displayPulses.length;
        const lineSpacing = height / numLines;
        const plotWidth = width;
        const zMax = 5;
        const zHeight = lineSpacing * 0.8;

        const xScale = (x: number) => (x / 300) * plotWidth;
        const zScale = (z: number) => ((z + 2) / (zMax + 2)) * zHeight;
        const yBase = (i: number) => lineSpacing * i;

        const strokePaths: string[] = [];
        const fillPaths: string[] = [];

        displayPulses.forEach((points, i) => {
          const base = yBase(i);
          const coords = points.map((p) => [xScale(p.x), base - zScale(p.z)] as [number, number]);

          // Build SVG path with simple line segments (curveBasis would need D3)
          // Use quadratic bezier approximation for smoothness
          let d = `M ${coords[0][0]} ${coords[0][1]}`;
          for (let j = 1; j < coords.length - 1; j++) {
            const cx = (coords[j][0] + coords[j + 1][0]) / 2;
            const cy = (coords[j][1] + coords[j + 1][1]) / 2;
            d += ` Q ${coords[j][0]} ${coords[j][1]} ${cx} ${cy}`;
          }
          const last = coords[coords.length - 1];
          d += ` L ${last[0]} ${last[1]}`;
          strokePaths.push(d);

          // Fill path for occlusion
          const fillD = d + ` L ${last[0]} ${base + lineSpacing} L ${coords[0][0]} ${base + lineSpacing} Z`;
          fillPaths.push(fillD);
        });

        setPaths(strokePaths);
        setFills(fillPaths);
      });
  }, [width, height]);

  if (!paths.length) return null;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
      {paths.map((d, i) => (
        <g key={i}>
          <path d={fills[i]} fill="#ffffff" stroke="none" />
          <path d={d} fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}
