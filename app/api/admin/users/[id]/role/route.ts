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

  // ✅ เช็คคนเรียกเป็น admin จาก DB (ปลอดภัยสุด)
  const me = await User.findById(session.user.id).select("role").lean();
  if (!me || me.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const role = body?.role;
  if (role !== "user" && role !== "admin") {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  const { id } = context.params;

  const updated = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true }
  )
    .select("_id name email role createdAt")
    .lean();

  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "ok", user: updated }, { status: 200 });
}
