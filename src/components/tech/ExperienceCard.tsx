import type { Role } from "../../data/resume";

export function ExperienceCard({ role }: { role: Role }) {
  return (
    <div className="p-6 rounded-lg border" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
      <h3 className="font-semibold text-lg">{role.title}</h3>
      <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
        {role.company} · {role.dates} · {role.location}
      </p>
      <ul className="mt-3 space-y-1.5">
        {role.bullets.map((bullet, i) => (
          <li key={i} className="text-sm flex gap-2" style={{ color: "var(--color-text)" }}>
            <span style={{ color: "var(--color-accent)" }}>·</span>
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  );
}
