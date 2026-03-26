import { pressQuotes } from "../../data/music";

export function PressQuotes() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Press</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pressQuotes.map((quote) => (
          <blockquote
            key={quote.source}
            className="p-6 rounded-lg border"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <p className="press-quote text-xl sm:text-2xl italic leading-relaxed" style={{ color: "var(--color-text)" }}>
              "{quote.text}"
            </p>
            <cite className="block mt-3 text-sm font-semibold not-italic" style={{ color: "var(--color-accent)" }}>
              — {quote.source}
            </cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
