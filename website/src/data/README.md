# Resource data

The catalog mirrors every resource link in the repository root `README.md`. The
150 links that resolve to 148 unique resources (two URLs were listed twice) are
split into one JSON file per top-level category under `src/data/catalog/`:

- `core-foundations.json`
- `books-guides.json`
- `web-dev.json`
- `data-ai.json`
- `practice-challenges.json`
- `tools-automation.json`
- `communities-media.json`

Every file is validated by `src/lib/schema.ts` when `src/data/resources.ts` is
imported, so `next build` fails on a bad entry.

Each record keeps the README's heading as `subcategory`, so the UI can show a
two-level hierarchy without expanding the top-level category taxonomy. Optional
`provider`, `highlights` (up to three), and `recommendedOrder` fields add
editorial context.

Files are sorted deterministically: `featured` first, then `subcategory`, then
`title`. The sync script uses the same order when rendering README tables.

Quick navigation is data-driven too:

- `src/data/collections.ts` — the shared collection filter registry.
- `src/data/sections.ts` — declarative sub-section grouping for dense views.
- `src/data/quick-nav.ts` — the seven Quick Navigation items and their icon keys.

## Source policy

- Every entry comes from the root `README.md`; do not add gap-fill resources.
- Normalize URLs by stripping trailing slashes and upgrading `http://` to
  `https://`. Merge exact duplicate URLs into one canonical entry and add both
  source headings to `tags`.
- Do not add placeholder or guessed URLs. Verify a link in a browser before
  merging.
- Write original summaries and descriptions; do not paste marketing copy.

## README sync

The generated `## Full Catalog` section in the root `README.md` is delimited by
`<!-- CATALOG:START -->` and `<!-- CATALOG:END -->`. It lists every resource
grouped by category and subcategory, linking to both the resource URL and its
`?r=<id>` deep link.

```bash
npm run sync:readme         # rewrite the generated section
npm run sync:readme:check   # fail if README.md is stale (runs in npm run check)
```

## Validation rules

- Unique `id` and normalized `url`
- HTTPS URLs only
- Summary ≤ 140 characters
- Description 120–700 characters
- 1–4 unique lowercase kebab-case tags (each ≤ 48 characters)
- Required `subcategory`; optional `provider`, `highlights`, `recommendedOrder`
- Category must exist in `src/data/categories.ts`
- `featured` is capped in practice at twelve entries

## Quick-nav tags

Quick navigation relies on these tags in addition to category and format filters:

- `official`
- `agents`
- `community`

Run `npm run test` for schema, integrity, and category-count checks. When adding
or moving resources, update the expected distribution and Quick-Nav counts in
`tests/resources.test.ts` and `tests/directory.test.ts`.
