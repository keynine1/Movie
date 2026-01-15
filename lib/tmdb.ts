const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) throw new Error("Missing TMDB_API_KEY");

// ภาษาเริ่มต้น
const DEFAULT_LANG = "th-TH";

export type FetchOptions = {
  language?: string;
  revalidate?: number;
  params?: Record<string, string | number | boolean | undefined>;
};

/** ========== TMDb Types (พอใช้งานจริงได้เลย) ========== */
export type TMDbMovie = {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  vote_count?: number;
  genre_ids?: number[];
};

export type TMDbPagedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type TMDbMovieDetail = TMDbMovie & {
  genres?: { id: number; name: string }[];
  runtime?: number;
  status?: string;
  tagline?: string;
};

export type TMDbCredits = {
  id: number;
  cast: Array<{
    id: number;
    name: string;
    character?: string;
    profile_path?: string | null;
    order?: number;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job?: string;
    department?: string;
    profile_path?: string | null;
  }>;
};

export type TMDbVideos = {
  id: number;
  results: Array<{
    id: string;
    key: string;
    name: string;
    site: "YouTube" | "Vimeo" | string;
    type: "Trailer" | "Teaser" | "Clip" | string;
    official?: boolean;
    published_at?: string;
  }>;
};

export type TMDbImages = {
  id: number;
  backdrops: Array<{ file_path: string; width: number; height: number }>;
  posters: Array<{ file_path: string; width: number; height: number }>;
};

/** ========== Helpers ========== */
function buildQuery(params: Record<string, unknown>) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    sp.set(key, String(value));
  }
  return sp.toString();
}

async function tmdbFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const safePath = path.startsWith("/") ? path : `/${path}`;

  const query = buildQuery({
    api_key: API_KEY,
    language: opts.language ?? DEFAULT_LANG,
    include_adult: false,
    ...opts.params,
  });

  const res = await fetch(`${BASE_URL}${safePath}?${query}`, {
    next: { revalidate: opts.revalidate ?? 60 * 60 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDb fetch failed: ${res.status} ${text}`);
  }

  return (await res.json()) as T;
}

/* =======================
   Exports (typed)
   ======================= */

// Trending (Home) รองรับ page
export function getPopularMovies(page: number = 1) {
  return tmdbFetch<TMDbPagedResponse<TMDbMovie>>("/trending/movie/day", {
    revalidate: 10 * 60,
    params: { page },
  });
}

// Popular (เหมาะทำหน้า /movies แบบ Netflix และ paging ชัดเจน)
export function getPopularMoviesPaged(page: number = 1) {
  return tmdbFetch<TMDbPagedResponse<TMDbMovie>>("/movie/popular", {
    revalidate: 10 * 60,
    params: { page, region: "TH" },
  });
}

export function getMovieDetail(id: string | number) {
  return tmdbFetch<TMDbMovieDetail>(`/movie/${id}`, {
    revalidate: 60 * 60,
  });
}

export function getMovieCredits(id: string | number) {
  return tmdbFetch<TMDbCredits>(`/movie/${id}/credits`, {
    revalidate: 24 * 60 * 60,
  });
}

export function getMovieVideos(id: string | number) {
  return tmdbFetch<TMDbVideos>(`/movie/${id}/videos`, {
    revalidate: 24 * 60 * 60,
  });
}

export function getMovieImages(id: string | number) {
  return tmdbFetch<TMDbImages>(`/movie/${id}/images`, {
    revalidate: 24 * 60 * 60,
  });
}
