# Contributing to the directory

## Local quickstart

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Add a resource

1. Open the matching category file in `src/data/catalog/`.
2. Add one object to the JSON array. Keep `summary` at 140 characters or fewer and `description` between 120 and 700 characters.
3. Use a unique kebab-case `id`, an `https` URL, and 1–4 unique kebab-case tags.

```json
{
  "id": "example-resource",
  "title": "Example Resource",
  "url": "https://example.com/resource",
  "summary": "One or two lines that explain what this is and who it is for.",
  "description": "Two or three sentences of detail for the resource drawer. Mention the format, the level it suits, and what makes it worth keeping in this directory.",
  "category": "core-foundations",
  "subcategory": "General",
  "provider": "Example maintainers",
  "highlights": ["What the resource covers", "Why it is useful"],
  "recommendedOrder": 1,
  "tags": ["official", "reference"],
  "difficulty": "beginner",
  "format": "docs",
  "access": "free",
  "featured": false
}
```

Allowed values:

- `difficulty`: `beginner`, `intermediate`, `advanced`
- `format`: `article`, `book`, `community`, `docs`, `course`, `podcast`, `practice`, `tool`, `video`
- `access`: `free`, `open-source`, `paid`
- `category`: one of the IDs in `src/data/categories.ts`
- `subcategory`: required; use the exact heading from the root `README.md`
- `provider`, `highlights` (max 3), `recommendedOrder`: optional

Resources are validated by `src/lib/schema.ts` when `src/data/resources.ts` is imported. Duplicate IDs, duplicate URLs, unknown categories, non-HTTPS URLs, and out-of-range copy all fail the build. After editing the catalog, run `npm run sync:readme` so the generated Full Catalog section stays in sync.

## Collection filters and quick navigation

- Shared filter definitions live in `src/data/collections.ts`.
- Quick-nav items live in `src/data/quick-nav.ts` and reference those filters.
- Keep filters pointed at real categories, formats, or tags with at least one matching resource.
- Lucide icons are resolved by key in `src/components/shell/icon-map.ts`. Quick-nav items also accept an optional `iconSrc` for a custom local asset.

## Before opening a PR

```bash
npm run check
```

This runs TypeScript, ESLint, schema/integrity tests, filtering/sorting tests, and category-count tests. For production output:

```bash
npm run build:pages
```
