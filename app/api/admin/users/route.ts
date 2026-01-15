import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { role } = await req.json();
  if (!["user", "admin"].includes(role)) {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  await connectMongoDB();

  const updated = await User.findByIdAndUpdate(
    params.id,
    { $set: { role } },
    { new: true, runValidators: true }
  ).select("_id email role");

  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, user: updated });
}
