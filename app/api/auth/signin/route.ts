import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    // Constant-time comparison to avoid user enumeration
    if (!user || !(await bcrypt.compare(password, user.password)))
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });

    const tokenExpiration = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return NextResponse.json({
      user: { id: user._id, fullName: user.fullName, email: user.email },
      token,
      tokenExpiration,
    });

  } catch (err) {
    console.error("[signin]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}