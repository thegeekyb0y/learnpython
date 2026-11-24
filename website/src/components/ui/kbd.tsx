import * as React from "react";

import { cn } from "@/lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-hairline-strong border-b-2 bg-surface px-2 font-mono text-[10px] font-medium leading-none tracking-[0.02em] text-ink-3",
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
