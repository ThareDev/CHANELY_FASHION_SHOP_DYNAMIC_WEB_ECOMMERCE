import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";

const createTransporter = () =>
    nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user, address, items, total, note } = body;

        if (!user?.fullName || !user?.email || !address?.line1 || !items?.length)
            return NextResponse.json({ message: "Missing required fields." }, { status: 400 });

        await connectDB();

        const order = await Order.create({
            customerName: user.fullName,
            customerEmail: user.email,
            customerPhone: user.whatsapp || "",
            address,
            items,
            total,
            note: note || "",
            status: "pending",
        });

        const orderId = order._id.toString().slice(-6).toUpperCase();

        const itemRows = items
            .map(
                (i: { name: string; size: string; quantity: number; price: number }) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #F2EDE6;font-size:13px;color:#2C2925;">${i.name} — ${i.size}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #F2EDE6;text-align:center;font-size:13px;color:#2C2925;">${i.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #F2EDE6;text-align:right;font-size:13px;color:#2C2925;">$${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`
            )
            .join("");

        const addressBlock = `${address.line1}${address.line2 ? ", " + address.line2 : ""}, ${address.city}, ${address.province} ${address.postal}`;

        const transporter = createTransporter();

        await transporter.sendMail({
            from: `"Chanely Customer" <${process.env.EMAIL_FROM}>`,
            to: process.env.OWNER_EMAIL,
            replyTo: user.email,
            subject: `[Chanely Order] #${orderId} — ${user.fullName} — $${total.toFixed(2)}`,
            headers: {
                "X-Priority": "1",
                "X-MSMail-Priority": "High",
                "Importance": "High",
                "Precedence": "bulk",
                "X-Mailer": "Chanely-Order-System",
                "List-Unsubscribe": `<mailto:${process.env.EMAIL_FROM}>`,
            },
            html: `
        <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:40px 32px;background:#FAF8F5;border-top:2px solid #B89A6A;">
          <p style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#B89A6A;margin:0 0 16px;">Chanely · New Pre-Order</p>
          <h2 style="font-size:28px;font-weight:300;color:#1A1714;margin:0 0 8px;">Order #${orderId}</h2>
          <p style="color:#9E9189;font-size:13px;line-height:1.6;margin:0 0 32px;">A new pre-order has been placed. Review the details below.</p>

          <!-- Customer -->
          <div style="background:#F2EDE6;padding:20px 24px;margin-bottom:24px;">
            <p style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#B89A6A;margin:0 0 12px;">Customer</p>
            <p style="font-size:14px;color:#2C2925;margin:0 0 4px;">${user.fullName}</p>
            <p style="font-size:12px;color:#9E9189;margin:0 0 4px;">${user.email}</p>
            <p style="font-size:12px;color:#9E9189;margin:0;">${user.whatsapp || "—"}</p>
          </div>

          <!-- Items -->
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr style="background:#F2EDE6;">
              <th style="padding:10px 12px;text-align:left;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9189;font-weight:400;">Item</th>
              <th style="padding:10px 12px;text-align:center;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9189;font-weight:400;">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9189;font-weight:400;">Price</th>
            </tr>
            ${itemRows}
            <tr>
              <td colspan="2" style="padding:12px 12px 4px;text-align:right;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9189;">Total</td>
              <td style="padding:12px 12px 4px;text-align:right;font-size:22px;font-weight:300;color:#2C2925;">$${total.toFixed(2)}</td>
            </tr>
          </table>

          <!-- Address -->
          <div style="background:#F2EDE6;padding:20px 24px;margin-bottom:24px;">
            <p style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#B89A6A;margin:0 0 12px;">Delivery Address</p>
            <p style="font-size:13px;color:#2C2925;margin:0;">${addressBlock}</p>
            ${note ? `<p style="font-size:12px;color:#9E9189;margin:10px 0 0;font-style:italic;">"${note}"</p>` : ""}
          </div>

          <p style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9189;margin:0;padding-top:20px;border-top:1px solid #F2EDE6;">
            Chanely · Pre-Order System
          </p>
        </div>`,
        });

        // ── Email to CUSTOMER ──
        await transporter.sendMail({
            from: `"Chanely" <${process.env.EMAIL_FROM}>`,
            to: user.email,
            subject: `Your Chanely Pre-Order is Confirmed — #${orderId}`,
            html: `
        <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:40px 32px;background:#FAF8F5;border-top:2px solid #B89A6A;">
          <p style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#B89A6A;margin:0 0 16px;">Chanely · Order Confirmation</p>
          <h2 style="font-size:28px;font-weight:300;color:#1A1714;margin:0 0 8px;">Thank you, ${user.fullName.split(" ")[0]}.</h2>
          <p style="color:#9E9189;font-size:13px;line-height:1.8;margin:0 0 32px;">
            Your pre-order <strong style="color:#2C2925;">#${orderId}</strong> has been received.
            Our team will review it and contact you within <strong style="color:#2C2925;">24 hours</strong>
            to confirm availability and arrange delivery.
          </p>

          <!-- Items -->
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr style="background:#F2EDE6;">
              <th style="padding:10px 12px;text-align:left;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9189;font-weight:400;">Item</th>
              <th style="padding:10px 12px;text-align:center;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9189;font-weight:400;">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9189;font-weight:400;">Price</th>
            </tr>
            ${itemRows}
            <tr>
              <td colspan="2" style="padding:12px 12px 4px;text-align:right;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9189;">Total</td>
              <td style="padding:12px 12px 4px;text-align:right;font-size:22px;font-weight:300;color:#2C2925;">$${total.toFixed(2)}</td>
            </tr>
          </table>

          <!-- Address -->
          <div style="background:#F2EDE6;padding:20px 24px;margin-bottom:24px;">
            <p style="font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#B89A6A;margin:0 0 12px;">Delivery Address</p>
            <p style="font-size:13px;color:#2C2925;margin:0;">${addressBlock}</p>
          </div>

          <!-- Note -->
          <div style="background:#2C2925;padding:20px 24px;margin-bottom:32px;">
            <p style="font-size:12px;color:rgba(250,248,245,0.75);line-height:1.8;margin:0;">
              Questions? Simply reply to this email or reach us on WhatsApp — we're happy to help.
            </p>
          </div>

          <p style="font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#9E9189;margin:0;padding-top:20px;border-top:1px solid #F2EDE6;">
            256-bit SSL Encrypted · Chanely · Wear Your Grace
          </p>
        </div>`,
        });

        return NextResponse.json({ message: "Order placed.", orderId });
    } catch (err) {
        console.error("[preorder]", err);
        return NextResponse.json({ message: "Server error." }, { status: 500 });
    }
}