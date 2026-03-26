import { hero } from "../../data/resume";

export function TechHero() {
  return (
    <section className="py-16 sm:py-24">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{hero.name}</h1>
      <p className="mt-2 text-lg sm:text-xl font-medium" style={{ color: "var(--color-accent)" }}>
        {hero.tagline}
      </p>
      <p className="mt-4 max-w-2xl text-base" style={{ color: "var(--color-text-muted)" }}>
        {hero.bio}
      </p>
      <button
        id="download-resume"
        className="mt-6 px-6 py-2.5 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--color-accent)" }}
      >
        Download Resume
      </button>
    </section>
  );
}
