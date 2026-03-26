import { skills } from "../../data/resume";

function SkillPill({ label }: { label: string }) {
  return (
    <span className="px-3 py-1.5 rounded-full text-sm font-medium border" style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
      {label}
    </span>
  );
}

export function SkillsGrid() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Skills</h2>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>Core</p>
          <div className="flex flex-wrap gap-2">
            {skills.core.map((s) => <SkillPill key={s} label={s} />)}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>Supporting</p>
          <div className="flex flex-wrap gap-2">
            {skills.supporting.map((s) => <SkillPill key={s} label={s} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
