import type { Role } from "../../data/resume";

export function ExperienceCard({ role, isLast }: { role: Role; isLast?: boolean }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-5 sm:gap-6">
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center">
        <div
          className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
          style={{
            backgroundColor: "var(--color-accent)",
            boxShadow: "0 0 0 4px var(--color-bg)",
          }}
        />
        {!isLast && (
          <div
            className="w-px flex-1 mt-1"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        )}
      </div>

      {/* Content */}
      <div className={isLast ? "" : "pb-8"}>
        <p
          className="text-xs font-medium tracking-wider"
          style={{ color: "var(--color-accent)", fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {role.dates}
        </p>
        <h3 className="mt-1">{role.title}</h3>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          {role.company} · {role.location}
        </p>
        <ul className="mt-3 space-y-1">
          {role.bullets.map((bullet, i) => (
            <li key={i} className="text-sm" style={{ color: "var(--color-text)" }}>
              {bullet}
            </li>
          ))}
        </ul>
        {role.tech && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {role.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-xs rounded"
                style={{
                  color: "var(--color-text-muted)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
