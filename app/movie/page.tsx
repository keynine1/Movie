import { getPopularMovies } from "@/lib/tmdb";
import MoviesListPage from "@/components/MoviesListPage";

export default async function HomePage() {
  const data = await getPopularMovies();

  return (
    <div className="text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">หนังยอดนิยม</h1>
        <p className="text-sm text-white/60">ดูรายละเอียดหนัง</p>
      </div>

      <MoviesListPage movies={data.results} />
    </div>
  );
}
