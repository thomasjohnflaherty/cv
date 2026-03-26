import { useState, useEffect } from "react";

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Contact — Thom Flaherty";
  }, []);

  if (submitted) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold">Thanks!</h1>
        <p className="mt-2" style={{ color: "var(--color-text-muted)" }}>
          I'll get back to you soon.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
      <p className="mb-8" style={{ color: "var(--color-text-muted)" }}>
        Whether it's a tech opportunity or a music collaboration, I'd love to hear from you.
      </p>

      <form
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form);
          const body = new URLSearchParams();
          data.forEach((value, key) => body.append(key, value as string));
          fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString(),
          })
            .then(() => setSubmitted(true))
            .catch(() => alert("Something went wrong. Please try again or email me directly."));
        }}
      >
        <input type="hidden" name="form-name" value="contact" />
        <p className="hidden">
          <label>
            Don't fill this out: <input name="bot-field" />
          </label>
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text" id="name" name="name" required
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email" id="email" name="email" required
              className="w-full px-3 py-2 rounded-md border text-sm"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <textarea
              id="message" name="message" rows={5} required
              className="w-full px-3 py-2 rounded-md border text-sm resize-y"
              style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Send
          </button>
        </div>
      </form>

      <div className="mt-12 flex gap-4">
        <a href="https://linkedin.com/in/thomasjohnflaherty" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: "var(--color-accent)" }}>LinkedIn</a>
        <a href="https://github.com/thomasflaherty" target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: "var(--color-accent)" }}>GitHub</a>
        <a href="mailto:thomasflaherty@gmail.com" className="text-sm hover:underline" style={{ color: "var(--color-accent)" }}>Email</a>
      </div>
    </main>
  );
}
