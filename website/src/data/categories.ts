export const categoryIds = [
  "core-foundations",
  "books-guides",
  "web-dev",
  "data-ai",
  "practice",
  "tools-cheatsheets",
  "automation",
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
      "The language itself: official docs, tutorials, and the best starting paths.",
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
    id: "practice",
    label: "Practice & Challenges",
    description:
      "Exercises, challenges, and project collections that build fluency.",
    order: 5,
  },
  {
    id: "tools-cheatsheets",
    label: "Tools & Cheatsheets",
    description:
      "Editors, references, and compact cheat sheets for daily work.",
    order: 6,
  },
  {
    id: "automation",
    label: "Automation",
    description:
      "Scripting the boring parts: files, browsers, schedules, and HTTP.",
    order: 7,
  },
] as const satisfies readonly Category[];

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<CategoryId, Category>;

export function getCategoryLabel(id: CategoryId): string {
  return categoryById[id].label;
}
