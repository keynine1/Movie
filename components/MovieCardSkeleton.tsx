export function MovieCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
      <div className="aspect-[2/3] w-full animate-pulse bg-white/10" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
