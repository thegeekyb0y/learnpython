"use client";

import { useEffect, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Star,
  X,
} from "lucide-react";

import { AccessBadge } from "@/components/shell/access-badge";
import { Badge, BadgeDot } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryById } from "@/data/categories";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  difficultyLabels,
  formatLabels,
} from "@/lib/directory";
import type { Difficulty, Resource } from "@/lib/schema";

const difficultyStyles = {
  beginner: { variant: "fern", tone: "fern" },
  intermediate: { variant: "brand", tone: "brand" },
  advanced: { variant: "chocolate", tone: "chocolate" },
} as const satisfies Record<
  Difficulty,
  {
    variant: "fern" | "brand" | "chocolate";
    tone: "fern" | "brand" | "chocolate";
  }
>;

type ResourceDrawerProps = {
  resource: Resource | null;
  relatedResources: readonly Resource[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRelated: (id: string) => void;
};

function CloseButton({
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label="Close details"
      className="flex size-11 cursor-pointer items-center justify-center rounded-lg text-ink-4 outline-none transition-colors hover:bg-surface-2 hover:text-ink focus-visible:ring-[3px] focus-visible:ring-brand-ring"
      {...props}
    >
      {children}
    </button>
  );
}

function ResourceDetail({
  resource,
  relatedResources,
  title,
  summary,
  closeButton,
  onSelectRelated,
}: {
  resource: Resource;
  relatedResources: readonly Resource[];
  title: ReactNode;
  summary: ReactNode;
  closeButton: ReactNode;
  onSelectRelated: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1800);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copyLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("r", resource.id);
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="relative border-b border-hairline px-6 pt-6 pb-5">
        <div className="flex items-center gap-2 pr-12 type-micro text-ink-4">
          <span>{categoryById[resource.category].label}</span>
        </div>

        <div className="mt-3 pr-12">{title}</div>
        <div className="mt-2 pr-12">{summary}</div>

        <div className="mt-3 flex flex-wrap gap-2 pr-12">
          <Badge variant={difficultyStyles[resource.difficulty].variant}>
            <BadgeDot tone={difficultyStyles[resource.difficulty].tone} />
            {difficultyLabels[resource.difficulty]}
          </Badge>
          <Badge variant="tag">{formatLabels[resource.format]}</Badge>
          <AccessBadge access={resource.access} />
          {resource.featured ? (
            <Badge variant="chocolate">
              <Star
                aria-hidden="true"
                className="size-3 fill-chocolate"
              />
              Featured
            </Badge>
          ) : null}
        </div>

        <div className="absolute top-4 right-4">{closeButton}</div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <p className="text-[15px] leading-6 text-ink-3">
          {resource.description}
        </p>

        <div className="mt-6">
          <p className="type-micro text-ink-4">Tags</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="tag">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {relatedResources.length > 0 ? (
          <section className="mt-8 border-t border-hairline pt-5">
            <p className="type-micro text-ink-4">
              More in {categoryById[resource.category].label}
            </p>
            <div className="mt-3 space-y-2">
              {relatedResources.map((related) => (
                <button
                  key={related.id}
                  type="button"
                  onClick={() => onSelectRelated(related.id)}
                  className="group flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg border border-hairline bg-surface p-3 text-left outline-none transition-colors hover:border-hairline-hover hover:bg-surface-2 focus-visible:ring-[3px] focus-visible:ring-brand-ring"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-ink">
                      {related.title}
                    </span>
                    <span className="mt-1 block type-meta text-ink-4">
                      {difficultyLabels[related.difficulty]} ·{" "}
                      {formatLabels[related.format]}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-ink-4 transition-transform duration-150 ease-out-quint group-hover:translate-x-0.5"
                  />
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <footer className="border-t border-hairline bg-surface px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5 sm:pt-5 sm:pb-5">
        <div className="flex gap-2">
          <Button
            asChild
            className="h-11 flex-1 bg-brand text-white hover:bg-brand-strong [&_svg]:size-[15px]"
          >
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Resource
              <ArrowUpRight />
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={copyLink}
            className="h-11 cursor-pointer [&_svg]:size-[15px]"
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy Link"}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function DesktopDrawer({
  resource,
  relatedResources,
  open,
  onOpenChange,
  onSelectRelated,
}: {
  resource: Resource;
  relatedResources: readonly Resource[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRelated: (id: string) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="directory-overlay fixed inset-0 z-40 bg-ink/20 backdrop-blur-[2px]" />
        <Dialog.Content className="directory-sheet fixed top-0 right-0 z-50 flex h-dvh w-full max-w-[480px] flex-col border-l border-hairline bg-surface shadow-sheet outline-none">
          <ResourceDetail
            key={resource.id}
            resource={resource}
            relatedResources={relatedResources}
            title={
              <Dialog.Title className="text-[22px] leading-[1.15] font-semibold tracking-[-0.02em] text-ink">
                {resource.title}
              </Dialog.Title>
            }
            summary={
              <Dialog.Description className="type-body-sm text-ink-3">
                {resource.summary}
              </Dialog.Description>
            }
            closeButton={
              <Dialog.Close asChild>
                <CloseButton>
                  <X className="size-5" aria-hidden="true" />
                </CloseButton>
              </Dialog.Close>
            }
            onSelectRelated={onSelectRelated}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MobileDrawer({
  resource,
  relatedResources,
  open,
  onOpenChange,
  onSelectRelated,
}: {
  resource: Resource;
  relatedResources: readonly Resource[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRelated: (id: string) => void;
}) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      shouldScaleBackground={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-[2px]" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex h-[88dvh] flex-col rounded-t-2xl border-t border-hairline bg-surface outline-none">
          <div className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-hairline-strong" />
          <ResourceDetail
            key={resource.id}
            resource={resource}
            relatedResources={relatedResources}
            title={
              <Drawer.Title className="text-[22px] leading-[1.15] font-semibold tracking-[-0.02em] text-ink">
                {resource.title}
              </Drawer.Title>
            }
            summary={
              <Drawer.Description className="type-body-sm text-ink-3">
                {resource.summary}
              </Drawer.Description>
            }
            closeButton={
              <Drawer.Close asChild>
                <CloseButton>
                  <X className="size-5" aria-hidden="true" />
                </CloseButton>
              </Drawer.Close>
            }
            onSelectRelated={onSelectRelated}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function ResourceDrawer({
  resource,
  relatedResources,
  open,
  onOpenChange,
  onSelectRelated,
}: ResourceDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!resource || isDesktop === null) {
    return null;
  }

  return isDesktop ? (
    <DesktopDrawer
      resource={resource}
      relatedResources={relatedResources}
      open={open}
      onOpenChange={onOpenChange}
      onSelectRelated={onSelectRelated}
    />
  ) : (
    <MobileDrawer
      resource={resource}
      relatedResources={relatedResources}
      open={open}
      onOpenChange={onOpenChange}
      onSelectRelated={onSelectRelated}
    />
  );
}
