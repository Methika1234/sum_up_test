import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const { amount, currency = "EUR", description = "My Checkout" } = await request.json();

    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 });
    }

    const SUMUP_SECRET = process.env.SUMUP_SECRET;
    const MERCHANT_CODE = process.env.SUMUP_MERCHANT_CODE;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!SUMUP_SECRET || !MERCHANT_CODE || !BASE_URL) {
      return NextResponse.json({ error: "Missing environment variables" }, { status: 500 });
    }

    const REDIRECT_URL = `${BASE_URL}/checkout/success`;

    const body = {
      amount: Number(amount),
      currency,
      merchant_code: MERCHANT_CODE,
      checkout_reference: randomUUID(),
      description,
      redirect_url: REDIRECT_URL,
    };

    const res = await fetch("https://api.sumup.com/v0.1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUMUP_SECRET}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("SumUp API error:", errorText);
      return NextResponse.json({ error: "Failed to create checkout" }, { status: res.status });
    }

    const checkout = await res.json();
    return NextResponse.json(checkout);
  } catch (error) {
    console.error("Error creating checkout:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}