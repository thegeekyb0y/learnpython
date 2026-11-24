"use client";

import { CategoryPills } from "@/components/shell/category-pills";
import { FilterControls } from "@/components/shell/filter-controls";
import type { Category, CategoryId } from "@/data/categories";
import type {
  DirectoryAccessFilter,
  SortKey,
  ViewMode,
} from "@/lib/directory";
import type { Difficulty } from "@/lib/schema";

type FilterBarProps = {
  categories: readonly Category[];
  categoryCounts: Record<CategoryId | "all", number>;
  activeCategory: CategoryId | "all";
  levels: Difficulty[];
  levelCounts: Record<Difficulty, number>;
  access: DirectoryAccessFilter[];
  accessCounts: Record<DirectoryAccessFilter, number>;
  sort: SortKey;
  view: ViewMode;
  onSelectCategory: (category: CategoryId | "all") => void;
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
  levels,
  levelCounts,
  access,
  accessCounts,
  sort,
  view,
  onSelectCategory,
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
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 py-2 sm:px-6 lg:flex-row lg:items-center lg:gap-4 lg:px-8">
        <div className="relative min-w-0 flex-1">
          <CategoryPills
            categories={categories}
            counts={categoryCounts}
            activeCategory={activeCategory}
            onSelect={onSelectCategory}
          />
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
    </section>
  );
}
