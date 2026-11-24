# learn-python / curated-resources

The web directory for the [`learn-python`](https://github.com/thegeekyb0y/learnpython) repository.

**Status:** Phase 1 — validated content. The catalog has 56 resources across 7 categories. Filtering, the command palette, and the detail overlay are built in later phases.

## Content

- Taxonomy: `src/data/categories.ts`
- Resource JSON: `src/data/resources/*.json`
- Schema and integrity checks: `src/lib/schema.ts`
- Source/extraction notes: `src/data/README.md`

The page imports the validated catalog, so `next build` fails on a duplicate id, duplicate URL, unknown category, invalid URL, or out-of-range summary/description.

## Stack

- Next.js 16 App Router + strict TypeScript
- Tailwind CSS v4
- Customized shadcn/ui primitives
- `motion/react`, `vaul`, `lucide-react`
- Geist Sans + Geist Mono via `next/font`

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If your npm config blocks lifecycle scripts, install with `npm install --ignore-scripts`; the current dependencies build without postinstall steps.

## Checks

```bash
npm run check          # typecheck + lint + all tests
npm run content:check  # schema, catalog integrity, category counts
npm run build          # static export to ./out
```

## GitHub Pages

Production is a static export deployed to:

```
https://thegeekyb0y.github.io/learnpython/
```

The base path is controlled by `NEXT_PUBLIC_BASE_PATH`:

```bash
npm run build:pages
```

This sets `NEXT_PUBLIC_BASE_PATH=/learnpython` and the production `NEXT_PUBLIC_SITE_URL`. The workflow at `.github/workflows/deploy-website.yml` builds and deploys `website/out`.

Set **Settings → Pages → Source** to **GitHub Actions** once; after that, pushes to `main` that touch `website/**` deploy automatically.

`public/.nojekyll` ensures GitHub Pages serves the `_next` directory.

If the project moves to a custom domain, build with an empty `NEXT_PUBLIC_BASE_PATH` and update `NEXT_PUBLIC_SITE_URL`.

## URL state

Static export cannot read request-time `searchParams`. The full catalog is prerendered, then `useDirectoryUrl` hydrates filters from `window.location.search` with `useEffect` after mount. History helpers in `src/lib/url.ts` always reuse `window.location.pathname`, preserving the `/learnpython/` base path.

## Design tokens

The palette lives in `src/app/globals.css`:

| Token | Value | Role |
|---|---|---|
| Ink Black | `#161D24` | Text, structure, active states |
| French Blue | `#3C477D` | Primary actions, links, hover rail |
| Dry Sage | `#d0cd94` | Soft free-access washes |
| Bright Fern | `#4CB33D` | Open-source and success marks |
| Chocolate | `#d56f3e` | Featured and paid markers |

Neutrals are derived from Ink Black. Semantic washes use `color-mix` at 16–40% with matching 32–75% borders; Ink Black text stays AA on every tint. The UI is light-only in v1.
