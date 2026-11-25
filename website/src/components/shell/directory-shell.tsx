"use client";

import { useMemo } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";

import { ResourceDrawer } from "@/components/shell/resource-drawer";
import { EditorialHeader } from "@/components/shell/editorial-header";
import { FilterBar } from "@/components/shell/filter-bar";
import {
  GroupedResourceLedger,
  ResourceLedger,
} from "@/components/shell/resource-ledger";
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
  const sectionView = directory.sectionView;
  const activeSectionTitle =
    sectionView?.groups.find((group) => group.id === directory.state.section)
      ?.title ?? null;
  const sectionPills = sectionView
    ? sectionView.groups
        .filter((group) => group.resources.length > 0)
        .map((group) => ({
          id: group.id,
          label: group.title,
          count: group.resources.length,
        }))
    : null;
  const eyebrowByResourceId = useMemo(() => {
    if (!sectionView) {
      return undefined;
    }

    const map: Record<string, string> = {};

    for (const group of sectionView.groups) {
      for (const resource of group.resources) {
        map[resource.id] = group.eyebrow;
      }
    }

    return map;
  }, [sectionView]);
  const isGrouped =
    Boolean(sectionView) &&
    directory.filters.sort === "recommended" &&
    query.length === 0;
  const groupedSections =
    sectionView?.groups.filter(
      (group) =>
        !directory.filters.section ||
        group.id === directory.filters.section,
    ) ?? [];
  const hasActiveFilters =
    directory.hasFilters || query.length > 0 || directory.state.collection !== null;

  let statusLabel = `${directory.totalResources} resources`;

  if (hasActiveFilters) {
    statusLabel = `Showing ${resultCount} ${resultWord}`;

    if (query) {
      statusLabel += ` for "${query}"`;
    }

    const scope = activeSectionTitle
      ? `${collectionLabel ?? categoryLabel ?? "Directory"} · ${activeSectionTitle}`
      : (collectionLabel ?? categoryLabel);

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

  const scrollToFeed = () => {
    const feed = document.getElementById("directory-feed");

    if (!feed) {
      return;
    }

    // The sticky filter bar grows once the active-collection chip appears,
    // so measure its height (plus its sticky offset) after the state renders.
    const filterBar = document.querySelector<HTMLElement>(
      '[data-slot="filter-bar"]',
    );

    if (filterBar) {
      const stickyTop = Number.parseFloat(getComputedStyle(filterBar).top) || 0;
      feed.style.scrollMarginTop = `${Math.round(
        filterBar.offsetHeight + stickyTop + 12,
      )}px`;
    }

    feed.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const handleQuickNavToggle = (
    collection: Parameters<typeof directory.setCollection>[0],
  ) => {
    directory.setCollection(collection);
    window.requestAnimationFrame(() => window.requestAnimationFrame(scrollToFeed));
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
        onToggleCollection={handleQuickNavToggle}
        suggestions={directory.searchResults}
        totalMatches={directory.searchResults.length}
        onOpenResource={directory.openResource}
        onViewAll={scrollToFeed}
      />

      <FilterBar
        categories={categories}
        categoryCounts={directory.categoryCounts}
        activeCategory={directory.state.category}
        activeCollection={directory.state.collection}
        activeSection={directory.state.section}
        sectionTotal={sectionView?.total ?? 0}
        sectionPills={sectionPills}
        levels={directory.state.levels}
        levelCounts={directory.levelCounts}
        access={directory.state.access}
        accessCounts={directory.accessCounts}
        sort={directory.state.sort}
        view={directory.state.view}
        onSelectCategory={directory.setCategory}
        onClearCollection={directory.clearCollection}
        onSelectSection={directory.setSection}
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
        <div id="directory-feed" className="scroll-mt-40 lg:scroll-mt-28">
          {isGrouped && sectionView ? (
            <GroupedResourceLedger
              groups={groupedSections}
              view={directory.state.view}
              sort={directory.filters.sort}
              onOpen={directory.openResource}
              onReset={directory.resetFilters}
              eyebrowByResourceId={eyebrowByResourceId}
            />
          ) : (
            <ResourceLedger
              resources={directory.filteredResources}
              view={directory.state.view}
              onOpen={directory.openResource}
              onReset={directory.resetFilters}
              eyebrowByResourceId={eyebrowByResourceId}
            />
          )}
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
        relatedResources={directory.relatedResources}
        open={Boolean(directory.selectedResource)}
        onOpenChange={(open) => {
          if (!open) {
            directory.closeResource();
          }
        }}
        onSelectRelated={directory.openRelatedResource}
      />
    </MotionConfig>
  );
}
