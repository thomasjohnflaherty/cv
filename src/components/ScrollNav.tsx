import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { THEME_MIDPOINT } from "../utils/motion";
import { MorphText } from "./MorphText";

interface ScrollNavProps {
  scrollProgress: MotionValue<number>;
}

export function ScrollNav({ scrollProgress }: ScrollNavProps) {
  const [isMusic, setIsMusic] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [morphProgress, setMorphProgress] = useState(0);

  // Track scroll for theme switch and morph progress
  useEffect(() => {
    const unsub = scrollProgress.on("change", (v) => {
      setIsMusic(v >= THEME_MIDPOINT);
      // Morph over a narrow range around the midpoint (5% window)
      const morphStart = THEME_MIDPOINT - 0.025;
      const morphEnd = THEME_MIDPOINT + 0.025;
      const p = Math.max(0, Math.min(1, (v - morphStart) / (morphEnd - morphStart)));
      setMorphProgress(p);
    });
    return unsub;
  }, [scrollProgress]);

  // Close mobile menu on scroll
  useEffect(() => {
    const handler = () => setMenuOpen(false);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const identityName = isMusic ? "Thom Clarity" : "Thom Flaherty";
  const otherLabel = isMusic ? "Technology" : "Music";
  const otherId = isMusic ? "tech" : "music";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300"
      style={{
        backgroundColor: isMusic ? "rgba(10, 10, 10, 0.85)" : "rgba(250, 250, 250, 0.85)",
      }}
    >
      <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 h-14 flex items-center justify-between">
        {/* Desktop nav */}
        <div className="hidden md:flex items-center w-full justify-between">
          <button
            onClick={() => scrollTo(isMusic ? "music" : "tech")}
            className="bg-transparent border-none cursor-pointer"
            style={{ width: "200px" }}
          >
            <MorphText
              from="Thom Flaherty"
              to="Thom Clarity"
              progress={morphProgress}
              fontFamily="'Fraunces', Georgia, serif"
              fontSize={18}
              fontWeight={500}
              color={isMusic ? "#a78bfa" : "#2563eb"}
            />
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollTo(otherId)}
              className="text-sm tracking-wide bg-transparent border-none cursor-pointer transition-colors"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "'Fraunces', Georgia, serif",
              }}
            >
              {otherLabel}
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="text-sm tracking-wide bg-transparent border-none cursor-pointer transition-colors"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "'Fraunces', Georgia, serif",
              }}
            >
              Contact
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center w-full justify-between">
          <AnimatePresence mode="wait">
            <motion.span
              key={identityName}
              className="text-sm tracking-wide"
              style={{
                color: "var(--color-accent)",
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 500,
              }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              {identityName}
            </motion.span>
          </AnimatePresence>

          <button
            className="p-2 bg-transparent border-none cursor-pointer transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ color: "var(--color-text)" }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden px-4 pb-4 flex flex-col gap-3 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => scrollTo(otherId)}
              className="text-sm tracking-wide text-left bg-transparent border-none cursor-pointer py-1"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "'Fraunces', Georgia, serif",
              }}
            >
              {otherLabel}
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="text-sm tracking-wide text-left bg-transparent border-none cursor-pointer py-1"
              style={{
                color: "var(--color-text-muted)",
                fontFamily: "'Fraunces', Georgia, serif",
              }}
            >
              Contact
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
