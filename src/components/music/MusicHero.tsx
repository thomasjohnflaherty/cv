import { useRef } from "react";
import { musicHero } from "../../data/music";
import { useFluidText } from "../../hooks/useFluidText";
import { GlitchText } from "../GlitchText";

export function MusicHero({ isMusic }: { isMusic: boolean }) {
  const nameRef = useRef<HTMLDivElement>(null);
  const nameSize = useFluidText(musicHero.name, "'Fraunces', Georgia, serif", nameRef, { minSize: 32, maxSize: 120, fontWeight: 300 });

  return (
    <section className="py-16 sm:py-24">
      <div ref={nameRef}>
        {isMusic ? (
          <GlitchText
            text={musicHero.name}
            fontFamily="'Fraunces', Georgia, serif"
            fontSize={nameSize}
            color="#e5e5e5"
          />
        ) : (
          <h1 style={{ fontSize: `${nameSize}px`, letterSpacing: "-0.02em", lineHeight: 1.1, visibility: "hidden" }}>
            {musicHero.name}
          </h1>
        )}
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
