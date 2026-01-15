import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  return NextResponse.json({ message: "MongoDB Connected (Local)" });
}
