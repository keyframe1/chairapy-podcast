import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON." },
      { status: 400 },
    );
  }

  const email =
    body && typeof body === "object" && "email" in body
      ? String((body as { email: unknown }).email ?? "").trim()
      : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;

  if (!apiKey || !formId) {
    console.error(
      "[subscribe] CONVERTKIT_API_KEY or CONVERTKIT_FORM_ID is not set.",
    );
    return NextResponse.json(
      { error: "Subscription service is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: apiKey, email }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("[subscribe] ConvertKit error", res.status, text);
      return NextResponse.json(
        { error: "Could not subscribe. Try again in a minute." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscribe] Network error", err);
    return NextResponse.json(
      { error: "Could not reach the subscription service." },
      { status: 502 },
    );
  }
}
