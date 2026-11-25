"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { DirectoryIcon } from "@/components/shell/icon-map";
import { quickNavItems, type QuickNavItem } from "@/data/quick-nav";
import type { CollectionId } from "@/data/collections";
import { cn } from "@/lib/utils";

const iconTones = {
  brand: "border-brand-line bg-brand-soft text-brand",
  chocolate: "border-chocolate-line bg-chocolate-soft text-chocolate",
  fern: "border-fern-line bg-fern-soft text-ink",
  ink: "border-hairline bg-surface-2 text-ink",
} as const;

function QuickNavIcon({
  item,
  className,
}: {
  item: QuickNavItem;
  className?: string;
}) {
  if (item.iconSrc) {
    return (
      <Image
        src={item.iconSrc}
        alt=""
        width={20}
        height={20}
        className="size-5"
        unoptimized
      />
    );
  }

  return <DirectoryIcon name={item.icon} className={className} />;
}

function FeaturedQuickNavCard({
  item,
  active,
  onToggle,
}: {
  item: QuickNavItem;
  active: boolean;
  onToggle: (collection: CollectionId) => void;
}) {
  const title = item.title ?? item.label;

  return (
    <button
      type="button"
      data-quick-nav={item.id}
      aria-pressed={active}
      aria-label={`Browse ${title}`}
      onClick={() => onToggle(item.id)}
      className={cn(
        "group col-span-2 flex min-h-[96px] cursor-pointer items-center gap-4 rounded-xl border border-sage bg-gradient-to-r from-sage/[0.45] via-sage/[0.25] to-sage/[0.15] p-4 text-left outline-none transition-[border-color,box-shadow] duration-150 ease-out-quint hover:border-brand focus-visible:ring-[3px] focus-visible:ring-brand-ring",
        active && "ring-2 ring-ink ring-offset-2 ring-offset-canvas",
      )}
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-sage">
        <QuickNavIcon item={item} className="size-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-ink">
          {title}
        </span>
        {item.subtitle ? (
          <span className="mt-0.5 block truncate text-[12px] leading-4 text-ink-3">
            {item.subtitle}
          </span>
        ) : null}
      </span>

      <ArrowRight
        aria-hidden="true"
        className="size-4 shrink-0 text-ink-3 transition-transform duration-150 ease-out-quint group-hover:translate-x-0.5"
      />
    </button>
  );
}

function StandardQuickNavCard({
  item,
  active,
  onToggle,
}: {
  item: QuickNavItem;
  active: boolean;
  onToggle: (collection: CollectionId) => void;
}) {
  return (
    <button
      type="button"
      data-quick-nav={item.id}
      aria-pressed={active}
      aria-label={`Browse ${item.label}`}
      onClick={() => onToggle(item.id)}
      className={cn(
        "group flex min-h-[96px] cursor-pointer flex-col justify-between rounded-xl border border-hairline bg-surface p-4 text-left outline-none transition-[border-color,box-shadow] duration-150 ease-out-quint hover:border-hairline-hover focus-visible:ring-[3px] focus-visible:ring-brand-ring",
        active && "border-brand ring-2 ring-brand/25",
      )}
    >
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-lg border",
          iconTones[item.accent],
        )}
      >
        <QuickNavIcon item={item} className="size-[18px]" />
      </span>
      <span className="mt-4 block truncate text-[13px] font-semibold text-ink">
        {item.label}
      </span>
    </button>
  );
}

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
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8"
    >
      {quickNavItems.map((item) => {
        const active = activeCollection === item.id;

        return item.featured ? (
          <FeaturedQuickNavCard
            key={item.id}
            item={item}
            active={active}
            onToggle={onToggle}
          />
        ) : (
          <StandardQuickNavCard
            key={item.id}
            item={item}
            active={active}
            onToggle={onToggle}
          />
        );
      })}
    </div>
  );
}
