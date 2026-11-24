import { Skeleton } from "@/components/ui/skeleton";

export function DirectorySkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading resources"
      className="mx-auto w-full max-w-[1440px] px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:px-8"
    >
      <span className="sr-only">Loading resources</span>
      <Skeleton className="h-3 w-36" />
      <Skeleton className="mt-5 h-14 w-full max-w-[620px]" />
      <Skeleton className="mt-4 h-5 w-full max-w-[520px]" />
      <Skeleton className="mt-8 h-12 w-full max-w-[680px] rounded-xl sm:h-[52px]" />

      <div className="mt-14 flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-28 shrink-0 rounded-full" />
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-hairline bg-hairline">
        <div className="grid grid-cols-1 gap-px lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-surface p-5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="mt-4 h-5 w-3/4" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-5/6" />
              <div className="mt-6 flex items-center justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-6 w-20 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
