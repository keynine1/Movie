import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectMongoDB();

  // เช็คว่าคนเรียกเป็น admin จริง
  const me = await User.findById(session.user.id).lean();
  if (!me || me.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { role } = await req.json().catch(() => ({}));

  if (role !== "user" && role !== "admin") {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  const { id } = context.params;

  const updated = await User.findByIdAndUpdate(id, { role }, { new: true })
    .select("-password")
    .lean();

  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "ok", user: updated });
}
