const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

if (!API_KEY) throw new Error("Missing TMDB_API_KEY");

// ✅ ภาษาเริ่มต้น
const DEFAULT_LANG = "th-TH";

type FetchOptions = {
  language?: string;
  revalidate?: number;
  params?: Record<string, string | number | boolean | undefined>;
};

function buildQuery(params: Record<string, any>) {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    sp.set(key, String(value));
  }
  return sp.toString();
}

async function tmdbFetch<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const query = buildQuery({
    api_key: API_KEY,
    language: opts.language ?? DEFAULT_LANG,
    ...opts.params,
  });

  // กันพลาดถ้า path ไม่ขึ้นต้นด้วย "/"
  const safePath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${BASE_URL}${safePath}?${query}`, {
    next: { revalidate: opts.revalidate ?? 60 * 60 },
  });

  if (!res.ok) throw new Error(`TMDb fetch failed: ${res.status}`);
  return res.json();
}

/* =======================
   Exports
   ======================= */

// ✅ หน้า Home (Trending) + รองรับ page
// TMDb trending รองรับ page ได้ ✅
export function getPopularMovies(page: number = 1) {
  return tmdbFetch("/trending/movie/day", {
    revalidate: 10 * 60,
    params: { page },
  });
}

// ✅ (แนะนำ) ถ้าคุณทำหน้า /movies แบบ Netflix: ใช้ popular ที่แบ่งหน้าแน่นอน
export function getPopularMoviesPaged(page: number = 1) {
  return tmdbFetch("/movie/popular", {
    revalidate: 10 * 60,
    params: { page },
  });
}

// ✅ Movie Detail
export function getMovieDetail(id: string | number) {
  return tmdbFetch(`/movie/${id}`, {
    revalidate: 60 * 60,
  });
}

// ✅ credits
export function getMovieCredits(id: string | number) {
  return tmdbFetch(`/movie/${id}/credits`, {
    revalidate: 24 * 60 * 60,
  });
}

// ✅ videos (trailer)
export function getMovieVideos(id: string | number) {
  return tmdbFetch(`/movie/${id}/videos`, {
    revalidate: 24 * 60 * 60,
  });
}

// ✅ images
export function getMovieImages(id: string | number) {
  return tmdbFetch(`/movie/${id}/images`, {
    revalidate: 24 * 60 * 60,
  });
}
