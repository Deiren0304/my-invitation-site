import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchedName, attending, actualCount, finalGuestNames, notes } = body;

    // 1. Configure Gmail SMTP Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    // 2. Build Email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #844C44; border-bottom: 2px solid #844C44; padding-bottom: 8px;">
          New Wedding RSVP Received
        </h2>
        <p><strong>Primary Guest Name:</strong> ${matchedName}</p>
        <p><strong>Attending Status:</strong> <span style="color: ${attending === "Yes" ? "green" : "red"}; font-weight: bold;">${attending}</span></p>
        <p><strong>Total Attending Guests:</strong> ${actualCount}</p>
        <p><strong>Guest Names:</strong> ${finalGuestNames.length > 0 ? finalGuestNames.join(", ") : "None"}</p>
        <p><strong>Notes / Restrictions:</strong> ${notes || "None"}</p>
      </div>
    `;

    // 3. Send Email directly to your Client's Email
    await transporter.sendMail({
      from: `"Wedding RSVP System" <${process.env.GMAIL_USER}>`,
      to: process.env.CLIENT_WEDDING_EMAIL, 
      subject: `New RSVP: ${matchedName} (${attending})`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}