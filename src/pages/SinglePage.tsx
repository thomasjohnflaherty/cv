import { useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { usePDF } from "react-to-pdf";

import { THEME_TRANSITION, colors } from "../utils/motion";
import { ScrollNav } from "../components/ScrollNav";

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

  // Quick snap transition — avoid the muddy middle ground
  const bgColor = useTransform(scrollYProgress, THEME_TRANSITION, [colors.flaherty.bg, colors.clarity.bg]);
  const textColor = useTransform(scrollYProgress, THEME_TRANSITION, [colors.flaherty.text, colors.clarity.text]);
  const textMutedColor = useTransform(scrollYProgress, THEME_TRANSITION, [colors.flaherty.textMuted, colors.clarity.textMuted]);
  const accentColor = useTransform(scrollYProgress, THEME_TRANSITION, [colors.flaherty.accent, colors.clarity.accent]);
  const surfaceColor = useTransform(scrollYProgress, THEME_TRANSITION, [colors.flaherty.surface, colors.clarity.surface]);
  const borderColor = useTransform(scrollYProgress, THEME_TRANSITION, [colors.flaherty.border, colors.clarity.border]);

  const { toPDF, targetRef } = usePDF({
    filename: "Thom_Flaherty_Resume.pdf",
    page: { format: "letter" },
  });

  useEffect(() => {
    document.title = "Thom Flaherty / Thom Clarity";
  }, []);

  // Apply CSS custom properties from scroll-driven motion values
  useEffect(() => {
    const unsubscribers = [
      bgColor.on("change", (v) => document.documentElement.style.setProperty("--color-bg", v)),
      textColor.on("change", (v) => document.documentElement.style.setProperty("--color-text", v)),
      textMutedColor.on("change", (v) => document.documentElement.style.setProperty("--color-text-muted", v)),
      accentColor.on("change", (v) => document.documentElement.style.setProperty("--color-accent", v)),
      surfaceColor.on("change", (v) => document.documentElement.style.setProperty("--color-surface", v)),
      borderColor.on("change", (v) => document.documentElement.style.setProperty("--color-border", v)),
    ];
    return () => unsubscribers.forEach((unsub) => unsub());
  }, [bgColor, textColor, textMutedColor, accentColor, surfaceColor, borderColor]);

  return (
    <motion.div
      className="min-h-screen"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <a
        href="#tech-hero"
        className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:text-sm"
        style={{ backgroundColor: "var(--color-accent)", color: "#ffffff" }}
      >
        Skip to content
      </a>
      <ScrollNav scrollProgress={scrollYProgress} />

      <main className="max-w-3xl mx-auto px-4 relative z-10">
        {/* ===== TECH SECTION ===== */}
        <ScrollSection id="tech-hero">
          <section className="py-16 sm:py-24">
            <h1 className="text-5xl sm:text-7xl tracking-tight">{hero.name}</h1>
            <motion.p
              className="mt-2 text-lg sm:text-xl font-medium"
              style={{ color: accentColor }}
            >
              {hero.tagline}
            </motion.p>
            <motion.p
              className="mt-4 max-w-2xl text-base"
              style={{ color: textMutedColor }}
            >
              {hero.bio}
            </motion.p>
            <motion.button
              onClick={() => toPDF()}
              className="mt-6 px-6 py-2.5 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90 border-none cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              Download Resume
            </motion.button>
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
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            viewport={{ once: true }}
          >
            <div
              className="h-px w-full"
              style={{ background: "linear-gradient(to right, transparent, var(--color-accent), transparent)" }}
            />
          </motion.div>
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
                <motion.a
                  key={p.label}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.label} (opens in new tab)`}
                  className="text-sm font-medium hover:underline"
                  style={{ color: accentColor }}
                >
                  {p.label}
                </motion.a>
              ))}
            </section>
          </ScrollSection>

          {/* ===== CONTACT ===== */}
          <ScrollSection id="contact">
            <section className="py-16">
              {submitted ? (
                <div className="text-center">
                  <h2 className="text-3xl">Thanks!</h2>
                  <motion.p className="mt-2" style={{ color: textMutedColor }}>
                    I'll get back to you soon.
                  </motion.p>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl mb-2">Get in Touch</h2>
                  <motion.p className="mb-8" style={{ color: textMutedColor }}>
                    Whether it's a tech opportunity or a music collaboration, I'd love to hear from you.
                  </motion.p>

                  <form
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const data = new FormData(form);
                      const body = new URLSearchParams();
                      data.forEach((value, key) => body.append(key, value as string));
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
                        <motion.input
                          type="text" id="name" name="name" required
                          className="w-full px-3 py-2 rounded-md border text-sm"
                          style={{ backgroundColor: surfaceColor, borderColor: borderColor, color: textColor }}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <motion.input
                          type="email" id="email" name="email" required
                          className="w-full px-3 py-2 rounded-md border text-sm"
                          style={{ backgroundColor: surfaceColor, borderColor: borderColor, color: textColor }}
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                        <motion.textarea
                          id="message" name="message" rows={5} required
                          className="w-full px-3 py-2 rounded-md border text-sm resize-y"
                          style={{ backgroundColor: surfaceColor, borderColor: borderColor, color: textColor }}
                        />
                      </div>
                      <motion.button
                        type="submit"
                        className="px-6 py-2.5 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90 border-none cursor-pointer"
                        style={{ backgroundColor: accentColor }}
                      >
                        Send
                      </motion.button>
                    </div>
                  </form>

                </>
              )}
            </section>
          </ScrollSection>
        </div>

        {/* Footer */}
        <motion.footer
          className="border-t py-8 mb-8"
          style={{ borderColor: borderColor }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.p className="text-sm" style={{ color: textMutedColor }}>
              Thom Flaherty / Thom Clarity
            </motion.p>
            <div className="flex gap-4">
              <motion.a href="https://linkedin.com/in/thomasjohnflaherty" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in new tab)" className="text-sm hover:underline" style={{ color: accentColor }}>LinkedIn</motion.a>
              <motion.a href="https://github.com/thomasflaherty" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in new tab)" className="text-sm hover:underline" style={{ color: accentColor }}>GitHub</motion.a>
            </div>
          </div>
        </motion.footer>
      </main>

      {/* Hidden resume for PDF export */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={targetRef}>
          <ResumeDocument />
        </div>
      </div>
    </motion.div>
  );
}
