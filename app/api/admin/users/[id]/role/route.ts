import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();

  // ✅ เช็คว่าคนเรียกเป็น admin
  const me = await User.findById(session.user.id).lean();
  if (!me || me.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { role } = await req.json();
  if (role !== "user" && role !== "admin") {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  const updated = await User.findByIdAndUpdate(
    params.id,
    { role },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "ok", user: updated });
}
