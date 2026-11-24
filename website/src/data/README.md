# Resource data

The catalog is split into one JSON file per category. Every file is validated by
`src/lib/schema.ts` when `src/data/resources/index.ts` is imported, so `next build`
fails on a bad entry.

## Source policy

- Prefer links that already exist in the repository root `README.md` or `roadmap.md`.
- Do not add placeholder or guessed URLs. Verify a link in a browser before merging.
- Write original summaries and descriptions; do not paste marketing copy.

48 of the 56 initial resources come from the root markdown. Eight deliberate gap
fills use official or canonical sources:

- Think Python
- Python for Data Analysis
- FastAPI
- Pydantic
- SQLAlchemy
- Full Stack Python
- Exercism Python Track
- Automate the Boring Stuff with Python

Canonicalizations made during extraction:

- Django and Flask links point at their current stable docs instead of the older
  versioned URLs in `roadmap.md`.
- Hugging Face's NLP course now redirects to the LLM course; the entry uses the
  current title and URL.
- `pythoncheatsheet.org` now redirects to a third-party site, so the catalog uses
  Finxter's Python cheat-sheet collection from the README instead.
- O'Reilly and Real Python may return `403` to automated link checkers; they are
  live in a browser.

## Validation rules

- Unique `id` and normalized `url`
- HTTPS URLs only
- Summary ≤ 140 characters
- Description 120–700 characters
- 1–4 unique lowercase kebab-case tags
- Category must exist in `src/data/categories.ts`
- `featured` is capped in practice at 12 entries

Run `npm run test` for schema, integrity, and category-count checks. When adding
or moving resources, update the expected distribution in `tests/resources.test.ts`.
