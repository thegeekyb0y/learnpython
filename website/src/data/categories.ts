export const categoryIds = [
  "core-foundations",
  "books-guides",
  "web-dev",
  "data-ai",
  "practice-challenges",
  "tools-automation",
  "communities-media",
] as const;

export type CategoryId = (typeof categoryIds)[number];

export type Category = {
  id: CategoryId;
  label: string;
  description: string;
  order: number;
};

export const categories = [
  {
    id: "core-foundations",
    label: "Core & Foundations",
    description:
      "The language itself: official docs, starting paths, and general references.",
    order: 1,
  },
  {
    id: "books-guides",
    label: "Books & Guides",
    description:
      "Long-form books and structured guides worth keeping on the desk.",
    order: 2,
  },
  {
    id: "web-dev",
    label: "Web Dev",
    description: "Frameworks, APIs, and the data layer for Python on the web.",
    order: 3,
  },
  {
    id: "data-ai",
    label: "Data & AI",
    description:
      "Data science, machine learning, LLMs, RAG, agents, and local models.",
    order: 4,
  },
  {
    id: "practice-challenges",
    label: "Practice & Challenges",
    description:
      "Exercises, challenges, and project collections that build fluency.",
    order: 5,
  },
  {
    id: "tools-automation",
    label: "Tools & Automation",
    description:
      "Editors, cheat sheets, agents, and utilities for daily work.",
    order: 6,
  },
  {
    id: "communities-media",
    label: "Communities & Media",
    description:
      "Creators, newsletters, podcasts, and places to learn with others.",
    order: 7,
  },
] as const satisfies readonly Category[];

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<CategoryId, Category>;

export function getCategoryLabel(id: CategoryId): string {
  return categoryById[id].label;
}
