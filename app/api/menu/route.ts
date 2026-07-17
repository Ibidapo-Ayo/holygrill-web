import { NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET() {
  if (!BACKEND_BASE_URL) {
    return NextResponse.json(
      { message: "Backend URL is not configured." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/menu/items?available_only=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const payload = await response.json();

    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch menu from backend." },
      { status: 502 },
    );
  }
}
