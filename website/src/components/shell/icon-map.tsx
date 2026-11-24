import {
  BadgeCheck,
  BookOpen,
  Bot,
  Database,
  Newspaper,
  Play,
  Target,
  Terminal,
  Users,
  Wrench,
} from "lucide-react";

import type { CollectionIconKey } from "@/data/collections";
import type { QuickNavIconKey } from "@/data/quick-nav";

type IconKey = QuickNavIconKey | CollectionIconKey;

export function DirectoryIcon({
  name,
  className,
}: {
  name: IconKey;
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
    case "newspaper":
      return <Newspaper className={className} aria-hidden="true" />;
    case "database":
      return <Database className={className} aria-hidden="true" />;
    case "terminal":
      return <Terminal className={className} aria-hidden="true" />;
  }
}
