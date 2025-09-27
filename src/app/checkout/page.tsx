"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    SumUpCard?: any;
  }
}

interface Checkout {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export default function CheckoutPage() {
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("10.10");
  const [currency, setCurrency] = useState<string>("EUR");
  const [description, setDescription] = useState<string>("Test Purchase");

  const createCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sumup/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
          description
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout");
      }

      const checkout: Checkout = await response.json();
      setCheckoutId(checkout.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!checkoutId || !window.SumUpCard) return;

    window.SumUpCard.mount({
      id: "sumup-card",
      checkoutId,
      onResponse: async (type: string, body: any) => {
        console.log("SumUp response:", type, body);

        if (type === "success") {
          window.location.href = `/checkout/success?id=${checkoutId}`;
        } else if (type === "error" || type === "fail") {
          setError("Payment failed. Please try again.");
        }
      },
    });
  }, [checkoutId]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <script src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js" async />

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">SumUp Checkout</h1>

        {!checkoutId ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <button
              onClick={createCheckout}
              disabled={loading || !amount}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating Checkout..." : "Proceed to Payment"}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Amount:</strong> {amount} {currency}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Description:</strong> {description}
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div id="sumup-card" className="mt-4"></div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setCheckoutId(null);
                  setError(null);
                }}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}