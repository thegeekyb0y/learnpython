import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main"
      className="grid min-h-dvh place-items-center bg-canvas px-4 py-16"
    >
      <div className="w-full max-w-md">
        <p className="type-micro text-ink-4">404 / Not found</p>
        <h1 className="type-page-title mt-3 text-ink">This page is not in the index.</h1>
        <p className="mt-2 type-body-sm text-ink-3">
          The resource may have moved, or the URL may be incomplete. Return to
          the directory to keep browsing.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/">Back to the directory</Link>
        </Button>
      </div>
    </main>
  );
}
