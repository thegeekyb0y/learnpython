import Link from "next/link";
import { ArrowUpRight, Plus, Search, Star } from "lucide-react";

import { GitHubMark } from "@/components/icons/github-mark";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { categoryById } from "@/data/categories";
import { categoryCounts, getResourceById, resources } from "@/data/resources";
import type {
  Difficulty,
  ResourceAccess,
  ResourceFormat,
} from "@/lib/schema";
import { repoUrl, submitResourceUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const palette = [
  {
    name: "Ink Black",
    hex: "#161D24",
    role: "Text, structure, active states",
    swatch: "bg-ink",
    ink: "text-white",
  },
  {
    name: "French Blue",
    hex: "#3C477D",
    role: "Primary actions, links, hover rail",
    swatch: "bg-brand",
    ink: "text-white",
  },
  {
    name: "Dry Sage",
    hex: "#d0cd94",
    role: "Soft free-access washes",
    swatch: "bg-sage",
    ink: "text-ink",
  },
  {
    name: "Bright Fern",
    hex: "#4CB33D",
    role: "Open-source and success marks",
    swatch: "bg-fern",
    ink: "text-ink",
  },
  {
    name: "Chocolate",
    hex: "#d56f3e",
    role: "Featured and paid markers",
    swatch: "bg-chocolate",
    ink: "text-ink",
  },
] as const;

const formatLabels: Record<ResourceFormat, string> = {
  book: "Book",
  docs: "Docs",
  course: "Course",
  practice: "Practice",
  tool: "Tool",
  video: "Video",
};

const difficultyLabels: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const accessStyles = {
  free: { variant: "sage", tone: "fern", label: "Free" },
  "open-source": { variant: "fern", tone: "fern", label: "Open source" },
  paid: { variant: "chocolate", tone: "chocolate", label: "Paid" },
} as const satisfies Record<
  ResourceAccess,
  {
    variant: "sage" | "fern" | "chocolate";
    tone: "fern" | "chocolate";
    label: string;
  }
>;

const previewResources = [
  "python-documentation",
  "think-python",
  "fastapi-documentation",
  "scikit-learn-user-guide",
  "the-algorithms-python",
  "automate-the-boring-stuff",
].flatMap((id) => {
  const resource = getResourceById(id);
  return resource ? [resource] : [];
});

function SectionHeader({
  id,
  index,
  title,
  note,
}: {
  id: string;
  index: string;
  title: string;
  note: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 border-b border-hairline pb-3">
      <div className="flex min-w-0 items-baseline gap-3">
        <span className="type-micro shrink-0 text-ink-4">{index}</span>
        <h2
          id={id}
          className="truncate text-[13px] font-semibold tracking-tight text-ink"
        >
          {title}
        </h2>
      </div>
      <p className="hidden shrink-0 type-micro text-ink-4 sm:block">{note}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-30 border-b border-hairline bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-brand-ring"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-ink font-mono text-[10px] font-medium text-white">
              py
            </span>
            <span className="hidden items-baseline gap-2 sm:flex">
              <span className="font-mono text-[11px] font-normal text-ink-4">
                learn-python
              </span>
              <span className="text-ink-4">/</span>
              <span className="text-[13px] font-semibold tracking-tight text-ink">
                curated-resources
              </span>
            </span>
            <span className="min-w-0 leading-none sm:hidden">
              <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-ink-4">
                learn-python
              </span>
              <span className="mt-1 block truncate text-[13px] font-semibold tracking-tight text-ink">
                curated-resources
              </span>
            </span>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div
              aria-hidden="true"
              className="hidden h-9 w-64 items-center gap-2 rounded-lg border border-hairline-strong bg-surface px-3 text-[13px] text-ink-4 md:flex"
            >
              <Search className="size-3.5 shrink-0" />
              <span className="truncate">Search resources…</span>
              <Kbd className="ml-auto">⌘K</Kbd>
            </div>
            <div
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-lg border border-hairline bg-surface text-ink-3 md:hidden"
            >
              <Search className="size-[18px]" />
            </div>

            <Button asChild variant="ghost" size="icon-lg" className="[&_svg]:size-[18px]">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open the learn-python repository on GitHub"
              >
                <GitHubMark />
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="hidden sm:inline-flex [&_svg]:size-[15px]"
            >
              <a
                href={submitResourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Plus />
                Submit resource
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="icon-lg"
              className="sm:hidden [&_svg]:size-[18px]"
            >
              <a
                href={submitResourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Submit a resource"
              >
                <Plus />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto w-full max-w-[1440px] px-4 pb-20 sm:px-6 lg:px-8"
      >
        <div className="border-b border-hairline py-10 sm:py-12">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="brand">
              <BadgeDot tone="brand" />
              Phase 1
            </Badge>
            <span className="type-micro text-ink-4">Validated content</span>
          </div>

          <h1 className="type-page-title mt-5 max-w-[20ch] text-ink">
            Curated Python Resources
          </h1>
          <p className="mt-3 max-w-[62ch] type-body text-ink-3">
            A maintained, editor-curated index of the best Python courses,
            documentation, tools, and reads.
          </p>
          <p className="mt-4 max-w-[68ch] type-meta text-ink-4">
            Token layer, type stack, controls, and {resources.length} validated
            resources. Filtering and the detail overlay arrive in later phases.
          </p>
        </div>

        <section className="pt-12 sm:pt-14" aria-labelledby="palette-heading">
          <SectionHeader
            id="palette-heading"
            index="01"
            title="Palette"
            note="Five-source palette · neutrals derived from Ink Black"
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {palette.map((color) => (
              <div
                key={color.name}
                className="overflow-hidden rounded-lg border border-hairline bg-surface"
              >
                <div
                  className={cn(
                    "flex h-20 items-end p-3",
                    color.swatch,
                    color.ink,
                  )}
                >
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em]">
                    {color.name}
                  </span>
                </div>
                <div className="border-t border-hairline px-3 py-3">
                  <p className="type-meta text-ink-3">{color.hex}</p>
                  <p className="mt-2 hidden type-meta text-[11px] leading-4 text-ink-4 sm:block">
                    {color.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 type-meta text-ink-4">
            <span>Ink + French Blue carry structure and action.</span>
            <span>Dry Sage is a wash, never small text.</span>
            <span>Bright Fern and Chocolate are dots and markers.</span>
          </div>

          <div
            data-slot="callout"
            className="mt-5 rounded-lg border border-brand-line bg-brand-soft p-4"
          >
            <p className="type-micro text-ink-3">
              Callout wash / French Blue 16% + 32% line
            </p>
            <p className="mt-2 max-w-[70ch] type-body-sm text-ink-3">
              Use this tint for contextual notes, empty states, and inline
              guidance. Ink text keeps AA contrast on every semantic wash.
            </p>
          </div>
        </section>

        <section className="pt-14" aria-labelledby="type-heading">
          <SectionHeader
            id="type-heading"
            index="02"
            title="Type & controls"
            note="Geist Sans · Geist Mono · 4px grid"
          />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0 space-y-6">
              <div>
                <p className="type-page-title text-ink">
                  Curated Python Resources
                </p>
                <p className="mt-2 type-micro text-ink-4">
                  Page title · 24/30 · 600
                </p>
              </div>

              <div>
                <p className="type-card-title text-ink">The Python Tutorial</p>
                <p className="mt-2 type-micro text-ink-4">
                  Card title · 15/22 · 600
                </p>
              </div>

              <div>
                <p className="type-body text-ink-3">
                  The official, example-driven tour of the language. Dense but
                  authoritative; pair it with practice.
                </p>
                <p className="mt-2 type-micro text-ink-4">
                  Body · 14/22 · 400
                </p>
              </div>

              <div>
                <p className="type-body-sm text-ink-4">
                  A quieter supporting line for summaries and drawer copy.
                </p>
                <p className="mt-2 type-micro text-ink-4">
                  Small · 13/20 · 400
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className="type-meta text-ink-4">Intermediate · Docs</span>
                <span className="type-micro text-ink-4">
                  Core Python / Documentation
                </span>
                <span className="type-count text-ink-3">
                  {resources.length} resources
                </span>
              </div>
            </div>

            <div className="min-w-0 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button">
                  Open resource
                  <ArrowUpRight />
                </Button>
                <Button type="button" variant="outline">
                  Submit resource
                  <Plus />
                </Button>
                <Button type="button" variant="ghost">
                  Ghost action
                </Button>
                <Button type="button" variant="link">
                  Read docs
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-4 md:size-3.5" />
                <Input
                  className="pl-9"
                  placeholder="Search resources…"
                  aria-label="Search resources"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="sage">
                  <BadgeDot tone="fern" />
                  Free
                </Badge>
                <Badge variant="fern">
                  <BadgeDot tone="fern" />
                  Open source
                </Badge>
                <Badge variant="chocolate">
                  <BadgeDot tone="chocolate" />
                  Featured
                </Badge>
                <Badge variant="tag">
                  <BadgeDot tone="muted" />
                  Beginner
                </Badge>
                <Badge variant="brand">Docs</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  data-slot="pill"
                  data-state="active"
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-brand-line bg-brand-soft px-4 text-[13px] font-medium text-ink"
                >
                  {categoryById["web-dev"].label}
                  <span className="type-count text-ink-3">
                    {categoryCounts["web-dev"]}
                  </span>
                </span>
                <span
                  data-slot="pill"
                  data-state="inactive"
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-hairline bg-surface px-4 text-[13px] text-ink-3"
                >
                  {categoryById["core-foundations"].label}
                  <span className="type-count text-ink-4">
                    {categoryCounts["core-foundations"]}
                  </span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 type-meta text-ink-4">
                <span className="inline-flex items-center gap-1">
                  <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd>
                  <span className="ml-1">Search</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Kbd>Ctrl</Kbd>
                  <Kbd>K</Kbd>
                  <span className="ml-1">Windows</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Kbd>/</Kbd>
                  <span>Quick search</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Kbd>Esc</Kbd>
                  <span>Close</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-14" aria-labelledby="ledger-heading">
          <SectionHeader
            id="ledger-heading"
            index="03"
            title="Ledger surface"
            note="1px hairlines · no card shadows · 44px touch targets"
          />

          <div className="overflow-hidden rounded-xl border border-hairline bg-hairline">
            <div className="grid grid-cols-1 gap-px md:grid-cols-2 xl:grid-cols-3">
              {previewResources.map((resource) => {
                const access = accessStyles[resource.access];

                return (
                  <article
                    key={resource.id}
                    data-slot="ledger-cell"
                    className="group relative flex min-h-[188px] flex-col bg-surface p-5 transition-colors duration-150 ease-out-quint hover:bg-surface-2"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-5 left-0 w-0.5 origin-top scale-y-0 rounded-full bg-brand transition-transform duration-150 ease-out-quint group-hover:scale-y-100"
                    />

                    <div className="flex items-start justify-between gap-3">
                      <p className="type-micro truncate text-ink-3">
                        {categoryById[resource.category].label} /{" "}
                        {formatLabels[resource.format]}
                      </p>
                      {resource.featured ? (
                        <span className="shrink-0">
                          <Star
                            aria-hidden="true"
                            className="size-3.5 fill-chocolate text-chocolate"
                          />
                          <span className="sr-only">Featured resource</span>
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 flex flex-1 flex-col gap-3">
                      <h3 className="type-card-title text-ink">
                        {resource.title}
                      </h3>
                      <p className="line-clamp-2 type-body-sm text-ink-3">
                        {resource.summary}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                        <p className="min-w-0 truncate type-meta text-ink-3">
                          {difficultyLabels[resource.difficulty]} ·{" "}
                          {formatLabels[resource.format]}
                        </p>
                        <Badge variant={access.variant} className="shrink-0">
                          <BadgeDot tone={access.tone} />
                          {access.label}
                        </Badge>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <p className="mt-4 type-meta text-ink-4">
            Preview of {resources.length} validated resources · 3 columns
            ≥1280 · 2 columns ≥768 · 1 column below
          </p>
        </section>

        <footer className="mt-20 border-t border-hairline py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-meta text-ink-4">
              Phase 1 · {resources.length} validated resources
            </p>
            <div className="flex items-center gap-5">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="type-meta text-ink-3 transition-colors hover:text-ink"
              >
                Repository
              </a>
              <a
                href={submitResourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="type-meta text-ink-3 transition-colors hover:text-ink"
              >
                Submit a resource
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

