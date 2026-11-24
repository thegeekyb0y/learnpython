"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowUpRight, Search, X } from "lucide-react";

import { HeroVisual } from "@/components/shell/hero-visual";
import { QuickNav } from "@/components/shell/quick-nav";
import { Badge } from "@/components/ui/badge";
import { InteractiveGrid } from "@/components/ui/interactive-grid";
import { Kbd } from "@/components/ui/kbd";
import { categoryById } from "@/data/categories";
import type { CollectionId } from "@/data/collections";
import { formatLabels } from "@/lib/directory";
import type { Resource } from "@/lib/schema";
import { cn } from "@/lib/utils";

type EditorialHeaderProps = {
  query: string;
  onQueryChange: (query: string) => void;
  statusLabel: string;
  hasActiveFilters: boolean;
  onClearStatus: () => void;
  activeCollection: CollectionId | null;
  onToggleCollection: (collection: CollectionId) => void;
  suggestions: readonly Resource[];
  totalMatches: number;
  onOpenResource: (id: string) => void;
  onViewAll: () => void;
};

export function EditorialHeader({
  query,
  onQueryChange,
  statusLabel,
  hasActiveFilters,
  onClearStatus,
  activeCollection,
  onToggleCollection,
  suggestions,
  totalMatches,
  onOpenResource,
  onViewAll,
}: EditorialHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRootRef = useRef<HTMLFormElement>(null);
  const onClearStatusRef = useRef(onClearStatus);
  const onQueryChangeRef = useRef(onQueryChange);
  const queryRef = useRef(query);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const topSuggestions = suggestions.slice(0, 6);
  const safeActiveIndex =
    topSuggestions.length === 0
      ? 0
      : Math.min(activeIndex, topSuggestions.length - 1);

  useEffect(() => {
    onClearStatusRef.current = onClearStatus;
    onQueryChangeRef.current = onQueryChange;
    queryRef.current = query;
  }, [onClearStatus, onQueryChange, query]);

  useEffect(() => {
    if (!searchOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!searchRootRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      setSearchOpen(false);

      if (queryRef.current.trim()) {
        onQueryChangeRef.current("");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;
      const dialogOpen = document.querySelector(
        '[role="dialog"][data-state="open"]',
      );

      if (
        !dialogOpen &&
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setActiveIndex(0);
        setSearchOpen(true);
        return;
      }

      if (!dialogOpen && event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
        setActiveIndex(0);
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectResource = (id: string) => {
    setSearchOpen(false);
    onOpenResource(id);
  };

  const viewAll = () => {
    setSearchOpen(false);
    onViewAll();
  };

  const handleInputKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!searchOpen) {
        setSearchOpen(true);
        setActiveIndex(0);
        return;
      }

      if (topSuggestions.length > 0) {
        setActiveIndex(
          (safeActiveIndex + 1) % topSuggestions.length,
        );
      }

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!searchOpen) {
        setSearchOpen(true);
        setActiveIndex(0);
        return;
      }

      if (topSuggestions.length > 0) {
        setActiveIndex(
          (safeActiveIndex - 1 + topSuggestions.length) %
            topSuggestions.length,
        );
      }

      return;
    }

    if (event.key === "Enter") {
      if (!searchOpen) {
        return;
      }

      event.preventDefault();
      const selected = topSuggestions[safeActiveIndex];

      if (selected) {
        selectResource(selected.id);
      }

      return;
    }

    if (event.key === "Escape" && !searchOpen) {
      onClearStatus();
    }
  };

  const activeOption = topSuggestions[safeActiveIndex];

  return (
    <section className="relative isolate mx-auto w-full max-w-[1440px] px-4 pt-14 pb-10 sm:px-6 sm:pt-20 sm:pb-14 lg:px-8">
      <InteractiveGrid
        cellSize={48}
        className="opacity-50"
        style={{
          maskImage:
            "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
        }}
      />
      <div className="relative z-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-center lg:gap-16">
        <div className="min-w-0">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand">
            Resource Directory
          </p>

          <h1 className="mt-5 max-w-[16ch] text-[clamp(2.1rem,4.4vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-ink">
            <span className="text-brand">Python</span> resources for everyone.
          </h1>

          <p className="mt-5 max-w-[62ch] type-body text-ink-3 sm:text-[15px] sm:leading-7">
            A curated collection of official docs, books, tutorials, tools, and
            more.
          </p>

          <form
            ref={searchRootRef}
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              viewAll();
            }}
            className="relative mt-8 w-full max-w-[680px] sm:mt-10"
          >
            <label htmlFor="resource-search" className="sr-only">
              Search resources
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-ink-4"
            />
            <input
              ref={inputRef}
              id="resource-search"
              type="text"
              inputMode="search"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(event) => {
                onQueryChange(event.target.value);
                setActiveIndex(0);
                setSearchOpen(true);
              }}
              onFocus={() => {
                setActiveIndex(0);
                setSearchOpen(true);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder='Search resources (e.g., "Django", "OOP", "Books")'
              role="combobox"
              aria-autocomplete="list"
              aria-haspopup="listbox"
              aria-expanded={searchOpen}
              aria-controls="resource-search-listbox"
              aria-activedescendant={
                searchOpen && activeOption
                  ? `resource-search-option-${activeOption.id}`
                  : undefined
              }
              aria-keyshortcuts="Meta+K Control+K /"
              className={cn(
                "h-12 w-full rounded-xl border border-hairline-strong bg-surface pl-11 text-[14px] text-ink outline-none transition-[border-color,box-shadow] duration-150 ease-out-quint placeholder:text-ink-4 focus-visible:border-brand/40 focus-visible:ring-[3px] focus-visible:ring-brand-ring sm:h-[52px] sm:text-[15px]",
                query ? "pr-28" : "pr-16",
              )}
            />
            <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    onClearStatus();
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="flex size-11 items-center justify-center rounded-md text-ink-4 outline-none transition-colors hover:bg-surface-2 hover:text-ink focus-visible:ring-[3px] focus-visible:ring-brand-ring sm:size-8"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              ) : null}
              <Kbd
                className="gap-1 border-sage-line bg-sage-soft text-ink-3"
                aria-hidden="true"
              >
                <span>⌘</span>
                <span>K</span>
              </Kbd>
            </div>

            <AnimatePresence>
              {searchOpen ? (
                <motion.div
                  id="resource-search-panel"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-full right-0 left-0 z-40 mt-2 overflow-hidden rounded-xl border border-hairline bg-surface shadow-pop"
                >
                  <div
                    id="resource-search-listbox"
                    role="listbox"
                    aria-label="Search results"
                    className="max-h-[min(430px,60dvh)] overflow-y-auto"
                  >
                    {topSuggestions.length > 0 ? (
                      topSuggestions.map((resource, index) => (
                        <button
                          key={resource.id}
                          type="button"
                          id={`resource-search-option-${resource.id}`}
                          role="option"
                          aria-selected={index === safeActiveIndex}
                          onMouseDown={(event) => event.preventDefault()}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => selectResource(resource.id)}
                          className={cn(
                            "relative flex min-h-14 w-full items-center gap-3 border-b border-hairline px-3 py-2 text-left outline-none transition-colors duration-100 last:border-b-0",
                            index === safeActiveIndex
                              ? "bg-brand-soft"
                              : "bg-surface hover:bg-surface-2",
                          )}
                        >
                          {index === safeActiveIndex ? (
                            <span
                              aria-hidden="true"
                              className="absolute inset-y-0 left-0 w-0.5 bg-brand"
                            />
                          ) : null}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-ink">
                              {resource.title}
                            </span>
                            <span className="mt-1 flex items-center gap-2">
                              <Badge variant="tag">
                                {categoryById[resource.category].label}
                              </Badge>
                              <span className="type-meta text-ink-4">
                                {formatLabels[resource.format]}
                              </span>
                            </span>
                          </span>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-4 shrink-0 text-ink-4"
                          />
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-6 text-center type-body-sm text-ink-3">
                        No resources match that search.
                      </p>
                    )}
                  </div>

                  {totalMatches > 0 ? (
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={viewAll}
                      className="flex min-h-11 w-full items-center justify-between gap-3 border-t border-hairline bg-surface-2/60 px-3 py-2 text-left type-meta text-ink-3 outline-none transition-colors hover:bg-surface-2 hover:text-ink focus-visible:ring-[3px] focus-visible:ring-brand-ring"
                    >
                      <span>
                        View all {totalMatches} matching{" "}
                        {totalMatches === 1 ? "resource" : "resources"} in
                        directory
                      </span>
                      <ArrowDown className="size-3.5 shrink-0" aria-hidden="true" />
                    </button>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </form>

          <div className="mt-2 flex h-11 items-center justify-between gap-3">
            <p
              aria-live="polite"
              className="min-w-0 truncate type-meta text-ink-3"
            >
              {statusLabel}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={onClearStatus}
                className="inline-flex min-h-11 shrink-0 items-center rounded-md px-1 text-[12px] font-medium text-brand outline-none underline-offset-4 hover:underline focus-visible:ring-[3px] focus-visible:ring-brand-ring sm:min-h-0"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <div className="hidden lg:flex lg:justify-end">
          <HeroVisual />
        </div>
      </div>

      <div className="relative mt-10">
        <QuickNav
          activeCollection={activeCollection}
          onToggle={onToggleCollection}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-canvas via-canvas/80 to-transparent sm:hidden"
        />
      </div>
      </div>
    </section>
  );
}
