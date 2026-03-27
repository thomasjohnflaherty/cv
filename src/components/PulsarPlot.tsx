import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { MotionValue } from "framer-motion";

interface PulsarPlotProps {
  scrollProgress: MotionValue<number>;
  isMusic: boolean;
}

interface DataPoint {
  x: number;
  z: number;
}

export function PulsarPlot({ scrollProgress, isMusic }: PulsarPlotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pulses, setPulses] = useState<DataPoint[][]>([]);
  const animRef = useRef<number>(0);
  const isMusicRef = useRef(isMusic);

  // Keep ref in sync so the animation loop sees the latest value without rebuilding
  useEffect(() => {
    isMusicRef.current = isMusic;
  }, [isMusic]);

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
        setPulses(Array.from(grouped.values()));
      });
  }, []);

  // Build SVG once, animate via rAF — gradient and fill colors update every frame
  useEffect(() => {
    if (!pulses.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const displayLines = 40;
    const totalObservations = pulses.length;
    const lineSpacing = height / (displayLines + 4);
    const plotWidth = lineSpacing * displayLines * 0.7;
    const xOffset = (width - plotWidth) / 2;

    const xScale = d3.scaleLinear().domain([1, 300]).range([xOffset, xOffset + plotWidth]);
    const yBase = (i: number) => lineSpacing * (i + 2);
    const zMax = 5;
    const zScale = d3.scaleLinear().domain([-2, zMax]).range([0, lineSpacing * 0.8]);

    // Gradient — stops will be updated every frame
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient").attr("id", "pg").attr("x1", "0%").attr("x2", "100%");
    const stops = [
      gradient.append("stop").attr("offset", "0%"),
      gradient.append("stop").attr("offset", "30%"),
      gradient.append("stop").attr("offset", "50%"),
      gradient.append("stop").attr("offset", "70%"),
      gradient.append("stop").attr("offset", "100%"),
    ];

    const lineGen = d3.line<number[]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .curve(d3.curveBasis);

    const areaGen = d3.area<number[]>()
      .x((d) => d[0])
      .y0((d) => d[2])
      .y1((d) => d[1])
      .curve(d3.curveBasis);

    // Line config
    let rngState = 42;
    const rand = () => {
      rngState = (rngState * 16807) % 2147483647;
      return rngState / 2147483647;
    };

    const lineConfig = Array.from({ length: displayLines }, () => ({
      rate: 0.3 + rand() * 1.7,
      offset: Math.floor(rand() * totalObservations),
      xDriftRate: (rand() - 0.5) * 2,
      xDriftAmp: 8 + rand() * 20,
    }));

    const pathEls = Array.from({ length: displayLines }, (_, i) => {
      const fillPath = svg.append("path").attr("stroke", "none");
      const strokePath = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "url(#pg)")
        .attr("stroke-width", 1);
      return { baseY: yBase(i), fillPath, strokePath, ...lineConfig[i] };
    });

    // Momentum system
    let smoothProgress = scrollProgress.get();
    let lastRawProgress = smoothProgress;
    let velocity = 0;
    let smoothVelocity = 0;
    const maxVelocity = 0.001;
    const easeIn = 0.2;
    const friction = 0.85;

    const animate = () => {
      const rawProgress = scrollProgress.get();
      const rawDelta = rawProgress - lastRawProgress;
      lastRawProgress = rawProgress;

      const isScrolling = Math.abs(rawDelta) > 0.000005;
      if (isScrolling) {
        const clampedDelta = Math.max(-maxVelocity, Math.min(maxVelocity, rawDelta));
        smoothVelocity += (clampedDelta - smoothVelocity) * easeIn;
        velocity = smoothVelocity;
        smoothProgress += velocity;
      } else {
        velocity *= friction;
        smoothVelocity *= friction;
        smoothProgress += velocity;
      }
      if (smoothProgress < 0) { smoothProgress = 0; if (velocity < 0) velocity = 0; }
      if (smoothProgress > 1) { smoothProgress = 1; if (velocity > 0) velocity = 0; }

      const progress = smoothProgress;
      const music = isMusicRef.current;

      // Update gradient colors every frame — instant switch, no rebuild
      const bgColor = music ? "#0a0a0a" : "#fafafa";
      if (music) {
        const opacities = [0.1, 0.5, 0.7, 0.5, 0.1];
        stops.forEach((s, i) => s.attr("stop-color", "#ffffff").attr("stop-opacity", opacities[i]));
      } else {
        const techColors = ["#2563eb", "#3b82f6", "#7c3aed", "#a78bfa", "#2563eb"];
        const techOpacities = [0.15, 0.6, 0.8, 0.6, 0.15];
        stops.forEach((s, i) => s.attr("stop-color", techColors[i]).attr("stop-opacity", techOpacities[i]));
      }

      pathEls.forEach(({ baseY, fillPath, strokePath, rate, offset, xDriftRate, xDriftAmp }) => {
        const obsRaw = (progress * totalObservations * 3 * rate + offset) % totalObservations;
        const obsFloat = obsRaw < 0 ? obsRaw + totalObservations : obsRaw;
        const obsA = Math.floor(obsFloat) % totalObservations;
        const obsB = (obsA + 1) % totalObservations;
        const t = obsFloat - Math.floor(obsFloat);

        const pointsA = pulses[obsA];
        const pointsB = pulses[obsB];

        const xShift = Math.sin(progress * 20 * xDriftRate) * xDriftAmp;

        const coords = pointsA.map((pA, j) => {
          const pB = pointsB[j];
          const z = pA.z * (1 - t) + pB.z * t;
          const px = xScale(pA.x + xShift);
          const py = baseY - zScale(z);
          return [px, py, baseY + lineSpacing * 1.2];
        });

        // Update fill color every frame to match background
        fillPath.attr("fill", bgColor);
        fillPath.attr("d", areaGen(coords));
        strokePath.attr("d", lineGen(coords));
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [pulses, scrollProgress]);

  return (
    <div
      className="fixed top-0 right-0 w-1/2 lg:w-2/5 h-screen pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    >
      <svg ref={svgRef} className="w-full h-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
