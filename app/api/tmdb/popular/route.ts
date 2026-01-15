import { NextResponse } from "next/server";
import { getPopularMoviesPaged } from "@/lib/tmdb";

type TMDBMovie = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  release_date?: string;
};

type TMDBPagedResponse = {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  try {
    const data = (await getPopularMoviesPaged(page)) as TMDBPagedResponse;

    return NextResponse.json({
      page: data.page,
      results: data.results,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to fetch TMDb";
    return NextResponse.json({ message }, { status: 500 });
  }
}
