import { hero, roles, skills, education, teaching } from "../data/resume";

export function ResumeDocument() {
  return (
    <div
      style={{
        width: "8.5in",
        padding: "0.5in 0.6in",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "10pt",
        lineHeight: 1.4,
        color: "#1a1a2e",
        backgroundColor: "#ffffff",
      }}
    >
      <h1 style={{ fontSize: "22pt", fontWeight: 700, margin: 0 }}>{hero.name}</h1>
      <p style={{ fontSize: "11pt", color: "#2563eb", margin: "2pt 0 0" }}>{hero.tagline}</p>
      <p style={{ fontSize: "9pt", color: "#6b7280", margin: "4pt 0 0" }}>{hero.bio}</p>
      <p style={{ fontSize: "8pt", color: "#6b7280", margin: "2pt 0 12pt" }}>
        thomasflaherty@gmail.com · linkedin.com/in/thomasjohnflaherty
      </p>

      <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "0 0 12pt" }} />

      <h2 style={{ fontSize: "12pt", fontWeight: 700, margin: "0 0 8pt" }}>Experience</h2>
      {roles.map((role) => (
        <div key={`${role.company}-${role.dates}`} style={{ marginBottom: "10pt" }}>
          <p style={{ fontWeight: 600, margin: 0 }}>
            {role.title} — {role.company}
          </p>
          <p style={{ fontSize: "9pt", color: "#6b7280", margin: "1pt 0 3pt" }}>
            {role.dates} · {role.location}
          </p>
          <ul style={{ margin: 0, paddingLeft: "14pt" }}>
            {role.bullets.map((b, i) => (
              <li key={i} style={{ fontSize: "9.5pt", marginBottom: "1pt" }}>{b}</li>
            ))}
          </ul>
        </div>
      ))}

      <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "4pt 0 12pt" }} />

      <h2 style={{ fontSize: "12pt", fontWeight: 700, margin: "0 0 6pt" }}>Skills</h2>
      <p style={{ fontSize: "9.5pt", margin: "0 0 2pt" }}>
        <strong>Core:</strong> {skills.core.join(" · ")}
      </p>
      <p style={{ fontSize: "9.5pt", margin: "0 0 12pt" }}>
        <strong>Supporting:</strong> {skills.supporting.join(" · ")}
      </p>

      <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "0 0 12pt" }} />

      <h2 style={{ fontSize: "12pt", fontWeight: 700, margin: "0 0 6pt" }}>Education</h2>
      {education.map((ed) => (
        <div key={ed.degree} style={{ marginBottom: "4pt" }}>
          <p style={{ fontWeight: 600, margin: 0, fontSize: "10pt" }}>{ed.degree}</p>
          <p style={{ fontSize: "9pt", color: "#6b7280", margin: "1pt 0 0" }}>
            {ed.school}
            {ed.note && ` — ${ed.note}`}
          </p>
        </div>
      ))}
      <div style={{ marginTop: "8pt" }}>
        <p style={{ fontWeight: 600, margin: 0, fontSize: "10pt" }}>{teaching.role}</p>
        <p style={{ fontSize: "9pt", color: "#6b7280", margin: "1pt 0 0" }}>{teaching.org}</p>
      </div>
    </div>
  );
}
