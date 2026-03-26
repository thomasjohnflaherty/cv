export function Footer() {
  const links = [
    { label: "LinkedIn", href: "https://linkedin.com/in/thomasjohnflaherty" },
    { label: "GitHub", href: "https://github.com/thomasflaherty" },
  ];

  return (
    <footer
      className="border-t py-8 mt-16"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Thom Flaherty
        </p>
        <div className="flex gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
              style={{ color: "var(--color-accent)" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
