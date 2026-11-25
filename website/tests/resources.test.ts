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
  "core-foundations": 7,
  "books-guides": 6,
  "web-dev": 1,
  "data-ai": 64,
  "practice-challenges": 6,
  "tools-automation": 20,
  "communities-media": 44,
} as const;

describe("resource catalog", () => {
  it("ships the complete README catalog", () => {
    expect(resources.length).toBeGreaterThanOrEqual(100);
    expect(resources.length).toBe(148);
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
    expect(featuredResources.length).toBe(10);
    expect(featuredResources.length).toBeLessThan(resources.length);
  });

  it("groups every resource under a non-empty subcategory", () => {
    for (const resource of resources) {
      expect(resource.subcategory.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps each catalog file sorted by featured, subcategory, then title", () => {
    for (const category of categories) {
      const entries = resourcesByCategory[category.id];

      for (let index = 1; index < entries.length; index += 1) {
        const previous = entries[index - 1];
        const current = entries[index];

        if (previous.featured !== current.featured) {
          expect(previous.featured).toBe(true);
          continue;
        }

        const subcategory = previous.subcategory.localeCompare(
          current.subcategory,
          "en",
        );
        expect(subcategory).toBeLessThanOrEqual(0);

        if (subcategory === 0) {
          expect(
            previous.title.localeCompare(current.title, "en"),
          ).toBeLessThanOrEqual(0);
        }
      }
    }
  });

  it("provides providers and optional highlights where sourced", () => {
    expect(resources.filter((resource) => resource.provider).length).toBeGreaterThan(
      100,
    );
    expect(resources.filter((resource) => resource.highlights).length).toBeGreaterThan(
      30,
    );

    for (const resource of resources) {
      expect(resource.highlights?.length ?? 0).toBeLessThanOrEqual(3);
    }
  });
});
