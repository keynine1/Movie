import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import Favorite from "@/models/Favorite";
import FavoritesClient from "@/components/FavoritesClient";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
          <h1 className="text-2xl font-semibold text-white">Favorites</h1>
          <p className="mt-2 text-white/70">
            Please login to view your favorite movies.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-white/90"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  await connectMongoDB();

  const favorites = await Favorite.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  const mapped = favorites.map((f: any) => ({
    _id: String(f._id),
    movieId: f.movieId,
    title: f.title,
    posterPath: f.posterPath,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">
            My Favorites
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Your saved movies ({mapped.length})
          </p>
        </div>

        <Link
          href="/movies"
          className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15 sm:inline-flex"
        >
          Browse Movies
        </Link>
      </div>

      {/* Empty state */}
      {mapped.length === 0 ? (
        <div className="rounded-2xl bg-white/5 p-10 text-center ring-1 ring-white/10">
          <div className="mx-auto max-w-md">
            <h2 className="text-lg font-semibold text-white">
              No favorites yet
            </h2>
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
        </div>
      ) : (
        <>
          {/* Small hint */}
          <div className="mb-3 text-xs text-white/40">
            Tip: hover a card to reveal actions.
          </div>

          {/* Client list (keeps your logic intact) */}
          <FavoritesClient initial={mapped} />
        </>
      )}
    </div>
  );
}
