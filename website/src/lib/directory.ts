import {
  categories,
  categoryById,
  categoryIds,
  type CategoryId,
} from "@/data/categories";
import {
  collectionFilters,
  type CollectionFilter,
  type CollectionId,
} from "@/data/collections";
import type {
  Difficulty,
  Resource,
  ResourceAccess,
  ResourceFormat,
} from "@/lib/schema";
import type { DirectoryParams } from "@/lib/url";

export { collectionFilters };
export type { CollectionFilter, CollectionId };

export type DirectoryAccessFilter = Extract<
  ResourceAccess,
  "free" | "open-source"
>;
export type SortKey = "recommended" | "az" | "level";
export type ViewMode = "grid" | "list";

export function isCollectionId(value: string): value is CollectionId {
  return Object.prototype.hasOwnProperty.call(collectionFilters, value);
}

export function getCollectionLabel(id: CollectionId): string {
  return collectionFilters[id].label;
}

export function matchesCollectionFilter(
  resource: Resource,
  filter: CollectionFilter,
): boolean {
  if (filter.kind === "category") {
    return resource.category === filter.value;
  }

  if (filter.kind === "format") {
    return resource.format === filter.value;
  }

  return resource.tags.includes(filter.value);
}

export function matchesCollection(
  resource: Resource,
  collectionId: CollectionId,
): boolean {
  return matchesCollectionFilter(resource, collectionFilters[collectionId]);
}

export type DirectoryFilters = {
  query: string;
  category: CategoryId | "all";
  levels: Difficulty[];
  access: DirectoryAccessFilter[];
  collection: CollectionId | null;
  sort: SortKey;
  view: ViewMode;
};

export const defaultDirectoryFilters: DirectoryFilters = {
  query: "",
  category: "all",
  levels: [],
  access: [],
  collection: null,
  sort: "recommended",
  view: "grid",
};

export const difficultyValues = [
  "beginner",
  "intermediate",
  "advanced",
] as const satisfies readonly Difficulty[];

export const difficultyLabels: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const formatLabels: Record<ResourceFormat, string> = {
  article: "Article",
  book: "Book",
  community: "Community",
  docs: "Docs",
  course: "Course",
  podcast: "Podcast",
  practice: "Practice",
  tool: "Tool",
  video: "Video",
};

export const accessLabels: Record<ResourceAccess, string> = {
  free: "Free",
  "open-source": "Open source",
  paid: "Paid",
};

export const sortLabels: Record<SortKey, string> = {
  recommended: "Recommended",
  az: "A–Z",
  level: "Beginner first",
};

export const sortKeys = ["recommended", "az", "level"] as const;
export const viewModes = ["grid", "list"] as const;
export const accessFilterValues = ["free", "open-source"] as const;

const difficultyOrder: Record<Difficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

