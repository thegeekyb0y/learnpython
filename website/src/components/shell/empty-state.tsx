"use client";

import { motion } from "motion/react";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.9 }}
      className="flex min-h-[320px] flex-col items-center justify-center bg-surface px-6 py-16 text-center"
    >
      <span className="flex size-11 items-center justify-center rounded-lg border border-hairline bg-surface-2 text-ink-4">
        <SearchX className="size-5" aria-hidden="true" />
      </span>
      <h2 className="type-card-title mt-5 text-ink">No resources found.</h2>
      <p className="mt-2 max-w-[42ch] type-body-sm text-ink-3">
        Nothing matches the current search and filters. Try a broader term or
        reset the filters to browse the full catalog.
      </p>
      <Button type="button" variant="outline" className="mt-6" onClick={onReset}>
        Reset filters
      </Button>
    </motion.div>
  );
}
