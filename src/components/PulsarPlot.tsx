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

    // Momentum system with velocity cap, ease-in, and boundary coasting
    let smoothProgress = scrollProgress.get();
    let lastRawProgress = smoothProgress;
    let velocity = 0;
    let smoothVelocity = 0; // eased velocity (ramps up, doesn't snap)
    const maxVelocity = 0.003;  // tighter cap on max speed
    const easeIn = 0.2;         // faster ramp up
    const friction = 0.85;      // shorter coast

    const animate = () => {
      const rawProgress = scrollProgress.get();
      const rawDelta = rawProgress - lastRawProgress;
      lastRawProgress = rawProgress;

      const isScrolling = Math.abs(rawDelta) > 0.000005;

      if (isScrolling) {
        // Clamp raw velocity
        const clampedDelta = Math.max(-maxVelocity, Math.min(maxVelocity, rawDelta));
        // Ease into the target velocity (don't snap to it)
        smoothVelocity += (clampedDelta - smoothVelocity) * easeIn;
        velocity = smoothVelocity;
        // Apply capped velocity only — no uncapped chase term
        smoothProgress += velocity;
      } else {
        // Coast — decay velocity, ease smoothVelocity to zero too
        velocity *= friction;
        smoothVelocity *= friction;
        smoothProgress += velocity;
      }

      // Soft clamp — allow coast to finish naturally near boundaries
      if (smoothProgress < 0) {
        smoothProgress = 0;
        if (velocity < 0) velocity = 0;
      }
      if (smoothProgress > 1) {
        smoothProgress = 1;
        if (velocity > 0) velocity = 0;
      }
      const progress = smoothProgress;

      pathEls.forEach(({ baseY, fillPath, strokePath, rate, offset }) => {
        const obsRaw = (progress * totalObservations * 3 * rate + offset) % totalObservations;
        const obsFloat = obsRaw < 0 ? obsRaw + totalObservations : obsRaw;
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
