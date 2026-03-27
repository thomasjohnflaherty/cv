import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useTransform, motion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { THEME_TRANSITION } from "../utils/motion";

interface PulsarPlotProps {
  scrollProgress: MotionValue<number>;
}

interface DataPoint {
  x: number;
  z: number;
}

export function PulsarPlot({ scrollProgress }: PulsarPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pulses, setPulses] = useState<DataPoint[][]>([]);
  const animRef = useRef<number>(0);

  const opacity = useTransform(scrollProgress, [0, THEME_TRANSITION[0], THEME_TRANSITION[1]], [0.7, 0.7, 0]);

  // Load CSV
  useEffect(() => {
    fetch("/cp1919.csv")
      .then((res) => res.text())
      .then((text) => {
        const lines = text.trim().split("\n");
        const grouped = new Map<number, DataPoint[]>();
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(",");
          const y = Number(parts[1]);
          const point = { x: Number(parts[0]), z: Number(parts[2]) };
          if (!grouped.has(y)) grouped.set(y, []);
          grouped.get(y)!.push(point);
        }
        const allPulses = Array.from(grouped.values());
        setPulses(allPulses.filter((_, i) => i % 2 === 0));
      });
  }, []);

  // Build SVG once, then animate via rAF
  useEffect(() => {
    if (!pulses.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const lineSpacing = height / (pulses.length + 4);
    const plotWidth = lineSpacing * pulses.length * 0.7;
    const xOffset = (width - plotWidth) / 2;

    const xScale = d3.scaleLinear().domain([1, 300]).range([xOffset, xOffset + plotWidth]);
    const yBase = (i: number) => lineSpacing * (i + 2);
    const zMax = 5;
    const zScale = d3.scaleLinear().domain([-2, zMax]).range([0, lineSpacing * 0.8]);

    // Gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient").attr("id", "pg").attr("x1", "0%").attr("x2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#2563eb").attr("stop-opacity", 0.15);
    gradient.append("stop").attr("offset", "30%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.6);
    gradient.append("stop").attr("offset", "50%").attr("stop-color", "#7c3aed").attr("stop-opacity", 0.8);
    gradient.append("stop").attr("offset", "70%").attr("stop-color", "#a78bfa").attr("stop-opacity", 0.6);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#2563eb").attr("stop-opacity", 0.15);

    const lineGen = d3.line<number[]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(d3.curveBasis);

    const areaGen = d3.area<number[]>()
      .x((d) => d[0])
      .y0((d) => d[2])
      .y1((d) => d[1])
      .curve(d3.curveBasis);

    // Pre-create all path elements
    const pathData = pulses.map((points, i) => {
      const fillPath = svg.append("path")
        .attr("fill", "var(--color-bg)")
        .attr("stroke", "none");

      const strokePath = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "url(#pg)")
        .attr("stroke-width", 1);

      return { points, index: i, baseY: yBase(i), fillPath, strokePath };
    });

    // Pre-generate unique noise oscillators per line
    // Each line gets its own random "active zones" that move independently
    let rngState = 42;
    const rand = () => {
      rngState = (rngState * 16807) % 2147483647;
      return rngState / 2147483647;
    };

    const lineOscillators = pulses.map(() => {
      const count = 4 + Math.floor(rand() * 3); // 4-6 oscillators per line
      const oscs = [];
      for (let j = 0; j < count; j++) {
        oscs.push({
          xCenter: rand() * 300,        // where on the line this is active
          xWidth: 30 + rand() * 80,     // how wide the active zone is
          freq: 15 + rand() * 40,       // how fast it cycles with scroll
          phase: rand() * Math.PI * 2,  // unique starting phase
          amp: 0.3 + rand() * 0.6,      // strength
        });
      }
      return oscs;
    });

    // Hash function for deterministic stepped noise
    const hash = (a: number, b: number): number => {
      let h = (a * 2654435761 + b * 340573321) | 0;
      h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
      h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296 - 0.5;
    };

    // Each line's noise: oscillators + stepped jitter + traveling wave
    const noise = (lineIdx: number, xPos: number, scroll: number): number => {
      let total = 0;

      // 1. Spatially-targeted oscillators (unique per line)
      for (const osc of lineOscillators[lineIdx]) {
        const dx = (xPos - osc.xCenter) / osc.xWidth;
        const spatial = Math.exp(-dx * dx * 2);
        const temporal = Math.sin(scroll * osc.freq + osc.phase);
        total += spatial * temporal * osc.amp * 0.35;
      }

      // 2. Stepped jitter (micro-jumps)
      const step = Math.floor(scroll * 800);
      const jitter = hash(lineIdx * 300 + Math.floor(xPos / 25), step) * 0.3;
      const nextJitter = hash(lineIdx * 300 + Math.floor(xPos / 25), step + 1) * 0.3;
      const blend = (scroll * 800) - step;
      const sharpBlend = blend < 0.2 ? blend * 5 : 1;
      total += jitter * (1 - sharpBlend) + nextJitter * sharpBlend;

      // 3. Traveling wave — a ripple that moves diagonally through the grid
      // Scroll drives the wave position; it rolls across x and down through lines
      const wavePos = scroll * 60;
      // Wave moves diagonally: x position + line index creates the diagonal
      const wavePhase = (xPos / 300) * 4 + lineIdx * 0.15 - wavePos;
      // Narrow gaussian envelope so the wave is a localized pulse, not everywhere
      const wavePulse = Math.exp(-((wavePhase % (Math.PI * 2)) ** 2) * 0.5);
      const waveSign = Math.sin(wavePhase * 3); // oscillation within the pulse
      total += wavePulse * waveSign * 0.4;

      return total;
    };

    // Animation loop
    const animate = () => {
      const progress = scrollProgress.get();

      pathData.forEach(({ points, index, baseY, fillPath, strokePath }) => {
        const coords = points.map((p) => {
          const peakFactor = Math.max(0, p.z) / zMax;
          // Noise scales with peak height — peaks move, flats barely shimmer
          const n = noise(index, p.x, progress) * (0.05 + peakFactor * 0.7);
          const zVal = p.z + n;
          const px = xScale(p.x);
          const py = baseY - zScale(zVal);
          return [px, py, baseY + lineSpacing * 1.2];
        });

        strokePath.attr("d", lineGen(coords));
        fillPath.attr("d", areaGen(coords));
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [pulses, scrollProgress]);

  return (
    <motion.div
      className="fixed top-0 right-0 w-1/2 lg:w-2/5 h-screen pointer-events-none z-0"
      style={{ opacity }}
    >
      <svg ref={svgRef} className="w-full h-full" preserveAspectRatio="xMidYMid meet" />
    </motion.div>
  );
}
