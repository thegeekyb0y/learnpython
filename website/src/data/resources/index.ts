import automation from "./automation.json";
import booksGuides from "./books-guides.json";
import coreFoundations from "./core-foundations.json";
import dataAi from "./data-ai.json";
import practice from "./practice.json";
import toolsCheatsheets from "./tools-cheatsheets.json";
import webDev from "./web-dev.json";

import { categoryIds, type CategoryId } from "@/data/categories";
import {
  ContentValidationError,
  getCategoryCounts,
  validateResources,
  type Resource,
} from "@/lib/schema";

const files: ReadonlyArray<{ category: CategoryId; entries: unknown[] }> = [
  { category: "core-foundations", entries: coreFoundations },
  { category: "books-guides", entries: booksGuides },
  { category: "web-dev", entries: webDev },
  { category: "data-ai", entries: dataAi },
  { category: "practice", entries: practice },
  { category: "tools-cheatsheets", entries: toolsCheatsheets },
  { category: "automation", entries: automation },
];

const fileIssues: string[] = [];
const entries: unknown[] = [];

for (const file of files) {
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
