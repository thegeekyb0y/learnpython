export type CollectionFilterKind = "category" | "format" | "tag";

export type CollectionFilter = {
  kind: CollectionFilterKind;
  value: string;
};

export const collectionFilters = {
  official: {
    label: "Official Documentation",
    kind: "tag",
    value: "official",
  },
  books: { label: "Books", kind: "category", value: "books-guides" },
  youtube: { label: "YouTube", kind: "format", value: "video" },
  agents: { label: "AI Agents", kind: "tag", value: "agents" },
  tools: { label: "Tools", kind: "category", value: "tools-automation" },
  communities: { label: "Communities", kind: "tag", value: "community" },
  practice: {
    label: "Practice",
    kind: "category",
    value: "practice-challenges",
  },
} as const satisfies Record<
  string,
  CollectionFilter & {
    label: string;
  }
>;

export type CollectionId = keyof typeof collectionFilters;

export const collectionAccents = [
  "chocolate",
  "brand",
  "fern",
  "ink",
] as const;

export type CollectionAccent = (typeof collectionAccents)[number];
