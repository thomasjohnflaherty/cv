import { education, teaching } from "../../data/resume";

export function EducationSection() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Education</h2>
      <div className="space-y-3">
        {education.map((ed) => (
          <div key={ed.degree}>
            <p className="font-medium">{ed.degree}</p>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{ed.school}</p>
            {ed.note && <p className="text-sm italic mt-0.5" style={{ color: "var(--color-text-muted)" }}>{ed.note}</p>}
          </div>
        ))}
        <div className="pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
          <p className="font-medium">{teaching.role}</p>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{teaching.org}</p>
        </div>
      </div>
    </section>
  );
}
