import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { role } = await req.json();
  if (!["user", "admin"].includes(role)) {
    return NextResponse.json({ message: "Invalid role" }, { status: 400 });
  }

  await connectMongoDB();

  const _id = new mongoose.Types.ObjectId(id);

  const result = await User.updateOne(
    { _id },
    { $set: { role } }
  );


  if (result.matchedCount === 0) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const after = await User.findById(_id).select("_id email role").lean();

  return NextResponse.json({ ok: true, user: after });
}
