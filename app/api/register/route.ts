import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

const ADMIN_EMAIL = "vrzo5160@gmail.com";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลให้ครบ" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ กำหนด role
    const role = email === ADMIN_EMAIL ? "admin" : "user";

    await User.create({
      name,
      email,
      password: hashedPassword,
      role, // 👈 สำคัญ
    });

    return NextResponse.json(
      {
        message: "สมัครสมาชิกสำเร็จ",
        role,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
