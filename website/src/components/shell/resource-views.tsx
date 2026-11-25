"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Star } from "lucide-react";

import { AccessBadge } from "@/components/shell/access-badge";
import { categoryById } from "@/data/categories";
import {
  difficultyLabels,
  formatLabels,
} from "@/lib/directory";
import type { Resource } from "@/lib/schema";

const entranceTransition = {
  type: "spring",
  stiffness: 420,
  damping: 38,
  mass: 0.9,
} as const;

const railClass =
  "absolute inset-y-5 left-0 w-0.5 origin-top scale-y-0 rounded-full bg-brand transition-transform duration-150 ease-out-quint group-hover:scale-y-100 group-focus-visible:scale-y-100";

function FeaturedMark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <Star
        aria-hidden="true"
        className="size-3.5 fill-chocolate text-chocolate"
      />
      <span className="sr-only">Featured resource</span>
    </span>
  );
}

export function ResourceGridCell({
  resource,
  index,
  onOpen,
}: {
  resource: Resource;
  index: number;
  onOpen: (id: string) => void;
}) {
  return (
    <motion.button
      type="button"
      data-slot="resource-cell"
      data-resource-id={resource.id}
      onClick={() => onOpen(resource.id)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...entranceTransition,
        delay: Math.min(index, 8) * 0.022,
      }}
      className="group relative flex min-h-[188px] w-full cursor-pointer flex-col border-r border-b border-hairline bg-surface p-5 text-left transition-[background-color,border-color] duration-150 ease-out-quint hover:border-hairline-hover hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset focus-visible:outline-none"
    >
      <span className="sr-only">Open details for </span>
      <span aria-hidden="true" className={railClass} />

      <span className="flex items-start justify-between gap-3">
        <span className="type-micro truncate text-ink-3">
          {categoryById[resource.category].label} /{" "}
          {formatLabels[resource.format]}
        </span>
        {resource.featured ? <FeaturedMark className="shrink-0" /> : null}
      </span>

      <span className="mt-4 flex flex-1 flex-col gap-3">
        <span className="type-card-title text-ink">{resource.title}</span>
        <span className="line-clamp-2 type-body-sm text-ink-3">
          {resource.summary}
        </span>

        <span className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="min-w-0 truncate type-meta text-ink-3">
            {difficultyLabels[resource.difficulty]} ·{" "}
            {formatLabels[resource.format]}
          </span>
          <AccessBadge access={resource.access} className="shrink-0" />
        </span>
      </span>
    </motion.button>
  );
}

export function ResourceListRow({
  resource,
  index,
  onOpen,
}: {
  resource: Resource;
  index: number;
  onOpen: (id: string) => void;
}) {
  return (
    <motion.button
      type="button"
      data-slot="resource-row"
      data-resource-id={resource.id}
      onClick={() => onOpen(resource.id)}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...entranceTransition,
        delay: Math.min(index, 8) * 0.018,
      }}
      className="group relative flex min-h-16 w-full cursor-pointer items-center gap-3 bg-surface px-4 py-2 text-left transition-colors duration-150 ease-out-quint hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset focus-visible:outline-none md:px-5"
    >
      <span className="sr-only">Open details for </span>
      <span
        aria-hidden="true"
        className="absolute inset-y-3 left-0 w-0.5 origin-top scale-y-0 rounded-full bg-brand transition-transform duration-150 ease-out-quint group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[13px] leading-5 font-semibold tracking-[-0.01em] text-ink">
            {resource.title}
          </span>
          {resource.featured ? <FeaturedMark className="shrink-0" /> : null}
        </span>
        <span className="mt-1 block truncate text-[12px] leading-4 text-ink-3">
          {resource.summary}
        </span>
      </span>

      <span className="hidden shrink-0 type-meta text-ink-4 lg:block">
        {difficultyLabels[resource.difficulty]} ·{" "}
        {formatLabels[resource.format]}
      </span>
      <AccessBadge
        access={resource.access}
        className="hidden shrink-0 md:inline-flex"
      />
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 shrink-0 text-ink-4 transition-transform duration-150 ease-out-quint group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </motion.button>
  );
}
