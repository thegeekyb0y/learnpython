import type { CategoryId } from "@/data/categories";
import type { CollectionId } from "@/data/collections";
import type { Resource, ResourceFormat } from "@/lib/schema";

export type ResourceGroupRule = {
  ids?: readonly string[];
  categories?: readonly CategoryId[];
  subcategories?: readonly string[];
  excludeSubcategories?: readonly string[];
  formats?: readonly ResourceFormat[];
  tags?: readonly string[];
};

export type ResourceGroupDefinition = {
  id: string;
  title: string;
  /** Singular label used in the card eyebrow. */
  eyebrow: string;
  /** One-line helper shown under the group header. */
  note: string;
  rule: ResourceGroupRule;
};

export type SectionDefinition = {
  key: string;
  title: string;
  groups: readonly ResourceGroupDefinition[];
};

export type SectionScope = {
  collection: CollectionId | null;
  category: CategoryId | "all";
};

export function matchesGroupRule(
  resource: Resource,
  rule: ResourceGroupRule,
): boolean {
  if (rule.ids && !rule.ids.includes(resource.id)) {
    return false;
  }

  if (rule.categories && !rule.categories.includes(resource.category)) {
    return false;
  }

  if (
    rule.subcategories &&
    !rule.subcategories.includes(resource.subcategory)
  ) {
    return false;
  }

  if (
    rule.excludeSubcategories &&
    rule.excludeSubcategories.includes(resource.subcategory)
  ) {
    return false;
  }

  if (rule.formats && !rule.formats.includes(resource.format)) {
    return false;
  }

  if (rule.tags && !rule.tags.every((tag) => resource.tags.includes(tag))) {
    return false;
  }

  return true;
}

const youtubeSections: SectionDefinition = {
  key: "collection:youtube",
  title: "YouTube",
  groups: [
    {
      id: "core-python-playlists",
      title: "Core Python Playlists",
      eyebrow: "Core Python Playlist",
      note: "Beginner-to-advanced courses, including regional-language series.",
      rule: {
        categories: ["communities-media"],
        subcategories: ["Python Playlists on Youtube"],
      },
    },
    {
      id: "ai-ml-playlists",
      title: "AI & ML Playlists",
      eyebrow: "AI & ML Playlist",
      note: "Neural networks, deep learning, and LLM build-alongs.",
      rule: {
        categories: ["data-ai"],
        formats: ["video"],
      },
    },
    {
      id: "top-python-creators",
      title: "Top Python Creators",
      eyebrow: "Top Python Creator",
      note: "Dedicated channels for Python and software engineering.",
      rule: {
        subcategories: ["Top Youtube Creators"],
        formats: ["video"],
      },
    },
  ],
};

const officialSections: SectionDefinition = {
  key: "collection:official",
  title: "Official Documentation",
  groups: [
    {
      id: "core-python-docs",
      title: "Core Python Docs & PEPs",
      eyebrow: "Core Python Docs",
      note: "Language reference, official downloads, and getting-started guides.",
      rule: {
        categories: ["core-foundations"],
      },
    },
    {
      id: "ai-ml-framework-docs",
      title: "AI & ML Framework Docs",
      eyebrow: "AI & ML Framework Docs",
      note: "Official references for LLM, ML, vector, and agent tooling.",
      rule: {
        categories: ["data-ai"],
        excludeSubcategories: ["Books & Documentation"],
      },
    },
    {
      id: "ecosystem-references",
      title: "Ecosystem References",
      eyebrow: "Ecosystem Reference",
      note: "Cross-cutting cookbooks and ecosystem guides.",
      rule: {
        ids: ["openai-cookbook"],
      },
    },
  ],
};

