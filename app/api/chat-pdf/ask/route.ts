import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiBase = process.env.CHAT_PDF_API_BASE || "http://localhost:8000";

  try {
    const body = await request.json();
    const response = await fetch(`${apiBase}/chat-with-pdfs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `Upstream error (${response.status}): ${text}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to reach Chat-PDF backend: ${message}` },
      { status: 502 }
    );
  }
}


