import { DirectorySkeleton } from "@/components/shell/directory-skeleton";
import { SiteHeader } from "@/components/shell/site-header";

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <DirectorySkeleton />
      </main>
    </>
  );
}
