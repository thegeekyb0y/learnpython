"use client";

import Image from "next/image";

import { DirectoryIcon } from "@/components/shell/icon-map";
import { quickNavItems } from "@/data/quick-nav";
import type { CollectionId } from "@/data/collections";
import { cn } from "@/lib/utils";

const accentStyles = {
  brand: "border-brand bg-brand text-white",
  chocolate: "border-chocolate bg-chocolate text-white",
  fern: "border-fern bg-fern text-ink",
  ink: "border-ink bg-ink text-sage",
  sage: "border-sage bg-sage text-ink",
} as const;

export function QuickNav({
  activeCollection,
  onToggle,
}: {
  activeCollection: CollectionId | null;
  onToggle: (collection: CollectionId) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Quick navigation"
      data-slot="quick-nav"
      className="no-scrollbar flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-7 sm:overflow-visible sm:pb-0"
    >
      {quickNavItems.map((item) => {
        const active = activeCollection === item.id;

        return (
          <button
            key={item.id}
            type="button"
            data-quick-nav={item.id}
            aria-pressed={active}
            aria-label={`Browse ${item.label}`}
            onClick={() => onToggle(item.id)}
            className="group flex w-[72px] shrink-0 flex-col items-center gap-2 rounded-lg py-1 outline-none focus-visible:ring-[3px] focus-visible:ring-brand-ring sm:w-auto"
          >
            <span
              className={cn(
                "flex size-12 items-center justify-center rounded-xl border transition-colors duration-150 ease-out-quint",
                active
                  ? "border-ink bg-ink text-white ring-2 ring-brand ring-offset-2 ring-offset-canvas"
                  : accentStyles[item.accent],
              )}
            >
              {item.iconSrc ? (
                <Image
                  src={item.iconSrc}
                  alt=""
                  width={20}
                  height={20}
                  className="size-5"
                  unoptimized
                />
              ) : (
                <DirectoryIcon name={item.icon} className="size-5" />
              )}
            </span>
            <span
              className={cn(
                "whitespace-nowrap text-[11px] leading-4 font-medium",
                active ? "text-ink" : "text-ink-3",
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
