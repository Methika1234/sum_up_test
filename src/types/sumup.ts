export interface CreateCheckoutRequest {
  amount: number;
  currency?: string;
  description?: string;
}

export interface CreateCheckoutResponse {
  id: string;
  status: "PENDING" | "PAID" | "FAILED";
  amount: number;
  currency: string;
  merchant_code: string;
  checkout_reference: string;
  description?: string;
  redirect_url?: string;
  date?: string;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  status: "SUCCESSFUL" | "FAILED" | "PENDING";
  payment_type: string;
  timestamp: string;
  amount?: number;
  currency?: string;
}

export interface VerifyCheckoutResponse {
  id: string;
  status: "PENDING" | "PAID" | "FAILED";
  amount: number;
  currency: string;
  description?: string;
  transactions: Transaction[];
  date: string;
  checkout_reference: string;
  merchant_code: string;
}

export interface SumUpCardWidgetCallbacks {
  onResponse: (type: SumUpCardResponseType, body: any) => void;
}

export type SumUpCardResponseType =
  | "sent"
  | "invalid"
  | "auth-screen"
  | "error"
  | "success"
  | "fail";

export interface SumUpCardWidget {
  mount: (config: {
    id: string;
    checkoutId: string;
    onResponse: (type: SumUpCardResponseType, body: any) => void;
  }) => void;
}

declare global {
  interface Window {
    SumUpCard?: SumUpCardWidget;
  }
}