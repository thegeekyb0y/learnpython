# learn-python / curated-resources

The web directory for the [`learn-python`](https://github.com/thegeekyb0y/learnpython) repository.

**Status:** Phase 3 — resource detail drawer. The editorial hero, data-driven quick navigation, instant search dropdown, sticky filters, grid/list feed, empty/loading states, URL sync, and responsive detail drawer are live, including `?r=<id>` deep links and browser-history navigation.

## Content

- Taxonomy: `src/data/categories.ts`
- Resource catalog: `src/data/catalog/*.json`
- Validated resource export: `src/data/resources.ts`
- Collection filters: `src/data/collections.ts`
- Quick navigation: `src/data/quick-nav.ts`
- Schema and integrity checks: `src/lib/schema.ts`
- Source/extraction notes: `src/data/README.md`

The page imports the validated catalog, so `next build` fails on a duplicate id, duplicate URL, unknown category, invalid URL, or out-of-range summary/description.

## Directory behavior

- Search filters live and writes a debounced `?q=` URL.
- Category, difficulty, access, collection, sort, and view state synchronize to the URL.
- Quick navigation maps to real catalog filters.
- The hero stays mounted while searching or filtering; the search panel floats above the page so there is no layout shift.
- `⌘K` / `Ctrl+K` / `/` focus search and open the instant results panel.
- The panel supports arrow-key navigation, Enter to open, Esc to close, and a footer that scrolls to the filtered feed.
- Active search or filters show a live result count with a `Clear` action under the search field.
- Cards open a slide-over sheet on desktop and a `vaul` drawer on mobile.
- The open resource is URL-addressable via `?r=<id>`; closing with Esc, the backdrop, the close button, or Back restores focus to the triggering card.
- Related resources at the bottom of the drawer switch the open resource without adding history entries.
- Empty results and loading states are keyboard accessible.

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
npm run check          # typecheck + lint + Vitest
npm run content:check  # schema, catalog integrity, category counts
npm run test:e2e       # Playwright E2E + axe against the static export
npm run build:pages    # static export to ./out with the Pages base path
npm run generate:og    # regenerate public/og-image.png
```

Playwright needs its browser once per machine:

```bash
npx playwright install chromium
```

`test:e2e` builds the Pages export, serves it at `/learnpython/`, and exercises
search, quick navigation, deep links, browser history, axe accessibility, and
responsive overflow.

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

`public/og-image.png` is a committed 1200×630 social card so the static export
can advertise Open Graph and Twitter images without a server-rendered image
route. Regenerate it with `npm run generate:og` after changing the brand art.

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
