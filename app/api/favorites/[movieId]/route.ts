import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import Favorite from "@/models/Favorite";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ movieId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { movieId } = await params; // ✅ ต้อง await
  if (!movieId) {
    return NextResponse.json({ message: "movieId is required" }, { status: 400 });
  }

  await connectMongoDB();

  await Favorite.deleteOne({
    userId: session.user.id,
    movieId: Number(movieId), // ถ้าเก็บเป็น Number
  });

  return NextResponse.json({ ok: true });
}
