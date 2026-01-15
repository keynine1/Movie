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
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { role } = await req.json();
  if (role !== "admin" && role !== "user") {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  await connectMongoDB();
  const updated = await User.findByIdAndUpdate(
    params.id,
    { role },
    { new: true }
  )
    .select("-password")
    .lean();

  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: updated });
}
