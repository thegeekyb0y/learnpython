"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

type EditorialHeaderProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

export function EditorialHeader({
  query,
  onQueryChange,
}: EditorialHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onQueryChangeRef = useRef(onQueryChange);

  useEffect(() => {
    onQueryChangeRef.current = onQueryChange;
  }, [onQueryChange]);

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
        return;
      }

      if (!dialogOpen && event.key === "/" && !isTyping) {
        event.preventDefault();
        inputRef.current?.focus();
        return;
      }

      if (
        event.key === "Escape" &&
        document.activeElement === inputRef.current
      ) {
        event.preventDefault();
        onQueryChangeRef.current("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-28 lg:px-8">
      <p className="font-mono text-xs font-medium uppercase tracking-widest text-brand">
        Resource Directory
      </p>

      <h1 className="mt-5 max-w-[14ch] text-[clamp(2.35rem,5.5vw,4.75rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance text-ink">
        <span className="text-brand">Python</span> resources for everyone.
      </h1>

      <p className="mt-5 max-w-[62ch] type-body text-ink-3 sm:text-[15px] sm:leading-7">
        A curated collection of official docs, books, tutorials, tools, and
        more.
      </p>

      <div
        role="search"
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
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder='Search resources (e.g., "Django", "OOP", "Books")'
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
                onQueryChange("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="flex size-11 items-center justify-center rounded-md text-ink-4 outline-none transition-colors hover:bg-surface-2 hover:text-ink focus-visible:ring-[3px] focus-visible:ring-brand-ring sm:size-8"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
          <Kbd className="border-sage-line bg-sage-soft text-ink-3" aria-hidden="true">
            ⌘K
          </Kbd>
        </div>
      </div>
    </section>
  );
}
