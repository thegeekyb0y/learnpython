"use client";

import { X } from "lucide-react";

import { CategoryPills } from "@/components/shell/category-pills";
import { FilterControls } from "@/components/shell/filter-controls";
import {
  SectionPills,
  type SectionPill,
} from "@/components/shell/section-pills";
import type { Category, CategoryId } from "@/data/categories";
import type { CollectionId } from "@/data/collections";
import type {
  DirectoryAccessFilter,
  SortKey,
  ViewMode,
} from "@/lib/directory";
import { getCollectionLabel } from "@/lib/directory";
import type { Difficulty } from "@/lib/schema";

type FilterBarProps = {
  categories: readonly Category[];
  categoryCounts: Record<CategoryId | "all", number>;
  activeCategory: CategoryId | "all";
  activeCollection: CollectionId | null;
  activeSection: string | null;
  sectionTotal: number;
  sectionPills: readonly SectionPill[] | null;
  levels: Difficulty[];
  levelCounts: Record<Difficulty, number>;
  access: DirectoryAccessFilter[];
  accessCounts: Record<DirectoryAccessFilter, number>;
  sort: SortKey;
  view: ViewMode;
  onSelectCategory: (category: CategoryId | "all") => void;
  onClearCollection: () => void;
  onSelectSection: (section: string | null) => void;
  onToggleLevel: (level: Difficulty) => void;
  onToggleAccess: (access: DirectoryAccessFilter) => void;
  onClearLevels: () => void;
  onSortChange: (sort: SortKey) => void;
  onViewChange: (view: ViewMode) => void;
};

export function FilterBar({
  categories,
  categoryCounts,
  activeCategory,
  activeCollection,
  activeSection,
  sectionTotal,
  sectionPills,
  levels,
  levelCounts,
  access,
  accessCounts,
  sort,
  view,
  onSelectCategory,
  onClearCollection,
  onSelectSection,
  onToggleLevel,
  onToggleAccess,
  onClearLevels,
  onSortChange,
  onViewChange,
}: FilterBarProps) {
  return (
    <section
      data-slot="filter-bar"
      aria-label="Filter and sort resources"
      className="sticky top-14 z-20 border-b border-hairline bg-surface/85 backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 py-2 sm:px-6 lg:px-8">
        {activeCollection ? (
          <div className="flex items-center">
            <button
              type="button"
              onClick={onClearCollection}
              aria-label={`Collection: ${getCollectionLabel(activeCollection)} - clear filter`}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-brand-line bg-brand-soft px-3 text-[12px] font-medium text-ink outline-none transition-colors hover:border-brand/40 focus-visible:ring-[3px] focus-visible:ring-brand-ring"
            >
              <span>Collection: {getCollectionLabel(activeCollection)}</span>
              <X className="size-3.5 text-ink-3" aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
          <div className="relative min-w-0 flex-1">
            {sectionPills ? (
              <SectionPills
                total={sectionTotal}
                pills={sectionPills}
                activeSection={activeSection}
                onSelect={onSelectSection}
              />
            ) : (
              <CategoryPills
                categories={categories}
                counts={categoryCounts}
                activeCategory={activeCategory}
                onSelect={onSelectCategory}
              />
            )}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-surface via-surface/80 to-transparent"
            />
          </div>

          <div className="relative min-w-0 shrink-0 lg:border-l lg:border-hairline lg:pl-4">
            <FilterControls
              levels={levels}
              levelCounts={levelCounts}
              access={access}
              accessCounts={accessCounts}
              sort={sort}
              view={view}
              onToggleLevel={onToggleLevel}
              onToggleAccess={onToggleAccess}
              onClearLevels={onClearLevels}
              onSortChange={onSortChange}
              onViewChange={onViewChange}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-surface via-surface/80 to-transparent lg:hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
