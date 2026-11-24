export type CollectionFilterKind = "category" | "format" | "tag";

export type CollectionFilter = {
  kind: CollectionFilterKind;
  value: string;
};

export const collectionFilters = {
  official: { label: "Official", kind: "tag", value: "official" },
  books: { label: "Books", kind: "category", value: "books-guides" },
  youtube: { label: "YouTube", kind: "format", value: "video" },
  agents: { label: "AI Agents", kind: "tag", value: "agents" },
  tools: { label: "Tools", kind: "category", value: "tools-cheatsheets" },
  communities: { label: "Communities", kind: "tag", value: "community" },
  practice: { label: "Practice", kind: "category", value: "practice" },
  articles: { label: "Blogs & Articles", kind: "tag", value: "articles" },
  "data-ai": { label: "AI & Data", kind: "category", value: "data-ai" },
} as const satisfies Record<
  string,
  CollectionFilter & {
    label: string;
  }
>;

export type CollectionId = keyof typeof collectionFilters;

export const collectionAccents = [
  "chocolate",
  "sage",
  "brand",
  "fern",
  "ink",
] as const;

export type CollectionAccent = (typeof collectionAccents)[number];

export const collectionIconKeys = [
  "play",
  "book-open",
  "newspaper",
  "database",
  "terminal",
] as const;

export type CollectionIconKey = (typeof collectionIconKeys)[number];

type CollectionCardBase = {
  id: string;
  title: string;
  subtitle: string;
  collectionId: CollectionId;
  filter: CollectionFilter;
  accent: CollectionAccent;
  icon: CollectionIconKey;
};

export type CollectionCard = CollectionCardBase & {
  variant: "card";
};

export type CollectionFeature = CollectionCardBase & {
  variant: "feature";
  accent: "ink";
  eyebrow: string;
  ctaLabel: string;
  terminal: {
    prompt: string;
    command: string;
    string: string;
    suffix: string;
  };
};

export type ExploreCollection = CollectionCard | CollectionFeature;

export const exploreCollections: readonly ExploreCollection[] = [
  {
    id: "youtube",
    variant: "card",
    title: "YouTube Channels",
    subtitle: "Curated Python channels and playlists.",
    collectionId: "youtube",
    filter: collectionFilters.youtube,
    accent: "chocolate",
    icon: "play",
  },
  {
    id: "books",
    variant: "card",
    title: "Books",
    subtitle: "Essential books for all levels.",
    collectionId: "books",
    filter: collectionFilters.books,
    accent: "sage",
    icon: "book-open",
  },
  {
    id: "blogs",
    variant: "card",
    title: "Blogs & Articles",
    subtitle: "In-depth guides, tutorials, and docs.",
    collectionId: "articles",
    filter: collectionFilters.articles,
    accent: "brand",
    icon: "newspaper",
  },
  {
    id: "ai-data",
    variant: "card",
    title: "AI & Data",
    subtitle: "Python-powered AI, ML, and data tools.",
    collectionId: "data-ai",
    filter: collectionFilters["data-ai"],
    accent: "fern",
    icon: "database",
  },
  {
    id: "practice",
    variant: "feature",
    title: "Learn by building.",
    subtitle:
      "Exercises and project ideas that turn the language into muscle memory.",
    eyebrow: "Practice & Playground",
    ctaLabel: "Explore Practice",
    collectionId: "practice",
    filter: collectionFilters.practice,
    accent: "ink",
    icon: "terminal",
    terminal: {
      prompt: ">>>",
      command: "print",
      string: '"Hello, Python!"',
      suffix: ")",
    },
  },
];
