"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface CheckoutVerification {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description?: string;
  transactions?: Array<{
    id: string;
    status: string;
    payment_type: string;
    timestamp: string;
  }>;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("id");

  const [status, setStatus] = useState<string>("CHECKING...");
  const [checkout, setCheckout] = useState<CheckoutVerification | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkoutId) {
      setError("No checkout ID provided");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/sumup/verify?id=${encodeURIComponent(checkoutId)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to verify payment");
        }

        const checkoutData: CheckoutVerification = await response.json();
        setCheckout(checkoutData);
        setStatus(checkoutData.status);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setStatus("ERROR");
      }
    };

    verifyPayment();
  }, [checkoutId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600 bg-green-50 border-green-200";
      case "FAILED":
        return "text-red-600 bg-red-50 border-red-200";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "ERROR":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return "✅";
      case "FAILED":
        return "❌";
      case "PENDING":
        return "⏳";
      case "ERROR":
        return "❌";
      default:
        return "🔄";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Status</h1>

          {checkoutId && (
            <p className="text-sm text-gray-600">
              Checkout ID: <span className="font-mono">{checkoutId}</span>
            </p>
          )}
        </div>

        <div className={`p-4 rounded-md border mb-6 ${getStatusColor(status)}`}>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">{getStatusIcon(status)}</span>
            <span className="font-semibold text-lg">{status}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}

        {checkout && (
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Details</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Amount:</strong> {checkout.amount} {checkout.currency}</p>
                {checkout.description && (
                  <p><strong>Description:</strong> {checkout.description}</p>
                )}
                <p><strong>Status:</strong> {checkout.status}</p>
              </div>
            </div>

            {checkout.transactions && checkout.transactions.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-gray-900 mb-2">Transaction Details</h3>
                {checkout.transactions.map((transaction, index) => (
                  <div key={transaction.id} className="space-y-1 text-sm">
                    <p><strong>Transaction {index + 1}:</strong> {transaction.id}</p>
                    <p><strong>Status:</strong> {transaction.status}</p>
                    <p><strong>Payment Type:</strong> {transaction.payment_type}</p>
                    <p><strong>Timestamp:</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => window.location.href = "/checkout"}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Make Another Payment
          </button>

          <button
            onClick={() => window.location.href = "/"}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}