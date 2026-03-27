import { useState, useEffect, useRef } from "react";
import { motion, useTransform, AnimatePresence } from "framer-motion";
import type { MotionValue } from "framer-motion";

interface ScrollNavProps {
  scrollProgress: MotionValue<number>;
}

const navItems = [
  { id: "tech-hero", label: "Thom Flaherty" },
  { id: "music-hero", label: "Thom Clarity" },
  { id: "contact", label: "Contact" },
];

export function ScrollNav({ scrollProgress }: ScrollNavProps) {
  const [activeSection, setActiveSection] = useState("tech-hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

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

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handler = () => {
      const current = window.scrollY;
      if (current < 100) {
        setVisible(true);
      } else if (current > lastScrollY.current + 10) {
        setVisible(false);
        setMenuOpen(false);
      } else if (current < lastScrollY.current - 10) {
        setVisible(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Track active section
  useEffect(() => {
    const sectionIds = ["contact", "music-hero", "tech-hero"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{ backgroundColor: bgColor }}
      animate={{
        y: visible ? 0 : -80,
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="relative px-4 py-2 text-sm tracking-wide bg-transparent border-none cursor-pointer"
              style={{
                color: activeSection === item.id ? accentColor : textColor,
                fontWeight: activeSection === item.id ? 600 : 400,
                fontFamily: "'Fraunces', Georgia, serif",
              }}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <motion.button
          className="md:hidden p-2 bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ color: textColor }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.path
                  key="close"
                  d="M6 6l12 12M6 18L18 6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.path
                  key="menu"
                  d="M4 6h16M4 12h16M4 18h16"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  exit={{ pathLength: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>
          </svg>
        </motion.button>
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
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm tracking-wide text-left bg-transparent border-none cursor-pointer py-1"
                style={{
                  color: activeSection === item.id ? accentColor : textColor,
                  fontWeight: activeSection === item.id ? 600 : 400,
                  fontFamily: "'Fraunces', Georgia, serif",
                }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
