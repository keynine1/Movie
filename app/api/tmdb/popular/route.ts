import { NextResponse } from "next/server";
import { getPopularMoviesPaged } from "@/lib/tmdb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1"));

  try {
    const data = await getPopularMoviesPaged(page);
    // ส่งเฉพาะที่จำเป็น ลด payload
    return NextResponse.json({
      page: data.page,
      results: data.results,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  } catch (e: any) {
    return NextResponse.json(
      { message: e?.message ?? "Failed to fetch TMDb" },
      { status: 500 }
    );
  }
}
