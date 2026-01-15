"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import MoviesListPage from "@/components/MoviesListPage";
import { MovieCardSkeleton } from "@/components/MovieCardSkeleton"; // ถ้ามี

type Movie = any;

export default function InfiniteMovies({
  initialMovies,
  initialPage,
  totalPages,
}: {
  initialMovies: Movie[];
  initialPage: number;
  totalPages: number;
}) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(initialPage);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPage < totalPages);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  // กันซ้ำด้วย id
  const movieIds = useMemo(() => new Set(movies.map((m) => m.id)), [movies]);

  async function loadMore() {
    if (!hasMore) return;
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    const nextPage = page + 1;

    try {
      const res = await fetch(`/api/tmdb/popular?page=${nextPage}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load more");

      const data = await res.json();

      startTransition(() => {
        setMovies((prev) => {
          const merged = [...prev];
          for (const m of data.results ?? []) {
            if (!movieIds.has(m.id)) merged.push(m);
          }
          return merged;
        });

        setPage(nextPage);
        setHasMore(nextPage < (data.total_pages ?? totalPages));
      });
    } catch (e) {
      // ถ้าจะทำ toast ก็ทำได้
      console.error(e);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }

  // IntersectionObserver: เห็น sentinel => โหลดต่อ
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "800px" } // เริ่มโหลดก่อนถึงท้ายเล็กน้อย
    );

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, hasMore]);

  return (
    <div className="space-y-6">
      <MoviesListPage movies={movies} />

      {/* Loader */}
      {hasMore && (
        <div className="space-y-3">
          {/* skeleton 1 แถว (optional) */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {loading || isPending
              ? Array.from({ length: 12 }).map((_, i) => (
                  <MovieCardSkeleton key={i} />
                ))
              : null}
          </div>

          <div className="flex justify-center">
            <button
              onClick={loadMore}
              disabled={loading || isPending}
              className="rounded-full bg-white/10 px-5 py-2 text-sm text-white ring-1 ring-white/15 hover:bg-white/15 disabled:opacity-50"
            >
              {loading || isPending ? "Loading..." : "Load more"}
            </button>
          </div>
        </div>
      )}

      {/* Sentinel */}
      <div ref={sentinelRef} className="h-10" />

      {!hasMore && (
        <div className="text-center text-sm text-white/60">
          คุณดูครบแล้ว ✅
        </div>
      )}
    </div>
  );
}
