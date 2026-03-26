export function GearGallery() {
  const images: string[] = [];
  if (images.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Setup</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((src) => (
          <img
            key={src}
            src={`/images/gear/${src}`}
            alt="Hardware setup"
            className="rounded-lg w-full object-cover"
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
