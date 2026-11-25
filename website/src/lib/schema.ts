import { z } from "zod";

import { categoryIds, type CategoryId } from "@/data/categories";

const kebabCase = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const difficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export const formatSchema = z.enum([
  "article",
  "book",
  "community",
  "docs",
  "course",
  "podcast",
  "practice",
  "tool",
  "video",
]);

export const accessSchema = z.enum(["free", "open-source", "paid"]);

export const resourceSchema = z
  .object({
    id: z
      .string()
      .trim()
      .min(3, "Id must be at least 3 characters")
      .max(80, "Id must be at most 80 characters")
      .regex(kebabCase, "Id must be lowercase kebab-case"),
    title: z
      .string()
      .trim()
      .min(2, "Title is required")
      .max(100, "Title must be at most 100 characters"),
    url: z
      .string()
      .trim()
      .max(500, "URL must be at most 500 characters")
      .refine((value) => {
        try {
          return new URL(value).protocol === "https:";
        } catch {
          return false;
        }
      }, "URL must be a valid https URL"),
    summary: z
      .string()
      .trim()
      .min(40, "Summary must be at least 40 characters")
      .max(140, "Summary must be at most 140 characters"),
    description: z
      .string()
      .trim()
      .min(120, "Description must be at least 120 characters")
      .max(700, "Description must be at most 700 characters"),
    category: z.enum(categoryIds),
    subcategory: z
      .string()
      .trim()
      .min(2, "Subcategory is required")
      .max(80, "Subcategory must be at most 80 characters"),
    provider: z
      .string()
      .trim()
      .min(2, "Provider must be at least 2 characters")
      .max(80, "Provider must be at most 80 characters")
      .optional(),
    highlights: z
      .array(
        z
          .string()
          .trim()
          .min(12, "Highlights must be at least 12 characters")
          .max(160, "Highlights must be at most 160 characters"),
      )
      .min(1)
      .max(3, "Add at most three highlights")
      .optional(),
    recommendedOrder: z.number().int().min(0).max(9999).optional(),
    tags: z
      .array(
        z
          .string()
          .trim()
          .min(1)
          .max(48, "Tags must be at most 48 characters")
          .regex(kebabCase, "Tags must be lowercase kebab-case"),
      )
      .min(1, "Add at least one tag")
      .max(4, "Add at most four tags")
      .refine((tags) => new Set(tags).size === tags.length, {
        message: "Tags must be unique",
      }),
    difficulty: difficultySchema,
    format: formatSchema,
    access: accessSchema,
    featured: z.boolean(),
  })
  .strict();

export const resourceListSchema = z.array(resourceSchema).min(1);

export type Resource = z.infer<typeof resourceSchema>;
export type Difficulty = z.infer<typeof difficultySchema>;
export type ResourceFormat = z.infer<typeof formatSchema>;
export type ResourceAccess = z.infer<typeof accessSchema>;

export class ContentValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Invalid resource content:\n- ${issues.join("\n- ")}`);
    this.name = "ContentValidationError";
  }
}

export function normalizeUrl(value: string): string {
  const url = new URL(value);
  url.hash = "";
  url.hostname = url.hostname.toLowerCase();

  const pathname = url.pathname.replace(/\/+$/, "");

  return `${url.protocol}//${url.host}${pathname}${url.search}`;
}

export function getCategoryCounts(
  resources: readonly Resource[],
): Record<CategoryId, number> {
  const counts = Object.fromEntries(
    categoryIds.map((category) => [category, 0]),
  ) as Record<CategoryId, number>;

  for (const resource of resources) {
    counts[resource.category] += 1;
  }

  return counts;
}

/**
 * Validate a resource catalog and enforce integrity rules that Zod cannot
 * express per-record: unique ids, unique normalized URLs, and known categories.
 *
 * This runs when the data module is evaluated. `next build` imports the data
 * through the page, so a bad entry fails the build instead of shipping.
 */
export function validateResources(input: unknown): Resource[] {
  const result = resourceListSchema.safeParse(input);

  if (!result.success) {
    throw new ContentValidationError(
      result.error.issues.map(
        (issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`,
      ),
    );
  }

  const resources = result.data;
  const issues: string[] = [];
  const seenIds = new Map<string, string>();
  const seenUrls = new Map<string, string>();
  const knownCategories = new Set<string>(categoryIds);

  for (const resource of resources) {
    const previousId = seenIds.get(resource.id);

    if (previousId) {
      issues.push(
        `Duplicate id "${resource.id}" on "${resource.title}" and "${previousId}".`,
      );
    } else {
      seenIds.set(resource.id, resource.title);
    }

    const normalizedUrl = normalizeUrl(resource.url);
    const previousUrl = seenUrls.get(normalizedUrl);

    if (previousUrl) {
      issues.push(
        `Duplicate URL "${normalizedUrl}" on "${resource.title}" and "${previousUrl}".`,
      );
    } else {
      seenUrls.set(normalizedUrl, resource.title);
    }

    if (!knownCategories.has(resource.category)) {
      issues.push(
        `Unknown category "${resource.category}" on "${resource.title}".`,
      );
    }
  }

  if (issues.length > 0) {
    throw new ContentValidationError(issues);
  }

  return resources;
}
