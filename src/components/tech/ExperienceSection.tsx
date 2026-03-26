import { roles } from "../../data/resume";
import { ExperienceCard } from "./ExperienceCard";

export function ExperienceSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Experience</h2>
      <div className="space-y-4">
        {roles.map((role) => (
          <ExperienceCard key={`${role.company}-${role.dates}`} role={role} />
        ))}
      </div>
    </section>
  );
}
