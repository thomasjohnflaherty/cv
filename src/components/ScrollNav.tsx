import { useState, useEffect } from "react";
import { motion, useTransform } from "framer-motion";
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

  const bgColor = useTransform(
    scrollProgress,
    [0.3, 0.5],
    ["rgba(250, 250, 250, 0.8)", "rgba(10, 10, 10, 0.8)"]
  );
  const borderColor = useTransform(
    scrollProgress,
    [0.3, 0.5],
    ["#e5e7eb", "#2a2a2a"]
  );
  const textColor = useTransform(
    scrollProgress,
    [0.3, 0.5],
    ["#6b7280", "#9ca3af"]
  );
  const accentColor = useTransform(
    scrollProgress,
    [0.3, 0.5],
    ["#2563eb", "#a78bfa"]
  );

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
      className="sticky top-0 z-50 border-b backdrop-blur-sm"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm tracking-wide transition-colors bg-transparent border-none cursor-pointer"
              style={{
                color: activeSection === item.id ? accentColor : textColor,
                fontWeight: activeSection === item.id ? 700 : 400,
              }}
            >
              {item.label}
            </motion.button>
          ))}
        </div>
        <motion.button
          className="md:hidden p-2 bg-transparent border-none cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ color: textColor }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </motion.button>
      </div>
      {menuOpen && (
        <motion.div
          className="md:hidden border-t px-4 py-4 flex flex-col gap-4"
          style={{ borderColor: borderColor }}
        >
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm tracking-wide text-left bg-transparent border-none cursor-pointer"
              style={{
                color: activeSection === item.id ? accentColor : textColor,
                fontWeight: activeSection === item.id ? 700 : 400,
              }}
            >
              {item.label}
            </motion.button>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
}
