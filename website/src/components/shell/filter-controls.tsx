"use client";

import { motion } from "motion/react";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Grid2X2,
  Rows3,
  SlidersHorizontal,
} from "lucide-react";

import { BadgeDot } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  accessLabels,
  difficultyLabels,
  difficultyValues,
  sortKeys,
  sortLabels,
  type DirectoryAccessFilter,
  type SortKey,
  type ViewMode,
} from "@/lib/directory";
import type { Difficulty } from "@/lib/schema";
import { cn } from "@/lib/utils";

const controlClass =
  "inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium outline-none transition-[background-color,border-color,color] duration-150 ease-out-quint focus-visible:ring-[3px] focus-visible:ring-brand-ring sm:h-9";

const activeControlClass =
  "border-brand bg-brand text-white";
const inactiveControlClass =
  "border-hairline bg-surface text-ink-3 hover:border-hairline-hover hover:bg-surface-2 hover:text-ink";

const indicatorTransition = {
  type: "spring",
  stiffness: 500,
  damping: 42,
  mass: 0.8,
} as const;

type FilterControlsProps = {
  levels: Difficulty[];
  levelCounts: Record<Difficulty, number>;
  access: DirectoryAccessFilter[];
  accessCounts: Record<DirectoryAccessFilter, number>;
  sort: SortKey;
  view: ViewMode;
  onToggleLevel: (level: Difficulty) => void;
  onToggleAccess: (access: DirectoryAccessFilter) => void;
  onClearLevels: () => void;
  onSortChange: (sort: SortKey) => void;
  onViewChange: (view: ViewMode) => void;
};

export function FilterControls({
  levels,
  levelCounts,
  access,
  accessCounts,
  sort,
  view,
  onToggleLevel,
  onToggleAccess,
  onClearLevels,
  onSortChange,
  onViewChange,
}: FilterControlsProps) {
  return (
    <div className="no-scrollbar flex min-w-0 items-center gap-2 overflow-x-auto">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            data-filter="difficulty"
            className={cn(
              controlClass,
              levels.length > 0 ? activeControlClass : inactiveControlClass,
            )}
            aria-label={`Difficulty filter${levels.length > 0 ? `, ${levels.length} selected` : ""}`}
          >
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            <span>Difficulty</span>
            {levels.length > 0 ? (
              <span className="type-count text-white/75">{levels.length}</span>
            ) : null}
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          <p className="px-2 py-1 type-micro text-ink-4">Difficulty</p>
          <div className="mt-1">
            {difficultyValues.map((level) => {
              const selected = levels.includes(level);

              return (
                <button
                  key={level}
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => onToggleLevel(level)}
                  className="flex min-h-11 w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[13px] text-ink-2 outline-none transition-colors hover:bg-surface-2 focus-visible:ring-[3px] focus-visible:ring-brand-ring"
                >
                  <span
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                      selected
                        ? "border-brand bg-brand text-white"
                        : "border-hairline-strong bg-surface",
                    )}
                  >
                    {selected ? (
                      <Check className="size-3" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span className="flex-1">{difficultyLabels[level]}</span>
                  <span className="type-count text-ink-4">
                    {levelCounts[level]}
                  </span>
                </button>
              );
            })}
          </div>
          {levels.length > 0 ? (
            <button
              type="button"
              onClick={onClearLevels}
              className="mt-2 flex min-h-11 w-full items-center rounded-md border-t border-hairline px-2 pt-2 pb-1 text-left type-meta text-ink-4 outline-none hover:text-ink focus-visible:ring-[3px] focus-visible:ring-brand-ring"
            >
              Clear difficulty
            </button>
          ) : null}
        </PopoverContent>
      </Popover>

      {(["free", "open-source"] as const).map((value) => {
        const selected = access.includes(value);

        return (
          <button
            key={value}
            type="button"
            data-filter={value}
            aria-pressed={selected}
            onClick={() => onToggleAccess(value)}
            className={cn(
              controlClass,
              selected ? activeControlClass : inactiveControlClass,
            )}
          >
            <BadgeDot tone="fern" />
            <span>{accessLabels[value]}</span>
            <span
              className={cn(
                "type-count",
                selected ? "text-white/75" : "text-ink-4",
              )}
            >
              {accessCounts[value]}
            </span>
          </button>
        );
      })}

      <label className="relative inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border border-hairline bg-surface px-3 text-[13px] text-ink-3 outline-none transition-colors focus-within:ring-[3px] focus-within:ring-brand-ring hover:border-hairline-hover hover:bg-surface-2 sm:h-9">
        <ArrowUpDown className="size-3.5" aria-hidden="true" />
        <span className="whitespace-nowrap">
          Sort: <span className="font-medium text-ink">{sortLabels[sort]}</span>
        </span>
        <ChevronDown className="size-3.5" aria-hidden="true" />
        <select
          aria-label="Sort resources"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortKey)}
          className="absolute inset-0 size-full cursor-pointer appearance-none opacity-0"
        >
          {sortKeys.map((key) => (
            <option key={key} value={key}>
              {sortLabels[key]}
            </option>
          ))}
        </select>
      </label>

      <div
        role="group"
        aria-label="Resource view"
        className="flex h-11 shrink-0 items-center rounded-lg border border-hairline bg-surface-2 p-0.5 sm:h-9"
      >
        <button
          type="button"
          aria-label="Grid view"
          aria-pressed={view === "grid"}
          onClick={() => onViewChange("grid")}
          className="relative flex size-10 items-center justify-center rounded-md text-ink-3 outline-none focus-visible:ring-[3px] focus-visible:ring-brand-ring sm:size-8"
        >
          {view === "grid" ? (
            <motion.span
              layoutId="view-toggle-thumb"
              className="absolute inset-0 rounded-md border border-ink bg-ink"
              transition={indicatorTransition}
            />
          ) : null}
          <Grid2X2
            className={cn(
              "relative z-10 size-4",
              view === "grid" ? "text-white" : "text-ink-3",
            )}
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          aria-label="Compact list view"
          aria-pressed={view === "list"}
          onClick={() => onViewChange("list")}
          className="relative flex size-10 items-center justify-center rounded-md text-ink-3 outline-none focus-visible:ring-[3px] focus-visible:ring-brand-ring sm:size-8"
        >
          {view === "list" ? (
            <motion.span
              layoutId="view-toggle-thumb"
              className="absolute inset-0 rounded-md border border-ink bg-ink"
              transition={indicatorTransition}
            />
          ) : null}
          <Rows3
            className={cn(
              "relative z-10 size-4",
              view === "list" ? "text-white" : "text-ink-3",
            )}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
