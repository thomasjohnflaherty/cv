import { bugGasReleases, bugGasBandcamp } from "../../data/music";

export function WorkSection({ youtubeVideoId }: { youtubeVideoId?: string }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Work</h2>
      {youtubeVideoId && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Solo</h3>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title="Thom Clarity — Live Performance"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="border-0"
            />
          </div>
        </div>
      )}
      <div className="mb-8 p-6 rounded-lg border border-dashed text-center" style={{ borderColor: "var(--color-border)" }}>
        <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
          New release on Subvert — Coming Soon
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Bug Gas</h3>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
          Collaborative project — drone, post-rock, experimental
        </p>
        <ul className="space-y-1 mb-4">
          {bugGasReleases.map((release) => (
            <li key={release} className="text-sm italic" style={{ color: "var(--color-text)" }}>
              {release}
            </li>
          ))}
        </ul>
        <a
          href={bugGasBandcamp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-2 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          Listen on Bandcamp
        </a>
      </div>
    </section>
  );
}
