import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MusicHero } from "../components/music/MusicHero";
import { WorkSection } from "../components/music/WorkSection";
import { PressQuotes } from "../components/music/PressQuotes";
import { ServicesSection } from "../components/music/ServicesSection";
import { GearGallery } from "../components/music/GearGallery";
import { platforms } from "../data/music";

export function MusicPage() {
  useEffect(() => {
    document.title = "Thom Clarity — Electronic Music & Sound Design";
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-4">
      <MusicHero />
      <div className="space-y-16 pb-16">
        <WorkSection youtubeVideoId="" />
        <PressQuotes />
        <ServicesSection />
        <GearGallery />

        {/* Platforms / Follow */}
        <section className="flex gap-4">
          {platforms.map((p) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--color-accent)" }}
            >
              {p.label}
            </a>
          ))}
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <Link
            to="/contact"
            className="inline-block px-8 py-3 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Get in Touch
          </Link>
        </section>
      </div>
    </main>
  );
}