const categoryOrder = new Map(
  categories.map((category) => [category.id, category.order]),
);

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function parseList(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function resourceSearchText(resource: Resource): string {
  return normalize(
    [
      resource.title,
      resource.summary,
      resource.description,
      resource.tags.join(" "),
      categoryById[resource.category].label,
      resource.subcategory,
      resource.provider ?? "",
      (resource.highlights ?? []).join(" "),
      resource.format,
      resource.difficulty,
      resource.access,
    ].join(" "),
  );
}

export function matchesQuery(resource: Resource, query: string): boolean {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return true;
  }

  const searchText = resourceSearchText(resource);

  return tokens.every((token) => {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|[^a-z0-9])${escaped}`, "i").test(searchText);
  });
}

type FacetToSkip = "category" | "levels" | "access";

function matchesFilters(
  resource: Resource,
  filters: DirectoryFilters,
  skip?: FacetToSkip,
): boolean {
  if (
    skip !== "category" &&
    filters.category !== "all" &&
    resource.category !== filters.category
  ) {
    return false;
  }

  if (
    skip !== "levels" &&
    filters.levels.length > 0 &&
    !filters.levels.includes(resource.difficulty)
  ) {
    return false;
  }

  if (
    skip !== "access" &&
    filters.access.length > 0 &&
    !filters.access.includes(resource.access as DirectoryAccessFilter)
  ) {
    return false;
  }

  if (filters.collection && !matchesCollection(resource, filters.collection)) {
    return false;
  }

  return true;
}

export function filterResources(
  resources: readonly Resource[],
  filters: DirectoryFilters,
): Resource[] {
  return resources.filter(
    (resource) =>
      matchesQuery(resource, filters.query) &&
      matchesFilters(resource, filters),
  );
}

export function sortResources(
  resources: readonly Resource[],
  sort: SortKey,
): Resource[] {
  return [...resources].sort((a, b) => {
    if (sort === "az") {
      return a.title.localeCompare(b.title);
    }

    if (sort === "level") {
      const levelDifference =
        difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];

      if (levelDifference !== 0) {
        return levelDifference;
      }
    }

    if (sort === "recommended") {
      const categoryDifference =
        (categoryOrder.get(a.category) ?? 0) -
        (categoryOrder.get(b.category) ?? 0);

      if (categoryDifference !== 0) {
        return categoryDifference;
      }

      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      const difficultyDifference =
        difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];

      if (difficultyDifference !== 0) {
        return difficultyDifference;
      }
    }

    return a.title.localeCompare(b.title);
  });
}

export function getRelatedResources(
  resources: readonly Resource[],
  resourceId: string,
  limit = 3,
): Resource[] {
  const current = resources.find((resource) => resource.id === resourceId);

  if (!current) {
    return [];
  }

  return sortResources(
    resources.filter(
      (resource) =>
        resource.id !== resourceId && resource.category === current.category,
    ),
    "recommended",
  ).slice(0, limit);
}

export function getCategoryFacetCounts(
  resources: readonly Resource[],
  filters: DirectoryFilters,
): Record<CategoryId | "all", number> {
  const counts = {
    all: 0,
    ...Object.fromEntries(categoryIds.map((category) => [category, 0])),
  } as Record<CategoryId | "all", number>;

  for (const resource of resources) {
    if (
      matchesQuery(resource, filters.query) &&
      matchesFilters(resource, filters, "category")
    ) {
      counts.all += 1;
      counts[resource.category] += 1;
    }
  }

  return counts;
}

export function getLevelFacetCounts(
  resources: readonly Resource[],
  filters: DirectoryFilters,
): Record<Difficulty, number> {
  const counts = Object.fromEntries(
    difficultyValues.map((difficulty) => [difficulty, 0]),
  ) as Record<Difficulty, number>;

  for (const resource of resources) {
    if (
      matchesQuery(resource, filters.query) &&
      matchesFilters(resource, filters, "levels")
    ) {
      counts[resource.difficulty] += 1;
    }
  }

  return counts;
}

export function getAccessFacetCounts(
  resources: readonly Resource[],
  filters: DirectoryFilters,
): Record<DirectoryAccessFilter, number> {
  const counts = { free: 0, "open-source": 0 };

  for (const resource of resources) {
    if (
      matchesQuery(resource, filters.query) &&
      matchesFilters(resource, filters, "access") &&
      (resource.access === "free" || resource.access === "open-source")
    ) {
      counts[resource.access] += 1;
    }
  }

  return counts;
}

export function hasActiveFilters(filters: DirectoryFilters): boolean {
  return (
    filters.query.trim().length > 0 ||
    filters.category !== "all" ||
    filters.levels.length > 0 ||
    filters.access.length > 0 ||
    filters.collection !== null
  );
}

export function isDifficulty(value: string): value is Difficulty {
  return difficultyValues.includes(value as Difficulty);
}

export function isAccessFilter(value: string): value is DirectoryAccessFilter {
  return accessFilterValues.includes(value as DirectoryAccessFilter);
}

export function isSortKey(value: string): value is SortKey {
  return sortKeys.includes(value as SortKey);
}

export function isViewMode(value: string): value is ViewMode {
  return viewModes.includes(value as ViewMode);
}

export function parseDirectoryParams(
  params: URLSearchParams,
  resources: readonly Resource[],
): { filters: DirectoryFilters; selectedId: string | null } {
  const filters: DirectoryFilters = {
    ...defaultDirectoryFilters,
    levels: [],
    access: [],
  };

  const query = params.get("q")?.trim();

  if (query) {
    filters.query = query.slice(0, 80);
  }

  const category = params.get("cat");

  if (
    category &&
    (categoryIds as readonly string[]).includes(category)
  ) {
    filters.category = category as CategoryId;
  }

  filters.levels = [
    ...new Set(parseList(params.get("level")).filter(isDifficulty)),
  ];

  filters.access = [
    ...new Set(parseList(params.get("access")).filter(isAccessFilter)),
  ];

  const quick = params.get("quick");

  if (quick && isCollectionId(quick)) {
    filters.collection = quick;
  }

  const sort = params.get("sort");

  if (sort && isSortKey(sort)) {
    filters.sort = sort;
  }

  const view = params.get("view");

  if (view && isViewMode(view)) {
    filters.view = view;
  }

  const requestedResource = params.get("r");
  const selectedId =
    requestedResource &&
    resources.some((resource) => resource.id === requestedResource)
      ? requestedResource
      : null;

  return { filters, selectedId };
}

export function serializeDirectoryFilters(
  filters: DirectoryFilters,
): DirectoryParams {
  return {
    q: filters.query.trim() || undefined,
    cat: filters.category === "all" ? undefined : filters.category,
    level: filters.levels.length > 0 ? [...filters.levels] : undefined,
    access: filters.access.length > 0 ? [...filters.access] : undefined,
    quick: filters.collection ?? undefined,
    sort: filters.sort === "recommended" ? undefined : filters.sort,
    view: filters.view === "grid" ? undefined : filters.view,
  };
}
