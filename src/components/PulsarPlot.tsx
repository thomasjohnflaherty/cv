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
  y: number;
  z: number;
}

export function PulsarPlot({ scrollProgress }: PulsarPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<DataPoint[]>([]);
  const animFrameRef = useRef<number>(0);

  // Fade out as theme transitions
  const opacity = useTransform(scrollProgress, [0, THEME_TRANSITION[0], THEME_TRANSITION[1]], [0.6, 0.6, 0]);

  // Load the CSV data
  useEffect(() => {
    fetch("/cp1919.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed: DataPoint[] = [];
        const lines = text.trim().split("\n");
        for (let i = 1; i < lines.length; i++) {
          const [x, y, z] = lines[i].split(",").map(Number);
          parsed.push({ x, y, z });
        }
        setData(parsed);
      });
  }, []);

  // Draw and animate the plot
  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Group data by pulse (y value)
    const pulses = d3.groups(data, (d) => d.y);
    // Take every 3rd pulse for cleaner spacing
    const selectedPulses = pulses.filter((_, i) => i % 3 === 0);

    const xScale = d3.scaleLinear()
      .domain([1, 300])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, selectedPulses.length])
      .range([height * 0.05, height * 0.98]);

    const zScale = d3.scaleLinear()
      .domain([-2, d3.max(data, (d) => d.z) ?? 5])
      .range([0, height * 0.08]);

    // Create gradient — stronger colors for visibility on light bg
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "pulsar-gradient")
      .attr("x1", "0%").attr("x2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#2563eb").attr("stop-opacity", 0.3);
    gradient.append("stop").attr("offset", "30%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.7);
    gradient.append("stop").attr("offset", "50%").attr("stop-color", "#7c3aed").attr("stop-opacity", 0.9);
    gradient.append("stop").attr("offset", "70%").attr("stop-color", "#a78bfa").attr("stop-opacity", 0.7);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#2563eb").attr("stop-opacity", 0.3);

    const line = d3.line<DataPoint>()
      .x((d) => xScale(d.x))
      .curve(d3.curveBasis);

    // Draw each pulse line
    const paths = selectedPulses.map(([, points], i) => {
      const baseY = yScale(i);

      // Fill path — covers area below line for overlap effect
      svg.append("path")
        .datum(points)
        .attr("class", `pulse-fill-${i}`)
        .attr("d", line.y((d) => baseY - zScale(d.z))(points) ?? "")
        .attr("fill", "var(--color-bg)")
        .attr("stroke", "none");

      // Stroke path
      svg.append("path")
        .datum(points)
        .attr("class", `pulse-line-${i}`)
        .attr("d", line.y((d) => baseY - zScale(d.z))(points) ?? "")
        .attr("fill", "none")
        .attr("stroke", "url(#pulsar-gradient)")
        .attr("stroke-width", 1.5)
        .attr("opacity", 1);

      return { points, index: i, baseY };
    });

    // Scroll-driven animation — horizontal jitter like a live signal
    let lastProgress = scrollProgress.get();

    const animate = () => {
      const progress = scrollProgress.get();
      const delta = progress - lastProgress;
      lastProgress = progress;

      // Only animate when actually scrolling
      if (Math.abs(delta) > 0.00001) {
        const wave = progress * Math.PI * 12;

        paths.forEach(({ points, index, baseY }) => {
          // Each line gets a horizontal shimmer — different phase per line
          const linePhase = index * 1.7;

          const jitteredLine = d3.line<DataPoint>()
            .x((d) => {
              const xPos = xScale(d.x);
              // Horizontal noise: varies by position along the line and scroll
              const noise = Math.sin(wave + d.x * 0.08 + linePhase) * 3
                          + Math.sin(wave * 1.3 + d.x * 0.15 + linePhase * 0.7) * 2;
              return xPos + noise;
            })
            .y((d) => baseY - zScale(d.z))
            .curve(d3.curveBasis);

          const newD = jitteredLine(points) ?? "";
          svg.select(`.pulse-line-${index}`).attr("d", newD);
          svg.select(`.pulse-fill-${index}`).attr("d", newD);
        });
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [data, scrollProgress]);

  return (
    <motion.div
      className="fixed top-0 right-0 w-1/2 lg:w-2/5 h-screen pointer-events-none z-0"
      style={{ opacity }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      />
    </motion.div>
  );
}
