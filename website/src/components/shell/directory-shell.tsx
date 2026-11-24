"use client";

import { MotionConfig, useReducedMotion } from "motion/react";

import { ResourceDrawer } from "@/components/overlay/resource-drawer";
import { CollectionsBento } from "@/components/shell/collections-bento";
import { EditorialHeader } from "@/components/shell/editorial-header";
import { FilterBar } from "@/components/shell/filter-bar";
import { ResourceLedger } from "@/components/shell/resource-ledger";
import { categoryById, type Category } from "@/data/categories";
import { useDirectoryState } from "@/hooks/use-directory-state";
import { getCollectionLabel } from "@/lib/directory";
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
  const reducedMotion = useReducedMotion();
  const query = directory.state.query.trim();
  const resultCount = directory.filteredResources.length;
  const resultWord = resultCount === 1 ? "result" : "results";
  const collectionLabel = directory.state.collection
    ? getCollectionLabel(directory.state.collection)
    : null;
  const categoryLabel =
    directory.state.category !== "all"
      ? categoryById[directory.state.category].label
      : null;
  const hasActiveFilters =
    directory.hasFilters || query.length > 0 || directory.state.collection !== null;

  let statusLabel = `${directory.totalResources} resources`;

  if (hasActiveFilters) {
    statusLabel = `Showing ${resultCount} ${resultWord}`;

    if (query) {
      statusLabel += ` for "${query}"`;
    }

    const scope = collectionLabel ?? categoryLabel;

    if (scope) {
      statusLabel += ` in ${scope}`;
    }

    if (
      !query &&
      !scope &&
      (directory.state.levels.length > 0 || directory.state.access.length > 0)
    ) {
      statusLabel += " with active filters";
    }
  }

  const clearStatus = () => {
    if (query) {
      directory.setQuery("");
      return;
    }

    directory.resetFilters();
  };

  const scrollToLedger = () => {
    const ledger = document.getElementById("ledger");

    if (!ledger) {
      return;
    }

    const stickyOffset = window.matchMedia("(min-width: 1024px)").matches
      ? 112
      : 168;
    const top = ledger.getBoundingClientRect().top + window.scrollY - stickyOffset;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <EditorialHeader
        query={directory.state.query}
        onQueryChange={directory.setQuery}
        statusLabel={statusLabel}
        hasActiveFilters={hasActiveFilters}
        onClearStatus={clearStatus}
        activeCollection={directory.state.collection}
        onToggleCollection={directory.setCollection}
        suggestions={directory.searchResults}
        totalMatches={directory.searchResults.length}
        onOpenResource={directory.openResource}
        onViewAll={scrollToLedger}
      />

      <CollectionsBento
        onSelect={directory.setCollection}
        onViewAll={scrollToLedger}
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
        <div id="ledger" className="scroll-mt-40 lg:scroll-mt-28">
          <ResourceLedger
            resources={directory.filteredResources}
            view={directory.state.view}
            onOpen={directory.openResource}
            onReset={directory.resetFilters}
          />
        </div>
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
