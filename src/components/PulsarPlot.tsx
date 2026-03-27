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

  useEffect(() => { isMusicRef.current = isMusic; }, [isMusic]);

  // Track window resizes to trigger SVG rebuild
  const [resizeKey, setResizeKey] = useState(0);
  useEffect(() => {
    const handler = () => setResizeKey((k) => k + 1);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

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

  useEffect(() => {
    if (!pulses.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const displayLines = 25;
    const totalObs = pulses.length;
    const lineSpacing = height / displayLines;
    const plotWidth = height * 0.7;
    const xOffset = (width - plotWidth) / 2;

    const xScale = d3.scaleLinear().domain([1, 300]).range([xOffset, xOffset + plotWidth]);
    const yBase = (i: number) => lineSpacing * i;
    const zMax = 5;
    const zScale = d3.scaleLinear().domain([-2, zMax]).range([0, lineSpacing * 0.8]);

    // Two gradients — tech and music
    const defs = svg.append("defs");

    const techGrad = defs.append("linearGradient").attr("id", "pg-tech").attr("x1", "0%").attr("x2", "100%");
    techGrad.append("stop").attr("offset", "0%").attr("stop-color", "#2563eb").attr("stop-opacity", 0.7);
    techGrad.append("stop").attr("offset", "40%").attr("stop-color", "#7c3aed").attr("stop-opacity", 0.8);
    techGrad.append("stop").attr("offset", "60%").attr("stop-color", "#a78bfa").attr("stop-opacity", 0.7);
    techGrad.append("stop").attr("offset", "100%").attr("stop-color", "#2563eb").attr("stop-opacity", 0.5);

    const musicGrad = defs.append("linearGradient").attr("id", "pg-music").attr("x1", "0%").attr("x2", "100%");
    musicGrad.append("stop").attr("offset", "0%").attr("stop-color", "#ffffff").attr("stop-opacity", 0.6);
    musicGrad.append("stop").attr("offset", "40%").attr("stop-color", "#ffffff").attr("stop-opacity", 0.6);
    musicGrad.append("stop").attr("offset", "60%").attr("stop-color", "#ffffff").attr("stop-opacity", 0.5);
    musicGrad.append("stop").attr("offset", "100%").attr("stop-color", "#ffffff").attr("stop-opacity", 0.4);

    const lineGen = d3.line<number[]>()
      .x((d) => d[0]).y((d) => d[1]).curve(d3.curveBasis);

    const areaGen = d3.area<number[]>()
      .x((d) => d[0]).y0((d) => d[2]).y1((d) => d[1]).curve(d3.curveBasis);

    let rngState = 42;
    const rand = () => { rngState = (rngState * 16807) % 2147483647; return rngState / 2147483647; };

    const lineConfig = Array.from({ length: displayLines }, () => ({
      rate: 0.3 + rand() * 1.7,
      offset: Math.floor(rand() * totalObs),
      xDriftRate: (rand() - 0.5) * 2,
      xDriftAmp: 8 + rand() * 20,
    }));

    const pathEls = Array.from({ length: displayLines }, (_, i) => {
      const fillPath = svg.append("path").attr("stroke", "none");
      const strokePath = svg.append("path").attr("fill", "none").attr("stroke-width", 1);
      return { baseY: yBase(i), fillPath, strokePath, ...lineConfig[i] };
    });

    let smoothProgress = scrollProgress.get();
    let lastRendered = -1;

    const animate = () => {
      const raw = scrollProgress.get();

      // Ease toward raw — smoothProgress chases it with slight lag
      smoothProgress += (raw - smoothProgress) * 0.15;

      // Skip frame if nothing visually changed
      if (Math.abs(smoothProgress - lastRendered) < 0.000005) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      lastRendered = smoothProgress;

      const progress = smoothProgress;
      const music = isMusicRef.current;
      const fillColor = music ? "#0a0a0a" : "#fafafa";
      const gradId = music ? "url(#pg-music)" : "url(#pg-tech)";

      pathEls.forEach(({ baseY, fillPath, strokePath, rate, offset, xDriftRate, xDriftAmp }) => {
        const obsRaw = (progress * totalObs * 1.5 * rate + offset) % totalObs;
        const obsFloat = obsRaw < 0 ? obsRaw + totalObs : obsRaw;
        const obsA = Math.floor(obsFloat) % totalObs;
        const obsB = (obsA + 1) % totalObs;
        const t = obsFloat - Math.floor(obsFloat);

        const pointsA = pulses[obsA];
        const pointsB = pulses[obsB];
        const xShiftBase = Math.sin(progress * 20 * xDriftRate) * xDriftAmp;

        const coords = pointsA.map((pA, j) => {
          const pB = pointsB[j];
          const z = pA.z * (1 - t) + pB.z * t;
          // Taper x-shift to zero at edges — endpoints stay pinned
          const edgeFactor = Math.sin((pA.x / 300) * Math.PI); // 0 at edges, 1 in middle
          const xShift = xShiftBase * edgeFactor;
          return [xScale(pA.x + xShift), baseY - zScale(z), baseY + lineSpacing * 1.2];
        });

        fillPath.attr("fill", fillColor).attr("d", areaGen(coords));
        strokePath.attr("stroke", gradId).attr("d", lineGen(coords));
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [pulses, scrollProgress, resizeKey]);

  return (
    <div
      className="fixed pointer-events-none z-0"
      style={{
        top: "-5%",
        left: "-12%",
        width: "55%",
        height: "110%",
        opacity: 0.7,
        maskImage: "linear-gradient(to right, black 30%, transparent 85%)",
        WebkitMaskImage: "linear-gradient(to right, black 30%, transparent 85%)",
      }}
    >
      <svg ref={svgRef} className="w-full h-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
