import { describe, expect, it } from "vitest";

import {
  ContentValidationError,
  getCategoryCounts,
  normalizeUrl,
  resourceSchema,
  validateResources,
} from "@/lib/schema";

const validResource = {
  id: "python-docs",
  title: "Python Documentation",
  url: "https://docs.python.org/",
  summary:
    "A concise, validated summary that comfortably exceeds forty characters.",
  description:
    "This description is deliberately long enough to satisfy the minimum length requirement for detailed drawer copy while remaining easy to read in a test fixture.",
  category: "core-foundations",
  subcategory: "General",
  tags: ["official", "reference"],
  difficulty: "beginner",
  format: "docs",
  access: "free",
  featured: false,
} as const;

describe("resourceSchema", () => {
  it("accepts a valid resource", () => {
    expect(resourceSchema.safeParse(validResource).success).toBe(true);
  });

  it("accepts provider, highlights, and recommendedOrder", () => {
    expect(
      resourceSchema.safeParse({
        ...validResource,
        provider: "Python Software Foundation",
        highlights: [
          "Official language and standard library reference",
          "Versioned documentation for every release",
        ],
        recommendedOrder: 0,
      }).success,
    ).toBe(true);
  });

  it("rejects non-https URLs", () => {
    const result = resourceSchema.safeParse({
      ...validResource,
      url: "http://docs.python.org/",
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed URLs", () => {
    const result = resourceSchema.safeParse({
      ...validResource,
      url: "not a url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects summaries over the strict limit", () => {
    const result = resourceSchema.safeParse({
      ...validResource,
      summary: "a".repeat(141),
    });
    expect(result.success).toBe(false);
  });

  it("rejects descriptions that are too short", () => {
    const result = resourceSchema.safeParse({
      ...validResource,
      description: "Too short.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than four tags", () => {
    const result = resourceSchema.safeParse({
      ...validResource,
      tags: ["one", "two", "three", "four", "five"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects duplicate tags", () => {
    const result = resourceSchema.safeParse({
      ...validResource,
      tags: ["official", "official"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown categories", () => {
    const result = resourceSchema.safeParse({
      ...validResource,
      category: "not-a-category",
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown formats, difficulties, and access values", () => {
    expect(
      resourceSchema.safeParse({ ...validResource, format: "webinar" }).success,
    ).toBe(false);
    expect(
      resourceSchema.safeParse({
        ...validResource,
        difficulty: "expert",
      }).success,
    ).toBe(false);
    expect(
      resourceSchema.safeParse({
        ...validResource,
        access: "freemium",
      }).success,
    ).toBe(false);
  });

  it("requires a subcategory and rejects overlong highlights", () => {
    const withoutSubcategory: Record<string, unknown> = { ...validResource };
    delete withoutSubcategory.subcategory;
    expect(resourceSchema.safeParse(withoutSubcategory).success).toBe(false);
    expect(
      resourceSchema.safeParse({
        ...validResource,
        highlights: [
          "A first highlight of sensible length",
          "A second highlight of sensible length",
          "A third highlight of sensible length",
          "A fourth highlight of sensible length",
        ],
      }).success,
    ).toBe(false);
    expect(
      resourceSchema.safeParse({
        ...validResource,
        recommendedOrder: 1.5,
      }).success,
    ).toBe(false);
  });

  it("accepts the extended media formats", () => {
    for (const format of ["article", "podcast", "community"]) {
      expect(
        resourceSchema.safeParse({ ...validResource, format }).success,
      ).toBe(true);
    }
  });

  it("rejects extra fields in strict mode", () => {
    const result = resourceSchema.safeParse({
      ...validResource,
      unexpectedField: "Python Software Foundation",
    });
    expect(result.success).toBe(false);
  });
});

describe("validateResources", () => {
  it("returns parsed resources", () => {
    expect(validateResources([validResource])).toHaveLength(1);
  });

  it("rejects duplicate ids", () => {
    expect(() =>
      validateResources([
        validResource,
        {
          ...validResource,
          title: "Duplicate",
          url: "https://example.com/python-docs",
        },
      ]),
    ).toThrow(ContentValidationError);
  });

  it("rejects duplicate URLs after normalization", () => {
    expect(() =>
      validateResources([
        validResource,
        {
          ...validResource,
          id: "python-docs-copy",
          title: "Copy",
          url: "https://docs.python.org/#tutorial",
        },
      ]),
    ).toThrow(/Duplicate URL/);
  });

  it("normalizes trailing slashes, hashes, and host case", () => {
    expect(normalizeUrl("https://Docs.Python.org/3/#tutorial")).toBe(
      "https://docs.python.org/3",
    );
    expect(normalizeUrl("https://docs.python.org/3/")).toBe(
      "https://docs.python.org/3",
    );
  });
});

describe("getCategoryCounts", () => {
  it("returns a zero-filled count for every category", () => {
    const resources = validateResources([
      validResource,
      {
        ...validResource,
        id: "scikit-learn",
        title: "scikit-learn",
        url: "https://scikit-learn.org/",
        category: "data-ai",
      },
    ]);

    const counts = getCategoryCounts(resources);

    expect(counts["core-foundations"]).toBe(1);
    expect(counts["data-ai"]).toBe(1);
    expect(counts["books-guides"]).toBe(0);
    expect(counts["tools-automation"]).toBe(0);
    expect(Object.values(counts).reduce((sum, count) => sum + count, 0)).toBe(2);
  });
});
