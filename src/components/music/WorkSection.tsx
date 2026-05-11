import { bugGasReleases, bugGasBandcamp, masteringCredits, pressQuotes, featuredTrack } from "../../data/music";

export function WorkSection({ youtubeVideoId }: { youtubeVideoId?: string }) {
  return (
    <section>
      <h2 className="mb-6">Work</h2>

      {/* Solo — YouTube embed */}
      {youtubeVideoId && (
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-3">Solo</h3>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title="Thom Clarity Live Performance"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="border-0"
            />
          </div>
        </div>
      )}

      {/* Subvert featured track — iframe attempt (will be blocked if X-Frame-Options/CSP set) */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold mb-3">Solo Release</h3>
        <div
          className="rounded-lg border overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          <iframe
            src={featuredTrack.url}
            title={`${featuredTrack.title} on ${featuredTrack.label}`}
            className="w-full border-0 block"
            style={{ height: "180px" }}
            loading="lazy"
            allow="autoplay; encrypted-media"
          />
        </div>
        <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          {featuredTrack.title} — out now on {featuredTrack.label}.{" "}
          <a
            href={featuredTrack.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
            style={{ color: "var(--color-accent)" }}
          >
            Open on Subvert →
          </a>
        </p>
      </div>

      {/* Bus Gas */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold mb-3">Bus Gas</h3>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
          Collaborative project; drone, post-rock, experimental
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {bugGasReleases.map((release) => (
            <a
              key={release.title}
              href={release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div
                className="aspect-square rounded-lg overflow-hidden border transition-all duration-200 group-hover:border-2"
                style={{ borderColor: "var(--color-border)" }}
              >
                <img
                  src={release.cover}
                  alt={release.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p
                className="mt-2 text-sm font-medium"
                style={{ color: "var(--color-text)" }}
              >
                {release.title}
              </p>
            </a>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pressQuotes.map((quote) => (
            <blockquote
              key={quote.source}
              className="p-4 rounded-lg border"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
            >
              <p className="text-sm italic leading-relaxed" style={{ color: "var(--color-text)" }}>
                "{quote.text}"
              </p>
              <cite className="block mt-2 text-xs font-semibold not-italic" style={{ color: "var(--color-accent)" }}>
                - {quote.source}
              </cite>
            </blockquote>
          ))}
        </div>
        <div className="mt-6">
          <a
            href={bugGasBandcamp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Full Discography on Bandcamp
          </a>
        </div>
      </div>

      {/* Mastering Credits */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Mastering Credits</h3>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
          Selected releases mastered by Thom Clarity
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {masteringCredits.map((credit) => (
            <a
              key={`${credit.artist}-${credit.title}`}
              href={credit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div
                className="aspect-square rounded-lg overflow-hidden border transition-all duration-200 group-hover:border-2"
                style={{ borderColor: "var(--color-border)" }}
              >
                <img
                  src={credit.cover}
                  alt={`${credit.artist} - ${credit.title}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="mt-2 text-sm font-medium" style={{ color: "var(--color-text)" }}>
                {credit.title}
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {credit.artist}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
