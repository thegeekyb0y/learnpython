import {
  BadgeCheck,
  BookOpen,
  Bot,
  Play,
  Target,
  Users,
  Wrench,
} from "lucide-react";

import type { QuickNavIconKey } from "@/data/quick-nav";

export function DirectoryIcon({
  name,
  className,
}: {
  name: QuickNavIconKey;
  className?: string;
}) {
  switch (name) {
    case "badge-check":
      return <BadgeCheck className={className} aria-hidden="true" />;
    case "book-open":
      return <BookOpen className={className} aria-hidden="true" />;
    case "play":
      return <Play className={className} aria-hidden="true" />;
    case "bot":
      return <Bot className={className} aria-hidden="true" />;
    case "wrench":
      return <Wrench className={className} aria-hidden="true" />;
    case "users":
      return <Users className={className} aria-hidden="true" />;
    case "target":
      return <Target className={className} aria-hidden="true" />;
  }
}
