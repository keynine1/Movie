import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import Favorite from "@/models/Favorite";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();

  const favorites = await Favorite.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ favorites });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  // ✅ บังคับให้ movieId เป็น number เสมอ (กัน bug toggle ไม่ตรง)
  const movieId = Number(body.movieId);
  const title = body.title as string | undefined;
  const posterPath = body.posterPath as string | undefined;

  if (!movieId || !title) {
    return NextResponse.json(
      { message: "Missing fields: movieId/title" },
      { status: 400 }
    );
  }

  await connectMongoDB();

  const filter = { userId: session.user.id, movieId };

  const exists = await Favorite.findOne(filter).lean();

  // ✅ toggle: ถ้ามีอยู่แล้ว -> ลบ
  if (exists) {
    await Favorite.deleteOne(filter);
    return NextResponse.json({ favorited: false });
  }

  // ✅ toggle: ถ้าไม่มี -> เพิ่ม
  await Favorite.create({
    ...filter,
    title,
    posterPath,
  });

  return NextResponse.json({ favorited: true });
}
