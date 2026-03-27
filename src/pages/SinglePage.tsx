import { useState, useEffect } from "react";
import { useScroll } from "framer-motion";
import { usePDF } from "react-to-pdf";

import { THEME_MIDPOINT, colors } from "../utils/motion";
import { ScrollNav } from "../components/ScrollNav";
import { PulsarPlot } from "../components/PulsarPlot";

import { ScrollSection } from "../components/ScrollSection";
import { ResumeDocument } from "../components/ResumeDocument";

import { ExperienceSection } from "../components/tech/ExperienceSection";
import { SkillsGrid } from "../components/tech/SkillsGrid";
import { EducationSection } from "../components/tech/EducationSection";
import { MusicHero } from "../components/music/MusicHero";
import { WorkSection } from "../components/music/WorkSection";
import { ServicesSection } from "../components/music/ServicesSection";

import { hero } from "../data/resume";
import { platforms } from "../data/music";

export function SinglePage() {
  const { scrollYProgress } = useScroll();
  const [submitted, setSubmitted] = useState(false);
  const [isMusic, setIsMusic] = useState(false);

  // Binary theme switch — no interpolation, no grey
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setIsMusic(v >= THEME_MIDPOINT);
    });
    return unsub;
  }, [scrollYProgress]);

  const theme = isMusic ? colors.clarity : colors.flaherty;

  const { toPDF, targetRef } = usePDF({
    filename: "Thom_Flaherty_Resume.pdf",
    page: { format: "letter" },
  });

  useEffect(() => {
    document.title = "Thom Flaherty / Thom Clarity";
  }, []);

  // Apply CSS custom properties from binary theme
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--color-bg", theme.bg);
    root.setProperty("--color-text", theme.text);
    root.setProperty("--color-text-muted", theme.textMuted);
    root.setProperty("--color-accent", theme.accent);
    root.setProperty("--color-surface", theme.surface);
    root.setProperty("--color-border", theme.border);
  }, [theme]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <a
        href="#tech-hero"
        className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:text-sm"
        style={{ backgroundColor: "var(--color-accent)", color: "#ffffff" }}
      >
        Skip to content
      </a>
      <PulsarPlot scrollProgress={scrollYProgress} isMusic={isMusic} />
      <ScrollNav scrollProgress={scrollYProgress} />

      <main className="max-w-3xl mx-auto px-4 relative z-10">
        {/* ===== TECH SECTION ===== */}
        <ScrollSection id="tech-hero">
          <section className="py-16 sm:py-24">
            <h1 className="text-5xl sm:text-7xl tracking-tight">{hero.name}</h1>
            <p className="mt-2 text-lg sm:text-xl font-medium" style={{ color: "var(--color-accent)" }}>
              {hero.tagline}
            </p>
            <p className="mt-4 max-w-2xl text-base" style={{ color: "var(--color-text-muted)" }}>
              {hero.bio}
            </p>
            <button
              onClick={() => toPDF()}
              className="mt-6 px-6 py-2.5 rounded-md text-sm font-medium text-white transition-colors hover:opacity-90 border-none cursor-pointer"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              Download Resume
            </button>
          </section>
        </ScrollSection>

        <div className="space-y-16 pb-16">
          <ScrollSection id="experience">
            <ExperienceSection />
          </ScrollSection>

          <ScrollSection id="skills">
            <SkillsGrid />
          </ScrollSection>

          <ScrollSection id="education">
            <EducationSection />
          </ScrollSection>
        </div>

        {/* ===== TRANSITION ZONE ===== */}
        <div className="py-32 flex items-center justify-center">
          <div className="w-full">
            <div
              className="h-px w-full transition-colors duration-300"
              style={{ background: "linear-gradient(to right, transparent, var(--color-accent), transparent)" }}
            />
          </div>
        </div>

        {/* ===== MUSIC SECTION ===== */}
        <ScrollSection id="music-hero">
          <MusicHero />
        </ScrollSection>

        <div className="space-y-16 pb-16">
          <ScrollSection id="youtube">
            <WorkSection youtubeVideoId="yS2uzPJ7OO4" />
          </ScrollSection>

          <ScrollSection id="services">
            <ServicesSection />
          </ScrollSection>

          <ScrollSection id="platforms">
            <section className="flex flex-wrap gap-4">
              {platforms.map((p) => (
                <a
                  key={p.label}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.label} (opens in new tab)`}
                  className="text-sm font-medium hover:underline transition-colors"
                  style={{ color: "var(--color-accent)" }}
                >
                  {p.label}
                </a>
              ))}
            </section>
          </ScrollSection>

          {/* ===== CONTACT ===== */}
          <ScrollSection id="contact">
            <section className="py-16">
              {submitted ? (
                <div className="text-center">
                  <h2 className="text-3xl">Thanks!</h2>
                  <p className="mt-2" style={{ color: "var(--color-text-muted)" }}>
                    I'll get back to you soon.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl mb-2">Get in Touch</h2>
                  <p className="mb-8" style={{ color: "var(--color-text-muted)" }}>
                    Whether it's a tech opportunity or a music collaboration, I'd love to hear from you.
                  </p>

                  <form
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const formData = new FormData(form);
                      const body = new URLSearchParams();
                      formData.forEach((value, key) => body.append(key, value as string));
                      fetch("/", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: body.toString(),
                      })
                        .then(() => setSubmitted(true))
                        .catch(() => alert("Something went wrong. Please try again or email me directly."));
                    }}
                  >
                    <input type="hidden" name="form-name" value="contact" />
                    <p className="hidden">
                      <label>
                        Don't fill this out: <input name="bot-field" />
                      </label>
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                        <input
                          type="text" id="name" name="name" required
                          className="w-full px-3 py-2 rounded-md border text-sm transition-colors"
                          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input
                          type="email" id="email" name="email" required
                          className="w-full px-3 py-2 rounded-md border text-sm transition-colors"
                          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                          id="message" name="message" rows={5} required
                          className="w-full px-3 py-2 rounded-md border text-sm resize-y transition-colors"
                          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-md text-sm font-medium text-white transition-colors hover:opacity-90 border-none cursor-pointer"
                        style={{ backgroundColor: "var(--color-accent)" }}
                      >
                        Send
                      </button>
                    </div>
                  </form>

                </>
              )}
            </section>
          </ScrollSection>
        </div>

        {/* Footer */}
        <footer
          className="border-t py-8 mb-8 transition-colors duration-300"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Thom Flaherty / Thom Clarity
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com/in/thomasjohnflaherty" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in new tab)" className="text-sm hover:underline transition-colors" style={{ color: "var(--color-accent)" }}>LinkedIn</a>
              <a href="https://github.com/thomasflaherty" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in new tab)" className="text-sm hover:underline transition-colors" style={{ color: "var(--color-accent)" }}>GitHub</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Hidden resume for PDF export */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={targetRef}>
          <ResumeDocument />
        </div>
      </div>
    </div>
  );
}
