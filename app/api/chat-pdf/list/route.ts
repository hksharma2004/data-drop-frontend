import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/user.actions";

export async function GET() {
  const apiBase = process.env.CHAT_PDF_API_BASE || "http://localhost:8000";

  try {
    // getting current user
    const currentUser = await getCurrentUser();

    // checking if the user has been authenticated
    if (!currentUser || !currentUser.$id) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 } // Unauthorized
      );
    }

    // passing the owner's user id to the backend list-pdfs endpoint
    const response = await fetch(`${apiBase}/list-pdfs?owner=${currentUser.$id}`, {
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