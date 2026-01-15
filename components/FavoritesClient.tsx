"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

type FavoriteItem = {
  _id: string;
  movieId: number;
  title: string;
  posterPath?: string;
};

function tmdbPoster(path?: string, size: "w342" | "w500" | "w200" = "w342") {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export default function FavoritesClient({ initial }: { initial: FavoriteItem[] }) {
  const [items, setItems] = useState(initial);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const removeFavorite = async (movieId: number) => {
    const prev = items;
    setItems((cur) => cur.filter((x) => x.movieId !== movieId));
    setLoadingId(movieId);

    try {
      const res = await fetch(`/api/favorites/${movieId}`, { method: "DELETE" });
      if (!res.ok) {
        setItems(prev);
        alert("Remove failed");
      }
    } catch (e) {
      setItems(prev);
      alert("Network error");
    } finally {
      setLoadingId(null);
    }
  };

  const count = items.length;

  if (count === 0) {
    return (
      <div className="rounded-2xl bg-white/5 p-10 text-center ring-1 ring-white/10">
        <h3 className="text-lg font-semibold text-white">No favorites yet</h3>
        <p className="mt-2 text-sm text-white/60">
          Add movies to your list and they’ll show up here.
        </p>
        <Link
          href="/movies"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-black hover:bg-white/90"
        >
          Explore Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((m) => {
        const isRemoving = loadingId === m.movieId;
        const posterUrl = tmdbPoster(m.posterPath, "w342");

        return (
          <div
            key={m._id}
            className="group relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/8 hover:ring-white/20"
          >
            {/* Clickable poster */}
            <Link href={`/movie/${m.movieId}`} className="block">
              <div className="relative aspect-[2/3] w-full">
                {m.posterPath ? (
                  <Image
                    src={posterUrl}
                    alt={m.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 240px"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-white/50">
                    No poster
                  </div>
                )}

                {/* gradient overlay for readable text */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* title */}
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <h3 className="line-clamp-2 text-sm font-semibold text-white drop-shadow">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-white/70">movieId: {m.movieId}</p>
                </div>
              </div>
            </Link>

            {/* Remove button (hover reveal) */}
            <button
              onClick={() => removeFavorite(m.movieId)}
              disabled={isRemoving}
              aria-label="Remove from favorites"
              className={[
                "absolute right-3 top-3 inline-flex items-center justify-center rounded-full",
                "bg-black/55 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/15",
                "opacity-0 backdrop-blur transition group-hover:opacity-100",
                "hover:bg-black/70 disabled:opacity-60 disabled:cursor-not-allowed",
              ].join(" ")}
            >
              {isRemoving ? "Removing..." : "Remove"}
            </button>

            {/* subtle hover glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
              <div className="absolute inset-0 shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_18px_60px_-30px_rgba(0,0,0,0.9)]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
