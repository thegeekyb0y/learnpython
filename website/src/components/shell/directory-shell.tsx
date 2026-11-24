"use client";

import { MotionConfig } from "motion/react";
import { RotateCcw } from "lucide-react";

import { ResourceDrawer } from "@/components/overlay/resource-drawer";
import { EditorialHeader } from "@/components/shell/editorial-header";
import { FilterBar } from "@/components/shell/filter-bar";
import { ResourceLedger } from "@/components/shell/resource-ledger";
import { Button } from "@/components/ui/button";
import type { Category } from "@/data/categories";
import { useDirectoryState } from "@/hooks/use-directory-state";
import type { Resource } from "@/lib/schema";
import { repoUrl, submitResourceUrl } from "@/lib/site";

type DirectoryShellProps = {
  resources: readonly Resource[];
  categories: readonly Category[];
};

export function DirectoryShell({
  resources,
  categories,
}: DirectoryShellProps) {
  const directory = useDirectoryState(resources);

  return (
    <MotionConfig reducedMotion="user">
      <EditorialHeader
        query={directory.state.query}
        onQueryChange={directory.setQuery}
      />

      <FilterBar
        categories={categories}
        categoryCounts={directory.categoryCounts}
        activeCategory={directory.state.category}
        levels={directory.state.levels}
        levelCounts={directory.levelCounts}
        access={directory.state.access}
        accessCounts={directory.accessCounts}
        sort={directory.state.sort}
        view={directory.state.view}
        onSelectCategory={directory.setCategory}
        onToggleLevel={directory.toggleLevel}
        onToggleAccess={directory.toggleAccess}
        onClearLevels={directory.clearLevels}
        onSortChange={directory.setSort}
        onViewChange={directory.setView}
      />

      <main
        id="main"
        className="mx-auto w-full max-w-[1440px] px-4 pt-8 pb-20 sm:px-6 sm:pt-10 lg:px-8"
      >
        <div className="mb-4 flex min-h-11 items-center justify-between gap-4">
          <p
            aria-live="polite"
            className="type-meta text-ink-4"
          >
            {directory.filteredResources.length === directory.totalResources
              ? `${directory.totalResources} resources`
              : `${directory.filteredResources.length} of ${directory.totalResources} resources`}
          </p>
          {directory.hasFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-11 shrink-0 gap-1.5 px-2.5 sm:h-8"
              onClick={directory.resetFilters}
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Reset filters
            </Button>
          ) : null}
        </div>

        <ResourceLedger
          resources={directory.filteredResources}
          view={directory.state.view}
          onOpen={directory.openResource}
          onReset={directory.resetFilters}
        />
      </main>

      <footer className="border-t border-hairline py-10">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="type-meta text-ink-4">
            {directory.totalResources} resources · curated for the learn-python
            repository
          </p>
          <div className="flex items-center gap-5">
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center type-meta text-ink-3 transition-colors hover:text-ink sm:min-h-0"
            >
              Repository
            </a>
            <a
              href={submitResourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center type-meta text-ink-3 transition-colors hover:text-ink sm:min-h-0"
            >
              Submit a resource
            </a>
          </div>
        </div>
      </footer>

      <ResourceDrawer
        resource={directory.selectedResource}
        open={Boolean(directory.selectedResource)}
        onOpenChange={(open) => {
          if (!open) {
            directory.closeResource();
          }
        }}
      />
    </MotionConfig>
  );
}
