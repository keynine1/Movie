import Link from "next/link";

export default function MovieCard({ movie }: { movie: any }) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-poster.png";

  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
        <div className="aspect-[2/3] w-full overflow-hidden">
          <img
            src={poster}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>

        <div className="p-3">
          <p className="line-clamp-1 text-sm font-semibold text-white">
            {movie.title}
          </p>
          <p className="mt-1 text-xs text-white/60">
            {movie.release_date?.slice(0, 4) ?? "-"}
          </p>
        </div>
      </div>
    </Link>
  );
}
