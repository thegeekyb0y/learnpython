import { describe, expect, it } from "vitest";

import { categories, categoryById, categoryIds } from "@/data/categories";

describe("category taxonomy", () => {
  it("stays focused at seven top-level categories", () => {
    expect(categories).toHaveLength(7);
    expect(categoryIds).toHaveLength(7);
  });

  it("has unique ids and labels", () => {
    expect(new Set(categories.map((category) => category.id)).size).toBe(
      categories.length,
    );
    expect(new Set(categories.map((category) => category.label)).size).toBe(
      categories.length,
    );
  });

  it("has contiguous display order", () => {
    expect(categories.map((category) => category.order)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  it("gives every category a label and description", () => {
    for (const category of categories) {
      expect(category.label.length).toBeGreaterThan(0);
      expect(category.description.length).toBeGreaterThan(20);
      expect(categoryById[category.id]).toBe(category);
    }
  });
});
