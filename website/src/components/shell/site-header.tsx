import Link from "next/link";
import { Plus } from "lucide-react";

import { GitHubMark } from "@/components/icons/github-mark";
import { Button } from "@/components/ui/button";
import { repoUrl, submitResourceUrl } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 rounded-lg py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-brand-ring"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-ink font-mono text-[10px] font-medium text-white">
            py
          </span>
          <span className="hidden items-baseline gap-2 sm:flex">
            <span className="font-mono text-[11px] font-normal text-ink-4">
              learn-python
            </span>
            <span className="text-ink-4">/</span>
            <span className="text-[13px] font-semibold tracking-tight text-ink">
              curated-resources
            </span>
          </span>
          <span className="min-w-0 leading-none sm:hidden">
            <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-ink-4">
              learn-python
            </span>
            <span className="mt-1 block truncate text-[13px] font-semibold tracking-tight text-ink">
              curated-resources
            </span>
          </span>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon-lg"
            className="[&_svg]:size-[18px]"
          >
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the learn-python repository on GitHub"
            >
              <GitHubMark />
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="hidden sm:inline-flex [&_svg]:size-[15px]"
          >
            <a
              href={submitResourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Plus />
              Submit resource
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="icon-lg"
            className="sm:hidden [&_svg]:size-[18px]"
          >
            <a
              href={submitResourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Submit a resource"
            >
              <Plus />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
