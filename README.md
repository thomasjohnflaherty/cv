# thomflaherty.netlify.app

Dual-identity personal site: **Thom Flaherty** (tech resume) + **Thom Clarity** (music/production portfolio).

## Concept

One continuous scrolling page. As you scroll, the theme crossfades from the light "Thom Flaherty" (tech) identity into the dark "Thom Clarity" (music) identity, and the name letter-morphs between the two. A CP1919 pulsar ridge plot (the *Unknown Pleasures* waveform — a data viz that doubles as electronic-music iconography) runs down the right edge across both themes.

Two things that look like bugs but are deliberate — don't "fix" them:

- **The theme switch is a hard snap, not a gradual crossfade.** An earlier crossfade was tried and rejected (see git history); the tight snap avoids a muddy grey mid-zone.
- **The pulsar overlapping the right margin is intentional.** Its position, opacity, and fade mask were tuned over many commits.

## Stack

- Vite + React 19 + TypeScript
- TailwindCSS v4
- framer-motion (transitions, reduced-motion)
- D3 (pulsar ridge plot)
- `@chenglou/pretext` (fluid hero-text sizing)
- react-to-pdf (resume export)
- Netlify (hosting + forms)

## Content

Résumé and music content is data-driven — edit these, not the components:

- `src/data/resume.ts` — hero, roles, expertise, skills, education
- `src/data/music.ts` — releases, mastering credits, services, links

The PDF résumé renders from the same `resume.ts` data via `src/components/ResumeDocument.tsx` (a fixed 8.5×11in layout captured by react-to-pdf).

## Accessibility

`prefers-reduced-motion` is respected: the pulsar freezes to a static frame, the glitch/scramble and letter-morph resolve instantly, and smooth-scroll is disabled.

## Development

```bash
npm install
npm run dev
```

## Deploy

Pushes to `main` auto-deploy via Netlify. Every branch also gets its own preview at `<branch>--thomflaherty.netlify.app`. Manual deploy:

```bash
npm run build
npx netlify-cli deploy --prod
```
