import { services } from "../../data/music";

export function ServicesSection() {
  return (
    <section>
      <h2 className="mb-6">Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.title}
            className="p-6 rounded-lg border"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <h3 className="font-semibold">{service.title}</h3>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
