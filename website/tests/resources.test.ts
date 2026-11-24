import { describe, expect, it } from "vitest";

import { categories, categoryIds } from "@/data/categories";
import {
  categoryCounts,
  featuredResources,
  resources,
  resourcesByCategory,
} from "@/data/resources";
import { normalizeUrl, resourceSchema } from "@/lib/schema";

const expectedCounts = {
  "core-foundations": 9,
  "books-guides": 6,
  "web-dev": 6,
  "data-ai": 16,
  practice: 6,
  "tools-cheatsheets": 7,
  automation: 6,
} as const;

describe("resource catalog", () => {
  it("ships 50–60 curated resources", () => {
    expect(resources.length).toBeGreaterThanOrEqual(50);
    expect(resources.length).toBeLessThanOrEqual(60);
    expect(resources.length).toBe(56);
  });

  it("validates every resource against the schema", () => {
    for (const resource of resources) {
      expect(resourceSchema.safeParse(resource).success).toBe(true);
    }
  });

  it("has no duplicate ids", () => {
    const ids = resources.map((resource) => resource.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has no duplicate normalized URLs", () => {
    const urls = resources.map((resource) => normalizeUrl(resource.url));
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("uses only categories defined in the taxonomy", () => {
    const known = new Set<string>(categoryIds);
    for (const resource of resources) {
      expect(known.has(resource.category)).toBe(true);
    }
  });

  it("has a populated count for every category", () => {
    for (const category of categories) {
      expect(categoryCounts[category.id]).toBeGreaterThan(0);
    }
  });

  it("returns the expected distribution across categories", () => {
    expect(categoryCounts).toEqual(expectedCounts);
  });

  it("keeps category counts in sync with resources", () => {
    const total = Object.values(categoryCounts).reduce(
      (sum, count) => sum + count,
      0,
    );
    expect(total).toBe(resources.length);

    for (const category of categories) {
      expect(categoryCounts[category.id]).toBe(
        resources.filter((resource) => resource.category === category.id)
          .length,
      );
      expect(resourcesByCategory[category.id].length).toBe(
        categoryCounts[category.id],
      );
    }
  });

  it("features a deliberate, small set", () => {
    expect(featuredResources.length).toBe(12);
    expect(featuredResources.length).toBeLessThan(resources.length);
  });
});
