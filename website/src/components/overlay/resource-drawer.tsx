"use client";

import { useEffect, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import { ArrowUpRight, Check, Copy, Star, X } from "lucide-react";

import { AccessBadge } from "@/components/shell/access-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { categoryById } from "@/data/categories";
import {
  accessLabels,
  difficultyLabels,
  formatLabels,
} from "@/lib/directory";
import type { Resource } from "@/lib/schema";

type ResourceDrawerProps = {
  resource: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function CloseButton({
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label="Close details"
      className="flex size-11 items-center justify-center rounded-lg text-ink-4 outline-none transition-colors hover:bg-surface-2 hover:text-ink focus-visible:ring-[3px] focus-visible:ring-brand-ring"
      {...props}
    >
      {children}
    </button>
  );
}

function ResourceDetail({
  resource,
  title,
  summary,
  closeButton,
}: {
  resource: Resource;
  title: ReactNode;
  summary: ReactNode;
  closeButton: ReactNode;
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
      await navigator.clipboard.writeText(window.location.href);
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
          <span aria-hidden="true">/</span>
          <span>{formatLabels[resource.format]}</span>
          {resource.featured ? (
            <span className="ml-1 inline-flex items-center">
              <Star
                aria-hidden="true"
                className="size-3 fill-chocolate text-chocolate"
              />
              <span className="sr-only">Featured</span>
            </span>
          ) : null}
        </div>

        <div className="mt-3 pr-12">{title}</div>
        <div className="mt-2 pr-12">{summary}</div>

        <div className="absolute top-4 right-4">{closeButton}</div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline">
          <DetailCell label="Difficulty" value={difficultyLabels[resource.difficulty]} />
          <DetailCell label="Format" value={formatLabels[resource.format]} />
          <DetailCell
            label="Category"
            value={categoryById[resource.category].label}
          />
          <div className="bg-surface p-3">
            <dt className="type-micro text-ink-4">Access</dt>
            <dd className="mt-2">
              <AccessBadge access={resource.access} />
            </dd>
          </div>
        </dl>

        <p className="mt-6 text-[15px] leading-6 text-ink-3">
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
      </div>

      <footer className="border-t border-hairline bg-surface px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5 sm:pt-5 sm:pb-5">
        <div className="flex gap-2">
          <Button asChild className="h-11 flex-1 sm:h-9 [&_svg]:size-[15px]">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open resource
              <ArrowUpRight />
            </a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={copyLink}
            className="h-11 sm:h-9 [&_svg]:size-[15px]"
          >
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
        <p className="mt-2 text-center type-micro text-ink-4">
          {accessLabels[resource.access]} · {formatLabels[resource.format]}
        </p>
      </footer>
    </div>
  );
}

function DetailCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface p-3">
      <dt className="type-micro text-ink-4">{label}</dt>
      <dd className="mt-1 text-[13px] text-ink-2">{value}</dd>
    </div>
  );
}

function DesktopDrawer({
  resource,
  open,
  onOpenChange,
}: {
  resource: Resource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="directory-overlay fixed inset-0 z-40 bg-ink/20 backdrop-blur-[2px]" />
        <Dialog.Content className="directory-sheet fixed top-0 right-0 z-50 flex h-dvh w-full max-w-[480px] flex-col border-l border-hairline bg-surface shadow-sheet outline-none">
          <ResourceDetail
            resource={resource}
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
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MobileDrawer({
  resource,
  open,
  onOpenChange,
}: {
  resource: Resource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      shouldScaleBackground={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-ink/25 backdrop-blur-[2px]" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex h-[92dvh] flex-col rounded-t-2xl border-t border-hairline bg-surface outline-none">
          <div className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-hairline-strong" />
          <ResourceDetail
            resource={resource}
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
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function ResourceDrawer({
  resource,
  open,
  onOpenChange,
}: ResourceDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!resource || isDesktop === null) {
    return null;
  }

  return isDesktop ? (
    <DesktopDrawer resource={resource} open={open} onOpenChange={onOpenChange} />
  ) : (
    <MobileDrawer resource={resource} open={open} onOpenChange={onOpenChange} />
  );
}