const dataAiSections: SectionDefinition = {
  key: "category:data-ai",
  title: "Data & AI",
  groups: [
    {
      id: "generative-ai-llms",
      title: "Generative AI & LLMs",
      eyebrow: "Generative AI & LLM",
      note: "Model APIs, prompt engineering, and LLM application guides.",
      rule: {
        subcategories: [
          "Generative AI & Large Language Models",
          "Books & Documentation",
        ],
      },
    },
    {
      id: "building-ai-agents",
      title: "Building AI Agents",
      eyebrow: "AI Agent",
      note: "Frameworks and SDKs for tool-using, multi-step agents.",
      rule: { subcategories: ["Building AI Agents in Python"] },
    },
    {
      id: "vector-databases-rag",
      title: "Vector Databases & RAG",
      eyebrow: "Vector DB & RAG",
      note: "Similarity search, embeddings, and retrieval pipelines.",
      rule: { subcategories: ["Vector Databases & RAG"] },
    },
    {
      id: "model-context-protocol",
      title: "Model Context Protocol (MCP)",
      eyebrow: "MCP",
      note: "Protocol specs, SDKs, and reference servers for MCP.",
      rule: { subcategories: ["Model Context Protocol (MCP) with Python"] },
    },
    {
      id: "fine-tuning-llms",
      title: "Fine-Tuning LLMs",
      eyebrow: "Fine-Tuning",
      note: "PEFT, LoRA, QLoRA, and efficient training workflows.",
      rule: {
        subcategories: ["Fine-Tuning LLMs in Python (PEFT, LoRA, QLoRA)"],
      },
    },
    {
      id: "build-llm-from-scratch",
      title: "Build an LLM From Scratch",
      eyebrow: "LLM From Scratch",
      note: "Tokenizers, transformers, and GPT training by hand.",
      rule: { subcategories: ["Build an LLM From Scratch in Python"] },
    },
    {
      id: "modern-ml-frameworks",
      title: "Modern ML Frameworks",
      eyebrow: "Modern ML",
      note: "PyTorch, TensorFlow, JAX, scikit-learn, and XGBoost.",
      rule: { subcategories: ["Modern ML Frameworks"] },
    },
    {
      id: "evaluating-testing-llm-apps",
      title: "Evaluating & Testing LLM Apps",
      eyebrow: "LLM Evaluation",
      note: "Tracing, evals, prompt testing, and observability.",
      rule: { subcategories: ["Evaluating & Testing LLM Apps in Python"] },
    },
    {
      id: "local-open-source-llms",
      title: "Local & Open-Source LLMs",
      eyebrow: "Local LLM",
      note: "Run, serve, and quantize open models locally.",
      rule: {
        subcategories: ["Running Local & Open-Source LLMs with Python"],
      },
    },
    {
      id: "ai-ml-playlists",
      title: "AI & ML Playlists",
      eyebrow: "AI & ML Playlist",
      note: "Video courses on neural networks, ML, and LLM builds.",
      rule: { subcategories: ["AI/ML YouTube Playlists"] },
    },
    {
      id: "ai-research-blogs",
      title: "AI Research & Blogs",
      eyebrow: "AI Research & Blog",
      note: "Research writing, paper implementations, and AI updates.",
      rule: { subcategories: ["AI/ML Blogs & Communities"] },
    },
    {
      id: "domain-applications",
      title: "Domain Applications",
      eyebrow: "Domain Application",
      note: "Data science, machine learning, and specialized fields.",
      rule: {
        subcategories: [
          "Python for Different Fields",
          "Other Useful GitHub Repositories",
        ],
      },
    },
  ],
};

const communitiesSections: SectionDefinition = {
  key: "category:communities-media",
  title: "Communities & Media",
  groups: [
    {
      id: "youtube-playlists",
      title: "YouTube Playlists",
      eyebrow: "YouTube Playlist",
      note: "Full courses and series for structured learning.",
      rule: { subcategories: ["Python Playlists on Youtube"] },
    },
    {
      id: "top-youtube-creators",
      title: "Top YouTube Creators",
      eyebrow: "YouTube Creator",
      note: "Channels worth following for new Python content.",
      rule: { subcategories: ["Top Youtube Creators"] },
    },
    {
      id: "engineering-blogs",
      title: "Engineering Blogs",
      eyebrow: "Engineering Blog",
      note: "Tutorial sites and publications with practical write-ups.",
      rule: {
        subcategories: ["Top Blogs", "AI/ML Blogs & Communities"],
      },
    },
    {
      id: "x-twitter-creators",
      title: "X / Twitter Creators",
      eyebrow: "X / Twitter Creator",
      note: "Short-form tips, releases, and community conversation.",
      rule: { subcategories: ["Top Twitter Creators"] },
    },
    {
      id: "podcasts",
      title: "Podcasts",
      eyebrow: "Podcast",
      note: "Interviews and news for commutes and deep dives.",
      rule: { subcategories: ["Top Podcasts"] },
    },
  ],
};

const toolsSections: SectionDefinition = {
  key: "category:tools-automation",
  title: "Tools & Automation",
  groups: [
    {
      id: "cheatsheets",
      title: "Cheatsheets & Quick References",
      eyebrow: "Cheatsheet & Quick Reference",
      note: "Printable and searchable references for daily work.",
      rule: { subcategories: ["Cheatsheets"] },
    },
    {
      id: "ai-coding-agents",
      title: "AI Coding Agents",
      eyebrow: "AI Coding Agent",
      note: "Assistants that edit, run, and refactor Python code.",
      rule: { subcategories: ["AI Coding Agents for Python Development"] },
    },
    {
      id: "developer-tools-ides",
      title: "Developer Tools & IDEs",
      eyebrow: "Developer Tool",
      note: "Editors and IDEs with strong Python support.",
      rule: { subcategories: ["General"] },
    },
  ],
};

export const sectionDefinitions = [
  youtubeSections,
  officialSections,
  dataAiSections,
  communitiesSections,
  toolsSections,
] as const;

export function getSectionDefinition(
  scope: SectionScope,
): SectionDefinition | null {
  if (scope.collection === "youtube") {
    return youtubeSections;
  }

  if (scope.collection === "official") {
    return officialSections;
  }

  if (scope.collection === "communities") {
    return communitiesSections;
  }

  if (scope.collection === "tools") {
    return toolsSections;
  }

  if (scope.category === "data-ai") {
    return dataAiSections;
  }

  if (scope.category === "communities-media") {
    return communitiesSections;
  }

  if (scope.category === "tools-automation") {
    return toolsSections;
  }

  return null;
}

export function getGroupForResource(
  resource: Resource,
  section: SectionDefinition,
): ResourceGroupDefinition | undefined {
  return section.groups.find((group) =>
    matchesGroupRule(resource, group.rule),
  );
}
