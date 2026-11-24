import { Badge, BadgeDot } from "@/components/ui/badge";
import { accessLabels } from "@/lib/directory";
import type { ResourceAccess } from "@/lib/schema";

const accessStyles = {
  free: { variant: "sage", tone: "fern" },
  "open-source": { variant: "fern", tone: "fern" },
  paid: { variant: "chocolate", tone: "chocolate" },
} as const satisfies Record<
  ResourceAccess,
  {
    variant: "sage" | "fern" | "chocolate";
    tone: "fern" | "chocolate";
  }
>;

export function AccessBadge({
  access,
  className,
}: {
  access: ResourceAccess;
  className?: string;
}) {
  const style = accessStyles[access];

  return (
    <Badge variant={style.variant} className={className}>
      <BadgeDot tone={style.tone} />
      {accessLabels[access]}
    </Badge>
  );
}
