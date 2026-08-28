import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchedName, attending, actualCount, finalGuestNames, notes } = body;

    // 1. Configure Gmail Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const isYes = attending === "Yes";

    // 2. Format Beautiful Wedding Email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f5f2; margin: 0; padding: 30px 10px; }
          .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e8dec8; }
          .header { background-color: #844C44; color: #ffffff; text-align: center; padding: 32px 20px; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; }
          .header p { margin: 6px 0 0; font-size: 13px; color: #EADCCF; opacity: 0.9; }
          .content { padding: 32px 28px; }
          .badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
          .badge-yes { background-color: #e6f4ea; color: #137333; }
          .badge-no { background-color: #fce8e6; color: #c5221f; }
          .info-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .info-table td { padding: 12px 0; border-bottom: 1px solid #f0e8e0; font-size: 14px; color: #4a4a4a; }
          .info-table td.label { font-weight: 600; color: #844C44; width: 40%; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
          .notes-box { background: #fdfaf7; border-left: 3px solid #844C44; padding: 14px 18px; margin-top: 20px; border-radius: 4px; font-style: italic; color: #555; }
          .footer { text-align: center; padding: 20px; font-size: 11px; color: #999; border-top: 1px solid #f0f0f0; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>New RSVP Received</h1>
            <p>Arlan Dave & Rei Marie Anne Wedding</p>
          </div>
          <div class="content">
            <div style="text-align: center; margin-bottom: 10px;">
              <span class="badge ${isYes ? 'badge-yes' : 'badge-no'}">
                ${isYes ? '✓ Joyfully Accepts' : '✗ Regretfully Declines'}
              </span>
            </div>

            <table class="info-table">
              <tr>
                <td class="label">Primary Guest</td>
                <td><strong>${matchedName}</strong></td>
              </tr>
              <tr>
                <td class="label">Total Attending</td>
                <td><strong>${actualCount} ${actualCount === 1 ? 'Person' : 'People'}</strong></td>
              </tr>
              <tr>
                <td class="label">Guest Names</td>
                <td>${finalGuestNames.length > 0 ? finalGuestNames.join(", ") : "N/A"}</td>
              </tr>
            </table>

            ${notes ? `
              <div class="notes-box">
                <strong style="color: #844C44; font-style: normal; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 4px;">Message / Dietary Notes:</strong>
                "${notes}"
              </div>
            ` : ''}
          </div>
          <div class="footer">
            Sent via Wedding RSVP Invitation • 2026
          </div>
        </div>
      </body>
      </html>
    `;

    const recipient = process.env.CLIENT_WEDDING_EMAIL || "canalesarlandaven@gmail.com";
    const myEmail = "lawrenvalderama23@gmail.com";
    const sender = process.env.GMAIL_USER;

    const info = await transporter.sendMail({
      from: `"Wedding RSVP System" <${sender}>`,
      to: `${recipient}, ${myEmail}`,
      subject: `New RSVP: ${matchedName} (${attending})`,
      html: emailHtml,
    });

    console.log("Email sent successfully! Message ID:", info.messageId);

    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (error: any) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}