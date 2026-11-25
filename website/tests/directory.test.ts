import { describe, expect, it } from "vitest";

import { resources } from "@/data/resources";
import { quickNavItems } from "@/data/quick-nav";
import {
  defaultDirectoryFilters,
  filterResources,
  getAccessFacetCounts,
  getCategoryFacetCounts,
  getLevelFacetCounts,
  getRelatedResources,
  getSectionView,
  matchesCollectionFilter,
  matchesQuery,
  parseDirectoryParams,
  serializeDirectoryFilters,
  sortResources,
} from "@/lib/directory";

describe("directory filtering", () => {
  it("filters by category", () => {
    const filtered = filterResources(resources, {
      ...defaultDirectoryFilters,
      category: "web-dev",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered.every((resource) => resource.category === "web-dev")).toBe(
      true,
    );
  });

  it("filters by multiple difficulty levels", () => {
    const filtered = filterResources(resources, {
      ...defaultDirectoryFilters,
      levels: ["beginner", "advanced"],
    });

    expect(
      filtered.every(
        (resource) =>
          resource.difficulty === "beginner" ||
          resource.difficulty === "advanced",
      ),
    ).toBe(true);
  });

  it("filters by access", () => {
    const filtered = filterResources(resources, {
      ...defaultDirectoryFilters,
      access: ["free", "open-source"],
    });

    expect(filtered).toHaveLength(144);
    expect(filtered.every((resource) => resource.access !== "paid")).toBe(true);
  });

  it("searches titles, tags, categories, subcategories, providers, and descriptions", () => {
    expect(
      resources.filter((resource) => matchesQuery(resource, "langchain"))
        .length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      resources.filter((resource) => matchesQuery(resource, "cheatsheets"))
        .length,
    ).toBeGreaterThanOrEqual(10);
    expect(
      resources.filter((resource) => matchesQuery(resource, "anthropic"))
        .length,
    ).toBeGreaterThanOrEqual(2);
    expect(
      resources.filter((resource) => matchesQuery(resource, "books")).length,
    ).toBeGreaterThanOrEqual(6);
  });

  it("requires every query token to match", () => {
    expect(
      resources.filter((resource) =>
        matchesQuery(resource, "langchain kubernetes"),
      ),
    ).toHaveLength(0);
  });

  it("maps every quick-nav collection to real resources", () => {
    expect(quickNavItems).toHaveLength(7);

    const expectedCounts = {
      official: 19,
      books: 6,
      youtube: 30,
      agents: 19,
      tools: 20,
      communities: 49,
      practice: 6,
    } as const;

    for (const collection of quickNavItems) {
      expect(
        resources.filter((resource) =>
          matchesCollectionFilter(resource, collection.filter),
        ).length,
      ).toBe(expectedCounts[collection.id]);
    }
  });

  it("filters by collection", () => {
    const youtube = filterResources(resources, {
      ...defaultDirectoryFilters,
      collection: "youtube",
    });
    const books = filterResources(resources, {
      ...defaultDirectoryFilters,
      collection: "books",
    });

    expect(youtube).toHaveLength(30);
    expect(youtube.every((resource) => resource.format === "video")).toBe(true);
    expect(books).toHaveLength(6);
    expect(books.every((resource) => resource.category === "books-guides")).toBe(
      true,
    );
  });
});

describe("directory sorting", () => {
  it("sorts A–Z", () => {
    const sorted = sortResources(resources, "az");
    const titles = sorted.map((resource) => resource.title);

    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  });

  it("sorts beginner resources first", () => {
    const sorted = sortResources(resources, "level");

    expect(sorted[0]?.difficulty).toBe("beginner");
    expect(sorted.at(-1)?.difficulty).toBe("advanced");
  });

  it("groups recommended results by category", () => {
    const sorted = sortResources(resources, "recommended");

    expect(sorted[0]?.category).toBe("core-foundations");
    expect(sorted.at(-1)?.category).toBe("communities-media");
  });
});

describe("facet counts", () => {
  it("returns category counts that sum to the catalog size", () => {
    const counts = getCategoryFacetCounts(
      resources,
      defaultDirectoryFilters,
    );

    expect(counts.all).toBe(148);
    expect(Object.values(counts).reduce((sum, count) => sum + count, 0)).toBe(
      148 + 148,
    );
    expect(counts["data-ai"]).toBe(64);
  });

  it("keeps the category facet at the full catalog size when a category is selected", () => {
    const counts = getCategoryFacetCounts(resources, {
      ...defaultDirectoryFilters,
      category: "web-dev",
    });

    expect(counts.all).toBe(148);
    expect(counts["web-dev"]).toBe(1);
  });

  it("returns level and access counts that sum to the eligible catalog", () => {
    const levels = getLevelFacetCounts(resources, defaultDirectoryFilters);
    const access = getAccessFacetCounts(resources, defaultDirectoryFilters);

    expect(Object.values(levels).reduce((sum, count) => sum + count, 0)).toBe(
      148,
    );
    expect(access.free + access["open-source"]).toBe(144);
  });
});

describe("sub-section grouping", () => {
  it("groups the YouTube collection into core, AI, and creator sections", () => {
    const view = getSectionView(resources, {
      ...defaultDirectoryFilters,
      collection: "youtube",
    });

    expect(view).not.toBeNull();
    expect(view?.total).toBe(30);
    expect(
      view?.groups.map((group) => ({
        title: group.title,
        count: group.resources.length,
      })),
    ).toEqual([
      { title: "Core Python Playlists", count: 14 },
      { title: "AI & ML Playlists", count: 7 },
      { title: "Top Python Creators", count: 9 },
    ]);
  });

  it("groups the Communities collection including AI research blogs", () => {
    const view = getSectionView(resources, {
      ...defaultDirectoryFilters,
      collection: "communities",
    });

    expect(view?.total).toBe(49);
    expect(
      view?.groups.map((group) => ({
        title: group.title,
        count: group.resources.length,
      })),
    ).toEqual([
      { title: "YouTube Playlists", count: 14 },
      { title: "Top YouTube Creators", count: 9 },
      { title: "Engineering Blogs", count: 13 },
      { title: "X / Twitter Creators", count: 7 },
      { title: "Podcasts", count: 6 },
    ]);
  });

  it("partitions every grouped view without losing resources", () => {
    const scopes = [
      { collection: "youtube" as const, category: "all" as const },
      { collection: "official" as const, category: "all" as const },
      { collection: "communities" as const, category: "all" as const },
      { collection: null, category: "data-ai" as const },
      { collection: null, category: "communities-media" as const },
      { collection: null, category: "tools-automation" as const },
    ];

    for (const scope of scopes) {
      const view = getSectionView(resources, {
        ...defaultDirectoryFilters,
        ...scope,
      });
      const groupedTotal =
        view?.groups.reduce(
          (total, group) => total + group.resources.length,
          0,
        ) ?? 0;

      expect(view).not.toBeNull();
      expect(groupedTotal).toBe(view?.total);
    }
  });

  it("groups Data & AI into domain sections", () => {
    const view = getSectionView(resources, {
      ...defaultDirectoryFilters,
      category: "data-ai",
    });

    expect(view?.total).toBe(64);
    expect(view?.groups.map((group) => group.title)).toEqual([
      "Generative AI & LLMs",
      "Building AI Agents",
      "Vector Databases & RAG",
      "Model Context Protocol (MCP)",
      "Fine-Tuning LLMs",
      "Build an LLM From Scratch",
      "Modern ML Frameworks",
      "Evaluating & Testing LLM Apps",
      "Local & Open-Source LLMs",
      "AI & ML Playlists",
      "AI Research & Blogs",
      "Domain Applications",
    ]);
  });

  it("filters to one sub-section without changing group counts", () => {
    const view = getSectionView(resources, {
      ...defaultDirectoryFilters,
      collection: "youtube",
      section: "ai-ml-playlists",
    });
    const filtered = filterResources(resources, {
      ...defaultDirectoryFilters,
      collection: "youtube",
      section: "ai-ml-playlists",
    });

    expect(filtered).toHaveLength(7);
    expect(
      view?.groups.reduce((total, group) => total + group.resources.length, 0),
    ).toBe(30);
  });

  it("only creates grouped views for the configured collections and categories", () => {
    expect(
      getSectionView(resources, {
        ...defaultDirectoryFilters,
        collection: "books",
      }),
    ).toBeNull();
    expect(
      getSectionView(resources, {
        ...defaultDirectoryFilters,
        category: "web-dev",
      }),
    ).toBeNull();
  });
});

describe("related resources", () => {
  it("returns up to three resources from the same category", () => {
    const related = getRelatedResources(resources, "langchain-docs");

    expect(related).toHaveLength(3);
    expect(related.every((resource) => resource.category === "data-ai")).toBe(
      true,
    );
    expect(related.some((resource) => resource.id === "langchain-docs")).toBe(
      false,
    );
    expect(new Set(related.map((resource) => resource.id)).size).toBe(3);
  });

  it("returns no related resources for an unknown id", () => {
    expect(getRelatedResources(resources, "missing-resource")).toEqual([]);
  });
});

describe("URL state", () => {
  it("hydrates a cold deep link to a valid resource", () => {
    const parsed = parseDirectoryParams(
      new URLSearchParams("r=python-documentation"),
      resources,
    );

    expect(parsed.selectedId).toBe("python-documentation");
  });
  it("parses a complete URL state", () => {
    const parsed = parseDirectoryParams(
      new URLSearchParams(
        "q=langchain&cat=data-ai&level=beginner,advanced&access=free&quick=youtube&section=core-python-playlists&sort=az&view=list&r=langchain-docs",
      ),
      resources,
    );

    expect(parsed.filters.query).toBe("langchain");
    expect(parsed.filters.category).toBe("data-ai");
    expect(parsed.filters.levels).toEqual(["beginner", "advanced"]);
    expect(parsed.filters.access).toEqual(["free"]);
    expect(parsed.filters.collection).toBe("youtube");
    expect(parsed.filters.section).toBe("core-python-playlists");
    expect(parsed.filters.sort).toBe("az");
    expect(parsed.filters.view).toBe("list");
    expect(parsed.selectedId).toBe("langchain-docs");
  });

  it("ignores invalid categories, levels, access, sort, view, and resource ids", () => {
    const parsed = parseDirectoryParams(
      new URLSearchParams(
        "cat=unknown&level=expert&access=paid&quick=unknown&section=unknown&sort=random&view=table&r=missing",
      ),
      resources,
    );

    expect(parsed.filters).toEqual(defaultDirectoryFilters);
    expect(parsed.selectedId).toBeNull();
  });

  it("serializes only non-default filters", () => {
    expect(
      serializeDirectoryFilters({
        ...defaultDirectoryFilters,
        query: "django",
        category: "web-dev",
        levels: ["beginner"],
        access: ["free"],
        collection: "youtube",
        section: "core-python-playlists",
        sort: "az",
        view: "list",
      }),
    ).toEqual({
      q: "django",
      cat: "web-dev",
      level: ["beginner"],
      access: ["free"],
      quick: "youtube",
      section: "core-python-playlists",
      sort: "az",
      view: "list",
    });

    expect(serializeDirectoryFilters(defaultDirectoryFilters)).toEqual({
      q: undefined,
      cat: undefined,
      level: undefined,
      access: undefined,
      quick: undefined,
      section: undefined,
      sort: undefined,
      view: undefined,
    });
  });
});
