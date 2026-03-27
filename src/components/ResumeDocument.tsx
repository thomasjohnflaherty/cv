import { hero, roles, expertise, skills, education, teaching } from "../data/resume";
import { PulsarStatic } from "./PulsarStatic";

const font = "Inter, system-ui, sans-serif";

export function ResumeDocument() {
  return (
    <div
      style={{
        width: "8.5in",
        padding: "0.45in 0.55in",
        fontFamily: font,
        fontSize: "9.5pt",
        lineHeight: 1.45,
        color: "#1a1a2e",
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Pulsar ridge plot - right side, full height, fades left */}
      <div style={{
        position: "absolute",
        top: 0,
        right: "-0.5in",
        width: "4in",
        height: "100%",
        opacity: 0.4,
        maskImage: "linear-gradient(to left, black 30%, transparent 85%)",
        WebkitMaskImage: "linear-gradient(to left, black 30%, transparent 85%)",
      }}>
        <PulsarStatic width={380} height={900} color="#2563eb" />
      </div>

      {/* Header */}
      <h1 style={{ fontFamily: font, fontSize: "18pt", fontWeight: 600, margin: 0, letterSpacing: "-0.02em", textTransform: "none", position: "relative" }}>
        {hero.name}
      </h1>
      <p style={{ fontSize: "10pt", color: "#2563eb", margin: "2pt 0 0", fontWeight: 500, position: "relative" }}>{hero.tagline}</p>
      <p style={{ fontSize: "8.5pt", color: "#6b7280", margin: "4pt 0 0", position: "relative" }}>{hero.bio}</p>
      <p style={{ fontSize: "8pt", color: "#6b7280", margin: "2pt 0 10pt", position: "relative" }}>
        thomasflaherty@gmail.com · linkedin.com/in/thomasjohnflaherty · thomflaherty.netlify.app
      </p>

      <hr style={{ border: "none", borderTop: "1px solid #d1d5db", margin: "0 0 10pt" }} />

      {/* Expertise */}
      <h2 style={{ fontFamily: font, fontSize: "9pt", fontWeight: 600, margin: "0 0 4pt", textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>
        Expertise
      </h2>
      <p style={{ fontSize: "8.5pt", margin: "0 0 10pt", color: "#4b5563" }}>
        {expertise.join("  ·  ")}
      </p>

      <hr style={{ border: "none", borderTop: "1px solid #d1d5db", margin: "0 0 10pt" }} />

      {/* Experience */}
      <h2 style={{ fontFamily: font, fontSize: "9pt", fontWeight: 600, margin: "0 0 6pt", textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>
        Experience
      </h2>
      {roles.map((role, i) => (
        <div key={`${role.company}-${role.dates}`} style={{ marginBottom: i < roles.length - 1 ? "8pt" : "0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <p style={{ fontWeight: 600, margin: 0, fontSize: "9.5pt" }}>
              {role.title}, {role.company}
            </p>
            <p style={{ fontSize: "8pt", color: "#6b7280", margin: 0, whiteSpace: "nowrap" }}>
              {role.dates}
            </p>
          </div>
          <ul style={{ margin: "2pt 0 0", paddingLeft: "12pt" }}>
            {role.bullets.map((b, j) => (
              <li key={j} style={{ fontSize: "8.5pt", marginBottom: "1pt", color: "#374151" }}>{b}</li>
            ))}
          </ul>
        </div>
      ))}

      <hr style={{ border: "none", borderTop: "1px solid #d1d5db", margin: "8pt 0 10pt" }} />

      {/* Tools */}
      <h2 style={{ fontFamily: font, fontSize: "9pt", fontWeight: 600, margin: "0 0 4pt", textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>
        Tools
      </h2>
      <p style={{ fontSize: "8.5pt", margin: "0 0 10pt", color: "#4b5563" }}>
        {skills.tools.join("  ·  ")}
      </p>

      <hr style={{ border: "none", borderTop: "1px solid #d1d5db", margin: "0 0 10pt" }} />

      {/* Education */}
      <h2 style={{ fontFamily: font, fontSize: "9pt", fontWeight: 600, margin: "0 0 6pt", textTransform: "uppercase", letterSpacing: "0.08em", color: "#374151" }}>
        Education
      </h2>
      {education.map((ed) => (
        <div key={ed.degree} style={{ marginBottom: "3pt" }}>
          <p style={{ fontWeight: 600, margin: 0, fontSize: "9pt" }}>
            {ed.degree}
            <span style={{ fontWeight: 400, color: "#6b7280" }}> · {ed.school}</span>
          </p>
          {ed.note && (
            <p style={{ fontSize: "8pt", color: "#6b7280", margin: "1pt 0 0", fontStyle: "italic" }}>
              {ed.note}
            </p>
          )}
        </div>
      ))}
      <div style={{ marginTop: "6pt" }}>
        <p style={{ fontWeight: 600, margin: 0, fontSize: "9pt" }}>
          {teaching.role}
          <span style={{ fontWeight: 400, color: "#6b7280" }}> · {teaching.org}</span>
        </p>
      </div>
    </div>
  );
}
