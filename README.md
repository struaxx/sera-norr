# SERA NORR

Website for SERA NORR — a digital bespoke atelier for sculptural natural stone
furniture (travertine, Calacatta Viola and other rare stones). Custom dining
tables, coffee tables and consoles designed in the Netherlands.

This is a standalone Vite single-page application. It was originally created in
Lovable and has been decoupled so it can be built, run and hosted anywhere.

## Tech stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **React Router** for routing
- **Three.js / react-three-fiber** for the 3D product configurator
- **Supabase** as the backend (forms, configurator API, analytics, email)
- **i18next** for NL/EN translations

## Requirements

- [Node.js](https://nodejs.org/) 18+ and npm

## Getting started

```sh
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# (the .env.example already contains the public Supabase keys, so the
#  site works out of the box; replace them with your own if you fork the backend)

# 3. Start the dev server (http://localhost:8080)
npm run dev
```

## Available scripts

| Command             | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the Vite dev server on port 8080         |
| `npm run build`     | Production build into `dist/`                  |
| `npm run build:dev` | Development-mode build                         |
| `npm run preview`   | Preview the production build locally           |
| `npm run lint`      | Run ESLint                                     |

## Environment variables

All variables are prefixed with `VITE_` and are read at build time. See
[`.env.example`](./.env.example):

| Variable                         | Description                          |
| -------------------------------- | ------------------------------------ |
| `VITE_SUPABASE_URL`              | Supabase project URL                 |
| `VITE_SUPABASE_PUBLISHABLE_KEY`  | Supabase anon/publishable key        |
| `VITE_SUPABASE_PROJECT_ID`       | Supabase project id                  |

The Supabase publishable key is a public browser key and is safe to ship in the
client bundle.

## Deployment

`npm run build` outputs a static site to `dist/`. Upload it to any static host
(Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 + CloudFront, nginx, …).

Because this is a client-side–routed SPA, the host **must** rewrite unknown
paths to `index.html` (otherwise deep links like `/atelier` return 404). Config
is already included for the common hosts:

- **Cloudflare (Workers / Pages)** — [`wrangler.jsonc`](./wrangler.jsonc)
  serves `dist/` as static assets with SPA not-found handling
- **Vercel** — [`vercel.json`](./vercel.json)
- **Netlify** — add a `public/_redirects` file containing `/*  /index.html  200`
- **nginx** — add an SPA fallback:

  ```nginx
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```

- **Apache** — add a `.htaccess` with `FallbackResource /index.html`

Remember to set the `VITE_*` environment variables in your host's build
settings before building.

## Backend (Supabase)

The `supabase/` directory contains the database migrations and edge functions
that power the contact forms, the configurator API, analytics and confirmation
emails. The frontend talks to the hosted Supabase project referenced in
`.env`. If you want to run your own backend, deploy these with the
[Supabase CLI](https://supabase.com/docs/guides/cli) and point the `VITE_*`
variables at your project.

## Project structure

```
src/
  components/     UI + feature components (configurator, atelier, layout, seo, ui)
  pages/          Route pages
  lib/            Utilities, configurator engine, analytics, tracking
  integrations/   Supabase client + generated types
  i18n/           Translations (NL/EN)
  hooks/          React hooks
  stores/         Zustand stores
public/           Static assets
supabase/         Database migrations + edge functions
```
