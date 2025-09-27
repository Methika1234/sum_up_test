import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing checkout id" }, { status: 400 });
    }

    const SUMUP_SECRET = process.env.SUMUP_SECRET;

    if (!SUMUP_SECRET) {
      return NextResponse.json({ error: "Missing SumUp secret" }, { status: 500 });
    }

    const res = await fetch(`https://api.sumup.com/v0.1/checkouts/${id}`, {
      headers: {
        Authorization: `Bearer ${SUMUP_SECRET}`
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("SumUp API error:", errorText);
      return NextResponse.json({ error: "Failed to verify checkout" }, { status: res.status });
    }

    const checkout = await res.json();
    return NextResponse.json(checkout);
  } catch (error) {
    console.error("Error verifying checkout:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}