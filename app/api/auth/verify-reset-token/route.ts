import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { PasswordResetToken } from "@/lib/models/PasswordResetToken";

export async function POST(req: NextRequest) {
  try {
    const { email, token } = await req.json();
    if (!email || !token)
      return NextResponse.json({ message: "Email and code are required." }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return NextResponse.json({ message: "Invalid request." }, { status: 400 });

    const record = await PasswordResetToken.findOne({ userId: user._id });
    if (!record || record.expiresAt < new Date())
      return NextResponse.json({ message: "Code has expired. Please request a new one." }, { status: 400 });

    const valid = await bcrypt.compare(token, record.token);
    if (!valid)
      return NextResponse.json({ message: "Incorrect code. Please try again." }, { status: 400 });

    return NextResponse.json({ message: "Verified." });
  } catch (err) {
    console.error("[verify-reset-token]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}