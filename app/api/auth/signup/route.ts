import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, whatsapp, password } = await req.json();

    if (!fullName || !email || !whatsapp || !password)
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase(),
      whatsapp,
      password: hashed,
    });

    const tokenExpiration = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return NextResponse.json({
      user: { id: user._id, fullName: user.fullName, email: user.email, whatsapp: user.whatsapp },
      token,
      tokenExpiration,
    });

  } catch (err) {
    console.error("[signup]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}