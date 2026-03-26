# thomflaherty.netlify.app

Dual-identity personal site: **Thom Flaherty** (tech resume) + **Thom Clarity** (music/production portfolio).

## Stack

- Vite + React + TypeScript
- TailwindCSS v4
- react-router-dom v7
- react-to-pdf (resume export)
- Netlify (hosting + forms)

## Development

```bash
npm install
npm run dev
```

## Deploy

Pushes to `main` auto-deploy via Netlify. Manual deploy:

```bash
npm run build
npx netlify-cli deploy --prod
```
