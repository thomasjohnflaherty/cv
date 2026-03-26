import { TechHero } from "../components/tech/TechHero";
import { ExperienceSection } from "../components/tech/ExperienceSection";
import { SkillsGrid } from "../components/tech/SkillsGrid";
import { EducationSection } from "../components/tech/EducationSection";

export function TechPage() {
  return (
    <main className="max-w-3xl mx-auto px-4">
      <TechHero />
      <div className="space-y-16 pb-16">
        <ExperienceSection />
        <SkillsGrid />
        <EducationSection />
      </div>
    </main>
  );
}
