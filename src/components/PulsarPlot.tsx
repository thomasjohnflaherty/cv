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

  // Load CSV — keep ALL 80 pulse observations for cycling through
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
        // Keep ALL pulses — we'll cycle through them
        setPulses(Array.from(grouped.values()));
      });
  }, []);

  useEffect(() => {
    if (!pulses.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const displayLines = 40; // show 40 lines on screen
    const totalObservations = pulses.length; // 80 different pulse observations to cycle through
    const lineSpacing = height / (displayLines + 4);
    const plotWidth = lineSpacing * displayLines * 0.7;
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

    // Each displayed line cycles through observations at a unique rate
    let rngState = 42;
    const rand = () => {
      rngState = (rngState * 16807) % 2147483647;
      return rngState / 2147483647;
    };

    // Each line gets a different cycling speed and starting observation
    const lineConfig = Array.from({ length: displayLines }, () => ({
      rate: 0.3 + rand() * 1.7,  // how fast this line cycles through observations
      offset: Math.floor(rand() * totalObservations), // starting observation
    }));

    // Pre-create path elements for display lines
    const pathEls = Array.from({ length: displayLines }, (_, i) => {
      const fillPath = svg.append("path")
        .attr("fill", "var(--color-bg)")
        .attr("stroke", "none");

      const strokePath = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "url(#pg)")
        .attr("stroke-width", 1);

      return { baseY: yBase(i), fillPath, strokePath, ...lineConfig[i] };
    });

    // Momentum system — smoothed progress that decays when scrolling stops
    let smoothProgress = scrollProgress.get();
    let velocity = 0;
    let lastRawProgress = smoothProgress;
    const friction = 0.95; // how slowly momentum decays (closer to 1 = longer coast)

    const animate = () => {
      const rawProgress = scrollProgress.get();

      // Calculate scroll velocity
      const delta = rawProgress - lastRawProgress;
      lastRawProgress = rawProgress;

      if (Math.abs(delta) > 0.00001) {
        // Actively scrolling — track velocity
        velocity = delta;
        smoothProgress = rawProgress;
      } else {
        // Not scrolling — coast with decaying velocity
        velocity *= friction;
        if (Math.abs(velocity) > 0.000001) {
          smoothProgress += velocity;
        }
      }

      const progress = smoothProgress;

      pathEls.forEach(({ baseY, fillPath, strokePath, rate, offset }) => {
        const obsFloat = (progress * totalObservations * 3 * rate + offset) % totalObservations;
        const obsA = Math.floor(obsFloat) % totalObservations;
        const obsB = (obsA + 1) % totalObservations;
        const t = obsFloat - Math.floor(obsFloat); // 0-1 blend between A and B

        const pointsA = pulses[obsA];
        const pointsB = pulses[obsB];

        const coords = pointsA.map((pA, j) => {
          const pB = pointsB[j];
          // Lerp between the two observations
          const z = pA.z * (1 - t) + pB.z * t;
          const px = xScale(pA.x);
          const py = baseY - zScale(z);
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
