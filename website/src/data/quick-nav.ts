import type {
  CollectionAccent,
  CollectionFilter,
  CollectionId,
} from "@/data/collections";
import { collectionFilters } from "@/data/collections";

export const quickNavIconKeys = [
  "badge-check",
  "book-open",
  "play",
  "bot",
  "wrench",
  "users",
  "target",
] as const;

export type QuickNavIconKey = (typeof quickNavIconKeys)[number];

export type QuickNavItem = {
  id: CollectionId;
  label: string;
  filter: CollectionFilter;
  accent: CollectionAccent;
  icon: QuickNavIconKey;
  /** Optional custom asset for contributors who want a branded icon. */
  iconSrc?: string;
};

export const quickNavItems: readonly QuickNavItem[] = [
  {
    id: "official",
    label: "Official",
    filter: collectionFilters.official,
    accent: "brand",
    icon: "badge-check",
  },
  {
    id: "books",
    label: "Books",
    filter: collectionFilters.books,
    accent: "ink",
    icon: "book-open",
  },
  {
    id: "youtube",
    label: "YouTube",
    filter: collectionFilters.youtube,
    accent: "chocolate",
    icon: "play",
  },
  {
    id: "agents",
    label: "AI Agents",
    filter: collectionFilters.agents,
    accent: "fern",
    icon: "bot",
  },
  {
    id: "tools",
    label: "Tools",
    filter: collectionFilters.tools,
    accent: "brand",
    icon: "wrench",
  },
  {
    id: "communities",
    label: "Communities",
    filter: collectionFilters.communities,
    accent: "ink",
    icon: "users",
  },
  {
    id: "practice",
    label: "Practice",
    filter: collectionFilters.practice,
    accent: "chocolate",
    icon: "target",
  },
];
