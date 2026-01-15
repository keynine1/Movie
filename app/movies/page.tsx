import InfiniteMovies from "@/components/InfiniteMovies";
import { getPopularMoviesPaged } from "@/lib/tmdb";

export default async function MoviesPage() {
  const data = await getPopularMoviesPaged(1);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Movies</h1>
        <p className="text-sm text-white/60">
          เลื่อนลงเพื่อโหลดหนังต่อๆ ไป
        </p>
      </div>

      <InfiniteMovies
        initialMovies={data.results}
        initialPage={data.page ?? 1}
        totalPages={Math.min(data.total_pages ?? 500, 500)}
      />
    </div>
  );
}
