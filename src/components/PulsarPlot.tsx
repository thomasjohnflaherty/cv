import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { MotionValue } from "framer-motion";

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
    // Take every other pulse for cleaner look (40 lines instead of 80)
    const selectedPulses = pulses.filter((_, i) => i % 2 === 0);

    const xScale = d3.scaleLinear()
      .domain([1, 300])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, selectedPulses.length])
      .range([height * 0.15, height * 0.95]);

    const zScale = d3.scaleLinear()
      .domain([-2, d3.max(data, (d) => d.z) ?? 5])
      .range([0, height * 0.12]);

    // Create gradient
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "pulsar-gradient")
      .attr("x1", "0%").attr("x2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#2563eb").attr("stop-opacity", 0.6);
    gradient.append("stop").attr("offset", "40%").attr("stop-color", "#7c3aed").attr("stop-opacity", 0.8);
    gradient.append("stop").attr("offset", "70%").attr("stop-color", "#a78bfa").attr("stop-opacity", 0.7);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#2563eb").attr("stop-opacity", 0.5);

    const line = d3.line<DataPoint>()
      .x((d) => xScale(d.x))
      .curve(d3.curveBasis);

    // Draw each pulse line
    const paths = selectedPulses.map(([, points], i) => {
      const baseY = yScale(i);

      // Fill path (covers area below the line to create the overlap effect)
      svg.append("path")
        .datum(points)
        .attr("class", `pulse-fill pulse-fill-${i}`)
        .attr("d", line.y((d) => baseY - zScale(d.z))(points) ?? "")
        .attr("fill", "var(--color-bg)")
        .attr("stroke", "none");

      // Stroke path
      const path = svg.append("path")
        .datum(points)
        .attr("class", `pulse-line pulse-line-${i}`)
        .attr("d", line.y((d) => baseY - zScale(d.z))(points) ?? "")
        .attr("fill", "none")
        .attr("stroke", "url(#pulsar-gradient)")
        .attr("stroke-width", 1.2)
        .attr("opacity", 0.9);

      return { path, fill: svg.select(`.pulse-fill-${i}`), points, index: i, baseY };
    });

    // Scroll-driven animation: shift lines vertically based on scroll
    const animate = () => {
      const progress = scrollProgress.get();
      // Map scroll to a wave offset (0 to 2π over the scroll range 0-0.4)
      const wave = progress * Math.PI * 5;

      paths.forEach(({ points, index, baseY }) => {
        const offset = Math.sin(wave + index * 0.3) * 4;
        const newBaseY = baseY + offset;

        const newD = line.y((d) => newBaseY - zScale(d.z))(points) ?? "";

        svg.select(`.pulse-line-${index}`).attr("d", newD);
        svg.select(`.pulse-fill-${index}`).attr("d", newD);
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [data, scrollProgress]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      style={{ opacity: 0.7 }}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
