"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const indicatorTransition = {
  type: "spring",
  stiffness: 500,
  damping: 42,
  mass: 0.8,
} as const;

export type SectionPill = {
  id: string;
  label: string;
  count: number;
};

type SectionPillsProps = {
  total: number;
  pills: readonly SectionPill[];
  activeSection: string | null;
  onSelect: (section: string | null) => void;
};

type Pill = {
  id: string | null;
  label: string;
  count: number;
};

export function SectionPills({
  total,
  pills,
  activeSection,
  onSelect,
}: SectionPillsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const items: Pill[] = [
    { id: null, label: "All", count: total },
    ...pills,
  ];

  useEffect(() => {
    const scroller = scrollerRef.current;
    const active = scroller?.querySelector<HTMLElement>('[data-active="true"]');

    if (!scroller || !active) {
      return;
    }

    const scrollerRect = scroller.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const left =
      scroller.scrollLeft +
      activeRect.left -
      scrollerRect.left -
      (scrollerRect.width - activeRect.width) / 2;

    scroller.scrollTo({
      left: Math.max(0, left),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [activeSection, reducedMotion]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    const buttons = [
      ...(scrollerRef.current?.querySelectorAll<HTMLButtonElement>(
        "[data-section-pill]",
      ) ?? []),
    ];
    const currentIndex = buttons.findIndex(
      (button) => button === document.activeElement,
    );

    if (currentIndex === -1) {
      return;
    }

    event.preventDefault();

    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? buttons.length - 1
          : event.key === "ArrowRight"
            ? (currentIndex + 1) % buttons.length
            : (currentIndex - 1 + buttons.length) % buttons.length;

    buttons[nextIndex]?.focus();
  };

  return (
    <motion.div
      layoutScroll
      ref={scrollerRef}
      role="group"
      aria-label="Filter by sub-section"
      onKeyDown={handleKeyDown}
      className="no-scrollbar flex min-w-0 items-center gap-2 overflow-x-auto"
    >
      {items.map((pill) => {
        const active = pill.id === activeSection;

        return (
          <button
            key={pill.id ?? "all"}
            type="button"
            data-section-pill
            data-active={active}
            aria-pressed={active}
            onClick={() => onSelect(pill.id)}
            className={cn(
              "relative isolate flex h-11 shrink-0 items-center gap-2 overflow-hidden rounded-full border px-4 text-[13px] font-medium outline-none transition-colors duration-150 ease-out-quint focus-visible:ring-[3px] focus-visible:ring-brand-ring sm:h-9",
              active
                ? "border-ink text-white"
                : "border-hairline bg-surface text-ink-3 hover:border-hairline-hover hover:bg-surface-2 hover:text-ink",
            )}
          >
            {active ? (
              <motion.span
                layoutId="section-pill-indicator"
                className="absolute inset-0 -z-10 rounded-full bg-ink"
                transition={indicatorTransition}
              />
            ) : null}
            <span className="relative z-10 whitespace-nowrap">{pill.label}</span>
            <span
              className={cn(
                "type-count relative z-10",
                active ? "text-white/70" : "text-ink-4",
              )}
            >
              {pill.count}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}
