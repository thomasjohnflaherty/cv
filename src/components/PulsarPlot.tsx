import { useEffect, useRef, useState, useCallback } from "react";
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

// Seeded pseudo-random number generator for deterministic noise per scroll position
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function PulsarPlot({ scrollProgress }: PulsarPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pulses, setPulses] = useState<DataPoint[][]>([]);
  const drawnRef = useRef(false);
  const lastSeedRef = useRef(-1);

  // Fade out as theme transitions
  const opacity = useTransform(scrollProgress, [0, THEME_TRANSITION[0], THEME_TRANSITION[1]], [0.7, 0.7, 0]);

  // Load and group the CSV data
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
        // Take every other pulse line
        const allPulses = Array.from(grouped.values());
        setPulses(allPulses.filter((_, i) => i % 2 === 0));
      });
  }, []);

  const draw = useCallback(
    (seed: number) => {
      if (!pulses.length || !svgRef.current) return;

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      const width = svgRef.current.clientWidth;
      const height = svgRef.current.clientHeight;

      const rng = mulberry32(Math.floor(seed * 1000));

      // Maintain natural aspect ratio — the data is ~300 wide by ~40 tall
      // Use height to drive sizing, center horizontally
      const lineSpacing = height / (pulses.length + 4);
      const plotWidth = lineSpacing * pulses.length * 0.7; // roughly square-ish
      const xOffset = (width - plotWidth) / 2;

      const xScale = d3.scaleLinear().domain([1, 300]).range([xOffset, xOffset + plotWidth]);
      const yScale = (_i: number) => lineSpacing * (_i + 2);
      const zMax = 5;
      const zScale = d3.scaleLinear().domain([-2, zMax]).range([0, lineSpacing * 2.5]);

      // Create gradient
      const defs = svg.append("defs");
      const gradient = defs.append("linearGradient").attr("id", "pg").attr("x1", "0%").attr("x2", "100%");
      gradient.append("stop").attr("offset", "0%").attr("stop-color", "#2563eb").attr("stop-opacity", 0.15);
      gradient.append("stop").attr("offset", "30%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.6);
      gradient.append("stop").attr("offset", "50%").attr("stop-color", "#7c3aed").attr("stop-opacity", 0.8);
      gradient.append("stop").attr("offset", "70%").attr("stop-color", "#a78bfa").attr("stop-opacity", 0.6);
      gradient.append("stop").attr("offset", "100%").attr("stop-color", "#2563eb").attr("stop-opacity", 0.15);

      const line = d3.line<{ x: number; z: number }>().curve(d3.curveBasis);

      pulses.forEach((points, i) => {
        const baseY = yScale(i);

        // All points get noise — flat lines shimmer gently, peaks shimmer more
        const noisyPoints = points.map((p) => {
          const peakFactor = Math.max(0, p.z) / zMax;
          // Base noise for everyone + extra for peaks
          const heightNoise = (rng() - 0.5) * (0.15 + peakFactor * 0.5);
          return { x: p.x, z: p.z + heightNoise };
        });

        // Area fill for occlusion — extends one full line spacing below
        const areaGen = d3
          .area<{ x: number; z: number }>()
          .x((d) => xScale(d.x))
          .y0(baseY + lineSpacing * 1.2)
          .y1((d) => baseY - zScale(d.z))
          .curve(d3.curveBasis);

        svg
          .append("path")
          .datum(noisyPoints)
          .attr("d", areaGen(noisyPoints) ?? "")
          .attr("fill", "var(--color-bg)")
          .attr("stroke", "none");

        // Stroke line
        svg
          .append("path")
          .datum(noisyPoints)
          .attr(
            "d",
            line.x((d) => xScale(d.x)).y((d) => baseY - zScale(d.z))(noisyPoints) ?? ""
          )
          .attr("fill", "none")
          .attr("stroke", "url(#pg)")
          .attr("stroke-width", 1);
      });
    },
    [pulses]
  );

  // Redraw on scroll with new noise seed — throttled to avoid thrashing
  useEffect(() => {
    if (!pulses.length) return;

    // Initial draw
    draw(0);
    drawnRef.current = true;

    const unsub = scrollProgress.on("change", (v) => {
      // Quantize to reduce redraws — regenerate every ~0.5% of scroll
      const seed = Math.floor(v * 200);
      if (seed !== lastSeedRef.current) {
        lastSeedRef.current = seed;
        draw(v);
      }
    });

    return unsub;
  }, [pulses, scrollProgress, draw]);

  return (
    <motion.div
      className="fixed top-0 right-0 w-1/2 lg:w-2/5 h-screen pointer-events-none z-0"
      style={{ opacity }}
    >
      <svg ref={svgRef} className="w-full h-full" preserveAspectRatio="xMidYMid meet" />
    </motion.div>
  );
}
