"use client";

import { ArrowRight } from "lucide-react";

import { DirectoryIcon } from "@/components/shell/icon-map";
import {
  exploreCollections,
  type CollectionAccent,
  type CollectionCard,
  type CollectionFeature,
} from "@/data/collections";

const accentStyles: Record<
  CollectionAccent,
  { card: string; badge: string }
> = {
  chocolate: {
    card: "border-chocolate/[0.45] bg-gradient-to-br from-chocolate/[0.22] via-sage/[0.18] to-white hover:border-brand/[0.45]",
    badge: "bg-chocolate text-white",
  },
  sage: {
    card: "border-sage bg-gradient-to-br from-sage/[0.45] via-sage/[0.15] to-white hover:border-brand/[0.45]",
    badge: "bg-ink text-sage",
  },
  brand: {
    card: "border-brand/[0.40] bg-gradient-to-br from-brand/[0.20] via-brand/[0.06] to-white hover:border-brand/[0.45]",
    badge: "bg-brand text-white",
  },
  fern: {
    card: "border-fern/[0.40] bg-gradient-to-br from-fern/[0.20] via-sage/[0.16] to-white hover:border-brand/[0.45]",
    badge: "bg-fern text-white",
  },
  ink: {
    card: "border-ink bg-gradient-to-br from-ink to-[#263056] hover:border-brand",
    badge: "bg-white/10 text-white",
  },
};

type CollectionsBentoProps = {
  onSelect: (collectionId: CollectionCard["collectionId"]) => void;
  onViewAll: () => void;
};

function CollectionCardButton({
  card,
  onSelect,
}: {
  card: CollectionCard;
  onSelect: CollectionsBentoProps["onSelect"];
}) {
  const style = accentStyles[card.accent];

  return (
    <button
      type="button"
      data-bento={card.id}
      onClick={() => onSelect(card.collectionId)}
      className={`group flex min-h-[156px] flex-col rounded-xl border p-5 text-left outline-none transition-[border-color,opacity] duration-150 ease-out-quint focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset ${style.card}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex size-10 items-center justify-center rounded-lg border border-hairline ${style.badge}`}
        >
          <DirectoryIcon name={card.icon} className="size-[18px]" />
        </span>
        <span className="flex size-8 items-center justify-center rounded-full border border-hairline bg-surface/70 text-ink-3 transition-transform duration-150 ease-out-quint group-hover:translate-x-0.5">
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-6">
        <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
          {card.title}
        </h3>
        <p className="mt-1 max-w-[34ch] text-[13px] leading-5 text-ink-3">
          {card.subtitle}
        </p>
      </div>
    </button>
  );
}

function CollectionFeatureCard({
  card,
  onSelect,
}: {
  card: CollectionFeature;
  onSelect: CollectionsBentoProps["onSelect"];
}) {
  return (
    <button
      type="button"
      data-bento={card.id}
      onClick={() => onSelect(card.collectionId)}
      className={`group flex min-h-[336px] flex-col rounded-xl border p-5 text-left text-white outline-none transition-[border-color,opacity] duration-150 ease-out-quint focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas lg:h-full ${accentStyles.ink.card}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="type-micro text-white/60">{card.eyebrow}</span>
        <span className="flex size-8 items-center justify-center rounded-full border border-white/20 text-white/70">
          <DirectoryIcon name={card.icon} className="size-3.5" />
        </span>
      </div>

      <h3 className="mt-8 max-w-[16ch] text-[19px] leading-6 font-semibold tracking-[-0.02em]">
        {card.title}
      </h3>
      <p className="mt-2 max-w-[34ch] text-[13px] leading-5 text-white/60">
        {card.subtitle}
      </p>

      <div className="mt-auto pt-8">
        <div className="rounded-lg border border-white/15 bg-white/5 p-3 font-mono text-[11px] leading-5 text-white/80">
          <span className="text-sage">{card.terminal.prompt}</span>{" "}
          <span>{card.terminal.command}</span>(
          <span className="text-fern">{card.terminal.string}</span>
          <span>{card.terminal.suffix}</span>
        </div>
        <span className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-[13px] font-medium text-ink">
          {card.ctaLabel}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </button>
  );
}

export function CollectionsBento({
  onSelect,
  onViewAll,
}: CollectionsBentoProps) {
  const cards = exploreCollections.filter(
    (collection): collection is CollectionCard =>
      collection.variant === "card",
  );
  const feature = exploreCollections.find(
    (collection): collection is CollectionFeature =>
      collection.variant === "feature",
  );

  return (
    <section
      aria-labelledby="collections-heading"
      data-slot="collections-bento"
      className="mx-auto w-full max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-8"
    >
      <div className="mb-4 flex items-end justify-between gap-4 border-b border-hairline pb-3">
        <h2
          id="collections-heading"
          className="text-[15px] font-semibold tracking-[-0.01em] text-ink"
        >
          Explore Collections
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-1 text-[13px] font-medium text-ink-3 outline-none transition-colors hover:text-ink focus-visible:ring-[3px] focus-visible:ring-brand-ring sm:min-h-0"
        >
          View All
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2">
          {cards.map((card) => (
            <CollectionCardButton
              key={card.id}
              card={card}
              onSelect={onSelect}
            />
          ))}
        </div>
        {feature ? (
          <CollectionFeatureCard card={feature} onSelect={onSelect} />
        ) : null}
      </div>
    </section>
  );
}
