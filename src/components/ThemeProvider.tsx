import { useLocation } from "react-router-dom";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const theme = pathname.startsWith("/music") ? "theme-clarity" : "theme-flaherty";

  return (
    <div
      className={`${theme} min-h-screen`}
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      {children}
    </div>
  );
}
