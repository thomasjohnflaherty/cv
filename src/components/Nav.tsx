import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export function Nav() {
  const { pathname } = useLocation();
  const isMusic = pathname.startsWith("/music");
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: "/", label: "Thom Flaherty", active: !isMusic && pathname !== "/contact" },
    { to: "/music", label: "Thom Clarity", active: isMusic },
    { to: "/contact", label: "Contact", active: pathname === "/contact" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-sm"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "color-mix(in srgb, var(--color-bg) 80%, transparent)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm tracking-wide transition-colors"
              style={{
                color: item.active ? "var(--color-accent)" : "var(--color-text-muted)",
                fontWeight: item.active ? 700 : 400,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{ color: "var(--color-text)" }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-4" style={{ borderColor: "var(--color-border)" }}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-wide"
              style={{
                color: item.active ? "var(--color-accent)" : "var(--color-text-muted)",
                fontWeight: item.active ? 700 : 400,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
