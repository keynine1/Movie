import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import Favorite from "@/models/Favorite";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  // ไม่ได้ล็อกอิน → ถือว่าไม่ favorite
  if (!session) {
    return NextResponse.json({ favorited: false }, { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const movieId = Number(searchParams.get("movieId"));

  // ไม่มี movieId → ถือว่าไม่ favorite
  if (!movieId) {
    return NextResponse.json({ favorited: false }, { status: 200 });
  }

  await connectMongoDB();

  const found = await Favorite.findOne({
    userId: session.user.id,
    movieId,
  }).lean();

  return NextResponse.json({ favorited: !!found }, { status: 200 });
}
