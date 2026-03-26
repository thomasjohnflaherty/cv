import { useEffect, useState } from "react";
import { useMotionValue, useTransform, motion } from "framer-motion";

export function CursorGlow({ scrollProgress }: { scrollProgress: ReturnType<typeof useMotionValue<number>> }) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const glowColor = useTransform(
    scrollProgress,
    [0.3, 0.5],
    ["rgba(37, 99, 235, 0.12)", "rgba(167, 139, 250, 0.12)"]
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 0,
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: useTransform(glowColor, (c) => `radial-gradient(circle, ${c} 0%, transparent 70%)`),
        transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
        top: 0,
        left: 0,
      }}
    />
  );
}
