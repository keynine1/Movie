import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const myId = session?.user?.id;

  if (!myId) return { ok: false as const, status: 401, message: "Unauthorized" };

  await connectMongoDB();
  const me = await User.findById(myId).select("role").lean();

  if (!me || me.role !== "admin") {
    return { ok: false as const, status: 403, message: "Forbidden" };
  }

  return { ok: true as const };
}

// GET: list users
export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const users = await User.find().select("_id name email role createdAt").lean();
  return NextResponse.json({ users }, { status: 200 });
}

// PATCH: update user role  (payload: { userId, role })
export async function PATCH(req: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const userId = body?.userId as string | undefined;
  const role = body?.role as "admin" | "user" | undefined;

  if (!userId || (role !== "admin" && role !== "user")) {
    return NextResponse.json(
      { message: "Invalid payload. Expected { userId, role }" },
      { status: 400 }
    );
  }

  const updated = await User.findByIdAndUpdate(userId, { role }, { new: true })
    .select("_id name email role createdAt")
    .lean();

  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: updated }, { status: 200 });
}
