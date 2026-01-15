import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

type Ctx = { params: { id: string } | Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: Ctx) {
  const { id } = await context.params; // ✅ รองรับทั้ง object และ Promise

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();

  // เช็คว่าเป็น admin จริง
  const me = await User.findById(session.user.id).lean();
  if (!me || me.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const role = body?.role;

  if (role !== "admin" && role !== "user") {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  const updated = await User.findByIdAndUpdate(id, { role }, { new: true })
    .select("-password")
    .lean();

  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "ok", user: updated });
}
