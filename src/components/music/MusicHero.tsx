import { musicHero } from "../../data/music";

export function MusicHero() {
  return (
    <section className="py-16 sm:py-24">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{musicHero.name}</h1>
      <p className="mt-2 text-lg sm:text-xl font-medium" style={{ color: "var(--color-accent)" }}>
        {musicHero.tagline}
      </p>
      <p className="mt-4 max-w-2xl text-base" style={{ color: "var(--color-text-muted)" }}>
        {musicHero.bio}
      </p>
    </section>
  );
}
