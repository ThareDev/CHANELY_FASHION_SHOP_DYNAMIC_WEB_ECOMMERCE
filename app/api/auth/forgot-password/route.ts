import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { PasswordResetToken } from "@/lib/models/PasswordResetToken";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ message: "Email is required." }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return NextResponse.json(
        { message: "No account found with that email address." },
        { status: 404 }
      );

    // Delete any existing tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = await bcrypt.hash(code, 10);

    await PasswordResetToken.create({
      userId: user._id,
      token: hashed,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Chanely" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: "Your Chanely Password Reset Code",
      html: `
        <div style="font-family:'Helvetica Neue',sans-serif;max-width:480px;margin:0 auto;padding:40px 32px;background:#FAF8F5;border-top:2px solid #B89A6A;">
          <p style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#B89A6A;margin:0 0 16px;">Chanely · Password Reset</p>
          <h2 style="font-size:28px;font-weight:300;color:#1A1714;margin:0 0 24px;">Reset Your Password</h2>
          <p style="color:#9E9189;font-size:13px;line-height:1.6;margin:0 0 32px;">
            Use the code below to reset your password. It expires in <strong>15 minutes</strong>.
          </p>
          <div style="background:#F2EDE6;padding:28px;text-align:center;letter-spacing:0.5em;font-size:32px;font-weight:500;color:#2C2925;border:1px solid #D9D0C4;">
            ${code}
          </div>
          <p style="color:#9E9189;font-size:11px;margin-top:24px;line-height:1.6;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Code sent." });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}