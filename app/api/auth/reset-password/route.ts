import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { PasswordResetToken } from "@/lib/models/PasswordResetToken";

export async function POST(req: NextRequest) {
  try {
    const { email, token, newPassword } = await req.json();
    if (!email || !token || !newPassword)
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });

    if (newPassword.length < 8)
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return NextResponse.json({ message: "Invalid request." }, { status: 400 });

    const record = await PasswordResetToken.findOne({ userId: user._id });
    if (!record || record.expiresAt < new Date())
      return NextResponse.json({ message: "Code has expired. Please request a new one." }, { status: 400 });

    const valid = await bcrypt.compare(token, record.token);
    if (!valid)
      return NextResponse.json({ message: "Invalid code." }, { status: 400 });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    await PasswordResetToken.deleteOne({ _id: record._id });

    return NextResponse.json({ message: "Password updated." });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}