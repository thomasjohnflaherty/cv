import { useRef } from "react";
import { musicHero } from "../../data/music";
import { useFluidText } from "../../hooks/useFluidText";

export function MusicHero() {
  const nameRef = useRef<HTMLDivElement>(null);
  const nameSize = useFluidText(musicHero.name, "'Fraunces', Georgia, serif", nameRef, { minSize: 32, maxSize: 120, fontWeight: 300 });

  return (
    <section className="py-16 sm:py-24">
      <div ref={nameRef}>
        <h1 style={{ fontSize: `${nameSize}px`, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{musicHero.name}</h1>
      </div>
      <p className="mt-2 text-lg sm:text-xl font-medium" style={{ color: "var(--color-accent)" }}>
        {musicHero.tagline}
      </p>
      <p className="mt-4 max-w-2xl text-base" style={{ color: "var(--color-text-muted)" }}>
        {musicHero.bio}
      </p>
    </section>
  );
}
