import automation from "./catalog/tools-automation.json";
import booksGuides from "./catalog/books-guides.json";
import communitiesMedia from "./catalog/communities-media.json";
import coreFoundations from "./catalog/core-foundations.json";
import dataAi from "./catalog/data-ai.json";
import practice from "./catalog/practice-challenges.json";
import webDev from "./catalog/web-dev.json";

import { categoryIds, type CategoryId } from "@/data/categories";
import {
  ContentValidationError,
  getCategoryCounts,
  validateResources,
  type Resource,
} from "@/lib/schema";

const catalogFiles: ReadonlyArray<{
  category: CategoryId;
  entries: unknown[];
}> = [
  { category: "core-foundations", entries: coreFoundations },
  { category: "books-guides", entries: booksGuides },
  { category: "web-dev", entries: webDev },
  { category: "data-ai", entries: dataAi },
  { category: "practice-challenges", entries: practice },
  { category: "tools-automation", entries: automation },
  { category: "communities-media", entries: communitiesMedia },
];

const fileIssues: string[] = [];
const entries: unknown[] = [];

for (const file of catalogFiles) {
  for (const entry of file.entries) {
    if (
      entry &&
      typeof entry === "object" &&
      "category" in entry &&
      entry.category !== file.category
    ) {
      fileIssues.push(
        `Entry "${"title" in entry ? String(entry.title) : "unknown"}" in ${file.category}.json references category "${String(entry.category)}".`,
      );
    }

    entries.push(entry);
  }
}

if (fileIssues.length > 0) {
  throw new ContentValidationError(fileIssues);
}

export const resources: readonly Resource[] = validateResources(entries);

export const categoryCounts: Record<CategoryId, number> =
  getCategoryCounts(resources);

export const resourcesByCategory = Object.fromEntries(
  categoryIds.map((category) => [
    category,
    resources.filter((resource) => resource.category === category),
  ]),
) as Record<CategoryId, Resource[]>;

export const featuredResources = resources.filter(
  (resource) => resource.featured,
);

export function getResourceById(id: string): Resource | undefined {
  return resources.find((resource) => resource.id === id);
}
