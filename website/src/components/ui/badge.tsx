import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-sm border px-3 py-1 font-mono text-[10px] font-medium uppercase leading-4 tracking-[0.06em] whitespace-nowrap",
  {
    variants: {
      variant: {
        tag: "border-hairline bg-surface text-ink-3",
        soft: "border-transparent bg-surface-2 text-ink-3",
        brand: "border-brand-line bg-brand-soft text-ink",
        sage: "border-sage-line bg-sage-soft text-ink",
        fern: "border-fern-line bg-fern-soft text-ink",
        chocolate: "border-chocolate-line bg-chocolate-soft text-ink",
        outline: "border-hairline-strong bg-transparent text-ink-3",
      },
    },
    defaultVariants: {
      variant: "tag",
    },
  },
);

type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

type BadgeDotTone = "brand" | "sage" | "fern" | "chocolate" | "muted";

const badgeDotTones: Record<BadgeDotTone, string> = {
  brand: "bg-brand",
  sage: "bg-sage",
  fern: "bg-fern",
  chocolate: "bg-chocolate",
  muted: "bg-ink-4",
};

function BadgeDot({
  tone = "fern",
  className,
}: {
  tone?: BadgeDotTone;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-1.5 shrink-0 rounded-full", badgeDotTones[tone], className)}
    />
  );
}

export { Badge, BadgeDot, badgeVariants };
export type { BadgeDotTone };
