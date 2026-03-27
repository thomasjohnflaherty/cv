import { useState, useEffect } from "react";
import { motion, useTransform, AnimatePresence } from "framer-motion";
import type { MotionValue } from "framer-motion";

interface ScrollNavProps {
  scrollProgress: MotionValue<number>;
}

export function ScrollNav({ scrollProgress }: ScrollNavProps) {
  const [isMusic, setIsMusic] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const bgColor = useTransform(
    scrollProgress,
    [0.38, 0.42],
    ["rgba(250, 250, 250, 0.85)", "rgba(10, 10, 10, 0.85)"]
  );
  const textColor = useTransform(
    scrollProgress,
    [0.38, 0.42],
    ["#6b7280", "#9ca3af"]
  );
  const accentColor = useTransform(
    scrollProgress,
    [0.38, 0.42],
    ["#2563eb", "#a78bfa"]
  );

  // Switch identity at the same point as the theme crossfade (0.40 scroll progress)
  useEffect(() => {
    const unsub = scrollProgress.on("change", (v) => {
      setIsMusic(v >= 0.40);
    });
    return unsub;
  }, [scrollProgress]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  // Identity name (bold, prominent)
  const identityName = isMusic ? "Thom Clarity" : "Thom Flaherty";
  // The "other side" link
  const otherLabel = isMusic ? "Technology" : "Music";
  const otherId = isMusic ? "tech-hero" : "music-hero";

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Desktop nav */}
        <div className="hidden md:flex items-center w-full justify-between">
          {/* Identity name — left side */}
          <AnimatePresence mode="wait">
            <motion.button
              key={identityName}
              onClick={() => scrollTo(isMusic ? "music-hero" : "tech-hero")}
              className="bg-transparent border-none cursor-pointer tracking-wide"
              style={{
                color: accentColor,
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 500,
                fontSize: "1.1rem",
              }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
            >
              {identityName}
            </motion.button>
          </AnimatePresence>

          {/* Links — right side */}
          <div className="flex items-center gap-6">
            <motion.button
              onClick={() => scrollTo(otherId)}
              className="text-sm tracking-wide bg-transparent border-none cursor-pointer"
              style={{
                color: textColor,
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 400,
              }}
            >
              {otherLabel}
            </motion.button>
            <motion.button
              onClick={() => scrollTo("contact")}
              className="text-sm tracking-wide bg-transparent border-none cursor-pointer"
              style={{
                color: textColor,
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 400,
              }}
            >
              Contact
            </motion.button>
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center w-full justify-between">
          <AnimatePresence mode="wait">
            <motion.span
              key={identityName}
              className="text-sm tracking-wide"
              style={{
                color: accentColor,
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

          <motion.button
            className="p-2 bg-transparent border-none cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ color: textColor }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden px-4 pb-4 flex flex-col gap-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              onClick={() => scrollTo(otherId)}
              className="text-sm tracking-wide text-left bg-transparent border-none cursor-pointer py-1"
              style={{
                color: textColor,
                fontFamily: "'Fraunces', Georgia, serif",
              }}
            >
              {otherLabel}
            </motion.button>
            <motion.button
              onClick={() => scrollTo("contact")}
              className="text-sm tracking-wide text-left bg-transparent border-none cursor-pointer py-1"
              style={{
                color: textColor,
                fontFamily: "'Fraunces', Georgia, serif",
              }}
            >
              Contact
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
