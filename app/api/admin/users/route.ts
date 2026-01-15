import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

// GET: list users
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await connectMongoDB();
  const users = await User.find().select("-password").lean();

  return NextResponse.json({ users });
}

// PATCH: update user role
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const userId = body?.userId;
  const role = body?.role;

  if (!userId || (role !== "admin" && role !== "user")) {
    return NextResponse.json(
      { message: "Invalid payload. Expected { userId, role }" },
      { status: 400 }
    );
  }

  await connectMongoDB();

  const updated = await User.findByIdAndUpdate(
    userId,
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
