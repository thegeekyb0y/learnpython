"use client";

import { EmptyState } from "@/components/shell/empty-state";
import {
  ResourceGridCell,
  ResourceListRow,
} from "@/components/shell/resource-views";
import type { Resource } from "@/lib/schema";
import type { ViewMode } from "@/lib/directory";

type ResourceLedgerProps = {
  resources: Resource[];
  view: ViewMode;
  onOpen: (id: string) => void;
  onReset: () => void;
};

export function ResourceLedger({
  resources,
  view,
  onOpen,
  onReset,
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
