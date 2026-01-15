import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { getMovieCredits, getMovieDetail, getMovieVideos } from "@/lib/tmdb";

type TMDbVideo = { key: string; site: string; type: string };
type TMDbVideosResponse = { results: TMDbVideo[] };

type TMDbCast = {
  cast_id?: number;
  credit_id: string;
  name: string;
  character?: string;
  profile_path?: string | null;
};
type TMDbCreditsResponse = { cast: TMDbCast[] };

type TMDbMovieDetail = {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  vote_average?: number;
  runtime?: number | null;
  tagline?: string;
  genres?: { id: number; name: string }[];
};

// ✅ สำคัญ: รองรับ params เป็น Promise ตามที่ Next แจ้ง
type ParamsLike = { id: string } | Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: ParamsLike;
}): Promise<Metadata> {
  const { id } = await Promise.resolve(params); // ✅ unwrap params
  const movieId = Number(id);

  if (!Number.isFinite(movieId)) {
    return { title: "Movie not found" };
  }

  try {
    const movie = (await getMovieDetail(movieId)) as TMDbMovieDetail;

    const title = movie?.title ? `${movie.title} | MoviesApp` : "MoviesApp";
    const description =
      movie?.overview?.trim() ||
      "ดูรายละเอียดหนัง นักแสดง ตัวอย่าง และจัดการรายการโปรดของคุณ";

    const posterUrl = movie?.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: posterUrl ? [posterUrl] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: posterUrl ? [posterUrl] : [],
      },
    };
  } catch {
    return {
      title: "MoviesApp",
      description: "ดูรายละเอียดหนัง นักแสดง ตัวอย่าง และจัดการรายการโปรดของคุณ",
    };
  }
}

function pickTrailerKey(videos?: TMDbVideosResponse) {
  const list = videos?.results ?? [];
  const trailer =
    list.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
    list.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
    list.find((v) => v.site === "YouTube");
  return trailer?.key;
}

function tmdbImg(path: string, size: "w342" | "w500" | "original" = "w500") {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

function formatRuntime(min?: number | null) {
  if (!min) return "-";
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export default async function MovieDetailPage({
  params,
}: {
  params: ParamsLike;
}) {
  const { id } = await Promise.resolve(params); // ✅ unwrap params
  const movieId = Number(id);

  if (!Number.isFinite(movieId)) {
    return (
      <div className="p-6 text-white">
        Invalid movie id: <span className="text-white/70">{String(id)}</span>
      </div>
    );
  }

  const [movie, credits, videos] = await Promise.all([
    getMovieDetail(movieId) as Promise<TMDbMovieDetail>,
    getMovieCredits(movieId) as Promise<TMDbCreditsResponse>,
    getMovieVideos(movieId) as Promise<TMDbVideosResponse>,
  ]);

  const trailerKey = pickTrailerKey(videos);
  const cast = (credits?.cast ?? []).slice(0, 14);

  const year = movie?.release_date ? new Date(movie.release_date).getFullYear() : null;
  const rating =
    typeof movie?.vote_average === "number" ? movie.vote_average.toFixed(1) : "-";

  const poster = movie?.poster_path ?? null;
  const backdrop = movie?.backdrop_path ?? null;

  return (
    <div className="relative">
      {/* HERO BACKDROP */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {backdrop ? (
          <Image
            src={tmdbImg(backdrop, "original")}
            alt={movie.title}
            fill
            priority
            className="object-cover opacity-35"
          />
        ) : (
          <div className="absolute inset-0 bg-white/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/85 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        <div className="mb-5 flex items-center gap-2 text-sm text-white/60">
          <Link href="/movies" className="hover:text-white">
            Movies
          </Link>
          <span className="text-white/30">/</span>
          <span className="truncate text-white/80">{movie.title}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr] xl:grid-cols-[340px_1fr]">
          {/* Poster */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.85)]">
              <div className="relative aspect-[2/3] w-full">
                {poster ? (
                  <Image
                    src={tmdbImg(poster, "w500")}
                    alt={movie.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 70vw, 340px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/60">
                    No poster
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <div className="p-4 space-y-2">
                <FavoriteButton
                  movieId={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path ?? ""}
                />

                {trailerKey ? (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailerKey}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
                  >
                    ▶ Watch Trailer
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full rounded-full bg-white/10 px-4 py-2 text-sm text-white/40 ring-1 ring-white/10"
                  >
                    No Trailer
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
<div className="min-w-0 space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-white sm:text-4xl">
                {movie.title}
              </h1>

              {movie?.tagline ? (
                <p className="mt-2 text-sm text-white/70 sm:text-base">
                  {movie.tagline}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {year && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white ring-1 ring-white/10">
                    {year}
                  </span>
                )}
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white ring-1 ring-white/10">
                  ★ {rating}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white ring-1 ring-white/10">
                  {formatRuntime(movie.runtime)}
                </span>

                {(movie.genres ?? []).slice(0, 4).map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
  {/* Overview */}
  <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
    <h2 className="text-sm font-semibold text-white">Overview</h2>
    <p className="mt-2 break-words text-sm leading-relaxed text-white/75 sm:text-[15px]">
      {movie.overview || "No overview."}
    </p>
  </div>

  {/* Stats */}
  <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
    <h2 className="text-sm font-semibold text-white">Details</h2>
    <div className="mt-3 space-y-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-white/50">Release</span>
        <span className="text-white">{movie.release_date || "-"}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white/50">Rating</span>
        <span className="text-white">{rating}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-white/50">Runtime</span>
        <span className="text-white">{formatRuntime(movie.runtime)}</span>
      </div>
    </div>
  </div>
</div>


            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">Top Cast</h2>
              </div>

              {cast.length === 0 ? (
                <p className="text-sm text-white/60">No cast data.</p>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {cast.map((c) => (
                    <div
                      key={c.cast_id ?? c.credit_id}
                      className="w-[120px] shrink-0 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10"
                    >
                      <div className="relative aspect-[3/4]">
                        {c.profile_path ? (
                          <Image
                            src={tmdbImg(c.profile_path, "w342")}
                            alt={c.name}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-white/50">
                            No image
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <div className="truncate text-xs font-semibold text-white">
                            {c.name}
                          </div>
                          <div className="truncate text-[11px] text-white/70">
                            {c.character || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <h2 className="mb-3 text-sm font-semibold text-white">Trailer</h2>
              {trailerKey ? (
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    title="Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p className="text-sm text-white/60">No trailer available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
