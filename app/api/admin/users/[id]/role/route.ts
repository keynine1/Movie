import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

type Role = "user" | "admin";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  // 1) Auth
  const session = await getServerSession(authOptions);
  const myId = session?.user?.id;

  if (!myId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 2) DB
  await connectMongoDB();

  // 3) Check admin
  const me = await User.findById(myId).select("role").lean();
  if (!me || me.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  // 4) Parse body safely
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const role = body?.role as Role | undefined;
  if (role !== "user" && role !== "admin") {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  // 5) Update
  const updated = await User.findByIdAndUpdate(
    params.id,
    { role },
    { new: true }
  )
    .select("_id name email role")
    .lean();

  if (!updated) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "ok", user: updated }, { status: 200 });
}
