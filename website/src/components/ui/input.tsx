import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-hairline-strong bg-surface px-3 text-[13px] text-ink outline-none transition-[border-color,box-shadow] duration-150 ease-out-quint selection:bg-brand selection:text-white placeholder:text-ink-4 focus-visible:border-brand/50 focus-visible:ring-[3px] focus-visible:ring-brand-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger md:h-9",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
