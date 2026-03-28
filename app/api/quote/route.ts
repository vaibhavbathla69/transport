import { NextResponse } from "next/server";
import { Resend } from "resend";

type QuoteRequestBody = {
  companyName?: string;
  contactName?: string;
  email?: string;
  requirements?: string;
  website?: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const resendTo = process.env.RESEND_TO_EMAIL || "enquiries@providatransport.com";

export async function POST(request: Request) {
  if (!resendApiKey) {
    return NextResponse.json(
      { message: "Email service is not configured." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as QuoteRequestBody;
  const companyName = body.companyName?.trim() || "";
  const contactName = body.contactName?.trim() || "";
  const email = body.email?.trim() || "";
  const requirements = body.requirements?.trim() || "";
  const website = body.website?.trim() || "";

  if (website) {
    return NextResponse.json({ ok: true });
  }

  if (!companyName || !contactName || !email || !requirements) {
    return NextResponse.json(
      { message: "Please complete all required fields." },
      { status: 400 }
    );
  }

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from: resendFrom,
      to: resendTo,
      replyTo: email,
      subject: `Provida quote request from ${companyName}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111111">
          <h2 style="margin:0 0 16px">New Quote Request</h2>
          <p style="margin:0 0 8px"><strong>Company:</strong> ${escapeHtml(companyName)}</p>
          <p style="margin:0 0 8px"><strong>Contact:</strong> ${escapeHtml(contactName)}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="margin:16px 0 8px"><strong>Requirements:</strong></p>
          <p style="margin:0;white-space:pre-wrap">${escapeHtml(requirements)}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Resend quote email failed", error);

    return NextResponse.json(
      { message: "Unable to send your request right now." },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
