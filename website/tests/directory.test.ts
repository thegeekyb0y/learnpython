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

    expect(filtered).toHaveLength(6);
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

    expect(filtered).toHaveLength(52);
    expect(filtered.every((resource) => resource.access !== "paid")).toBe(true);
  });

  it("searches titles, tags, categories, and descriptions", () => {
    expect(resources.filter((resource) => matchesQuery(resource, "django")))
      .toHaveLength(1);
    expect(resources.filter((resource) => matchesQuery(resource, "oop")))
      .toHaveLength(1);
    expect(
      resources.filter((resource) => matchesQuery(resource, "books")).length,
    ).toBeGreaterThanOrEqual(6);
  });

  it("requires every query token to match", () => {
    expect(
      resources.filter((resource) =>
        matchesQuery(resource, "django postgres"),
      ),
    ).toHaveLength(0);
  });

  it("maps every quick-nav collection to real resources", () => {
    expect(quickNavItems).toHaveLength(7);

    for (const collection of quickNavItems) {
      expect(
        resources.filter((resource) =>
          matchesCollectionFilter(resource, collection.filter),
        ).length,
      ).toBeGreaterThan(0);
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

    expect(youtube).toHaveLength(2);
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
    expect(sorted.at(-1)?.category).toBe("automation");
  });
});

describe("facet counts", () => {
  it("returns category counts that sum to the catalog size", () => {
    const counts = getCategoryFacetCounts(
      resources,
      defaultDirectoryFilters,
    );

    expect(counts.all).toBe(56);
    expect(Object.values(counts).reduce((sum, count) => sum + count, 0)).toBe(
      56 + 56,
    );
    expect(counts["data-ai"]).toBe(16);
  });

  it("keeps the category facet at the full catalog size when a category is selected", () => {
    const counts = getCategoryFacetCounts(resources, {
      ...defaultDirectoryFilters,
      category: "web-dev",
    });

    expect(counts.all).toBe(56);
    expect(counts["web-dev"]).toBe(6);
  });

  it("returns level and access counts that sum to the eligible catalog", () => {
    const levels = getLevelFacetCounts(resources, defaultDirectoryFilters);
    const access = getAccessFacetCounts(resources, defaultDirectoryFilters);

    expect(Object.values(levels).reduce((sum, count) => sum + count, 0)).toBe(
      56,
    );
    expect(access.free + access["open-source"]).toBe(52);
  });
});

describe("related resources", () => {
  it("returns up to three resources from the same category", () => {
    const related = getRelatedResources(resources, "django-documentation");

    expect(related).toHaveLength(3);
    expect(related.every((resource) => resource.category === "web-dev")).toBe(
      true,
    );
    expect(related.some((resource) => resource.id === "django-documentation")).toBe(
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
        "q=django&cat=web-dev&level=beginner,advanced&access=free&quick=books&sort=az&view=list&r=django-documentation",
      ),
      resources,
    );

    expect(parsed.filters.query).toBe("django");
    expect(parsed.filters.category).toBe("web-dev");
    expect(parsed.filters.levels).toEqual(["beginner", "advanced"]);
    expect(parsed.filters.access).toEqual(["free"]);
    expect(parsed.filters.collection).toBe("books");
    expect(parsed.filters.sort).toBe("az");
    expect(parsed.filters.view).toBe("list");
    expect(parsed.selectedId).toBe("django-documentation");
  });

  it("ignores invalid categories, levels, access, sort, view, and resource ids", () => {
    const parsed = parseDirectoryParams(
      new URLSearchParams(
        "cat=unknown&level=expert&access=paid&quick=unknown&sort=random&view=table&r=missing",
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
        collection: "books",
        sort: "az",
        view: "list",
      }),
    ).toEqual({
      q: "django",
      cat: "web-dev",
      level: ["beginner"],
      access: ["free"],
      quick: "books",
      sort: "az",
      view: "list",
    });

    expect(serializeDirectoryFilters(defaultDirectoryFilters)).toEqual({
      q: undefined,
      cat: undefined,
      level: undefined,
      access: undefined,
      quick: undefined,
      sort: undefined,
      view: undefined,
    });
  });
});
