import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  const prev = page - 1;
  const next = page + 1;

  const mkHref = (p: number) => `${basePath}?page=${p}`;

  return (
    <div className="flex items-center justify-center gap-2">
      <Link
        href={mkHref(Math.max(1, prev))}
        aria-disabled={page <= 1}
        className={[
          "rounded-full px-4 py-2 text-sm ring-1 transition",
          page <= 1
            ? "pointer-events-none bg-white/5 text-white/30 ring-white/10"
            : "bg-white/10 text-white ring-white/15 hover:bg-white/15",
        ].join(" ")}
      >
        Prev
      </Link>

      <div className="mx-2 text-sm text-white/70">
        Page <span className="text-white">{page}</span> /{" "}
        <span className="text-white">{totalPages}</span>
      </div>

      <Link
        href={mkHref(Math.min(totalPages, next))}
        aria-disabled={page >= totalPages}
        className={[
          "rounded-full px-4 py-2 text-sm ring-1 transition",
          page >= totalPages
            ? "pointer-events-none bg-white/5 text-white/30 ring-white/10"
            : "bg-white/10 text-white ring-white/15 hover:bg-white/15",
        ].join(" ")}
      >
        Next
      </Link>
    </div>
  );
}
