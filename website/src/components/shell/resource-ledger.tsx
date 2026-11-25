"use client";

import { EmptyState } from "@/components/shell/empty-state";
import {
  ResourceGridCell,
  ResourceListRow,
} from "@/components/shell/resource-views";
import {
  sortResources,
  type SectionGroup,
  type SortKey,
  type ViewMode,
} from "@/lib/directory";
import type { Resource } from "@/lib/schema";

type ResourceLedgerProps = {
  resources: Resource[];
  view: ViewMode;
  onOpen: (id: string) => void;
  onReset: () => void;
  eyebrowByResourceId?: Readonly<Record<string, string>>;
};

export function ResourceLedger({
  resources,
  view,
  onOpen,
  onReset,
  eyebrowByResourceId,
}: ResourceLedgerProps) {
  if (resources.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-hairline bg-surface">
        <EmptyState onReset={onReset} />
      </div>
    );
  }

  const gridColumns =
    resources.length === 1
      ? "grid-cols-1"
      : resources.length === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3";

  return (
    <section
      data-view={view}
      aria-label="Resource results"
      className="overflow-hidden rounded-xl border border-hairline bg-hairline"
    >
      {view === "grid" ? (
        <div className={`grid bg-surface ${gridColumns}`}>
          {resources.map((resource, index) => (
            <ResourceGridCell
              key={resource.id}
              resource={resource}
              index={index}
              onOpen={onOpen}
              eyebrow={eyebrowByResourceId?.[resource.id]}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-px">
          {resources.map((resource, index) => (
            <ResourceListRow
              key={resource.id}
              resource={resource}
              index={index}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function GroupedResourceLedger({
  groups,
  view,
  sort,
  onOpen,
  onReset,
  eyebrowByResourceId,
}: {
  groups: readonly SectionGroup[];
  view: ViewMode;
  sort: SortKey;
  onOpen: (id: string) => void;
  onReset: () => void;
  eyebrowByResourceId?: Readonly<Record<string, string>>;
}) {
  const visibleGroups = groups.filter((group) => group.resources.length > 0);

  if (visibleGroups.length === 0) {
    return (
      <ResourceLedger
        resources={[]}
        view={view}
        onOpen={onOpen}
        onReset={onReset}
      />
    );
  }

  return (
    <div className="space-y-7">
      {visibleGroups.map((group) => (
        <section
          key={group.id}
          data-section-group={group.id}
          aria-labelledby={`section-${group.id}`}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2
                id={`section-${group.id}`}
                className="text-base font-semibold text-[#161D24]"
              >
                {group.title}
              </h2>
              <p className="mt-1 type-meta text-ink-4">{group.note}</p>
            </div>
            <span className="mt-0.5 inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface px-2 font-mono text-[11px] font-medium text-ink-3">
              {group.resources.length}
            </span>
          </div>

          <ResourceLedger
            resources={sortResources(group.resources, sort)}
            view={view}
            onOpen={onOpen}
            onReset={onReset}
            eyebrowByResourceId={eyebrowByResourceId}
          />
        </section>
      ))}
    </div>
  );
}
