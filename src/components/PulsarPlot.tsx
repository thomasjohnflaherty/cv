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

    // Continuous noise function using sine waves at different frequencies
    // Returns smooth, continuously varying noise for a given line index, x position, and scroll
    const noise = (lineIdx: number, xPos: number, scroll: number): number => {
      const s = scroll * 30; // amplify scroll to create visible change
      // Several overlapping sine waves with different frequencies and phases per line
      const n1 = Math.sin(s + lineIdx * 1.7 + xPos * 0.02) * 0.3;
      const n2 = Math.sin(s * 0.7 + lineIdx * 2.3 + xPos * 0.05) * 0.2;
      const n3 = Math.sin(s * 1.3 + lineIdx * 0.9 + xPos * 0.01) * 0.4;
      return n1 + n2 + n3;
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
