// Shared animation constants
export const ease: [number, number, number, number] = [0, 0, 0.2, 1];

// Theme transition scroll breakpoints — very tight snap, no muddy grey zone
export const THEME_TRANSITION: [number, number] = [0.39, 0.41];
export const THEME_MIDPOINT = 0.40;

// Color palettes
export const colors = {
  flaherty: {
    bg: "#fafafa",
    surface: "#ffffff",
    text: "#1a1a2e",
    textMuted: "#6b7280",
    accent: "#2563eb",
    border: "#e5e7eb",
  },
  clarity: {
    bg: "#0a0a0a",
    surface: "#1a1a1a",
    text: "#e5e5e5",
    textMuted: "#9ca3af",
    accent: "#a78bfa",
    border: "#2a2a2a",
  },
} as const;
