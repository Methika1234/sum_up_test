# SumUp Checkout Demo

A production-ready Next.js application demonstrating SumUp payment integration with their Card Widget for secure payment processing.

## Features

- 🔒 **PCI Compliant**: Uses SumUp's hosted card widget for secure card data handling
- 🛡️ **3D Secure**: Automatic 3D Secure authentication for enhanced security
- ⚡ **Real-time Verification**: Server-side payment status verification
- 🌍 **Multi-currency**: Support for EUR, USD, GBP and other currencies
- 📱 **Responsive**: Mobile-friendly design with Tailwind CSS
- 🎯 **TypeScript**: Full type safety throughout the application

## Architecture

The application follows the secure SumUp payment flow:

1. **Server-side Checkout Creation**: POST `/api/sumup/create-checkout` creates a checkout with SumUp
2. **Client-side Widget**: SumUp's card widget handles card entry and 3D Secure challenges
3. **Server-side Verification**: GET `/api/sumup/verify` confirms payment status

## Prerequisites

- Node.js 18+
- SumUp API credentials (API key and merchant code)
- SumUp account with payments scope enabled

## Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd sumup-checkout
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env.local` file with your SumUp credentials:
   ```env
   SUMUP_SECRET=sup_sk_your_api_key_here
   SUMUP_MERCHANT_CODE=your_merchant_code
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### POST `/api/sumup/create-checkout`
Creates a new checkout session with SumUp.

**Request:**
```json
{
  "amount": 10.50,
  "currency": "EUR",
  "description": "Test Purchase"
}
```

**Response:**
```json
{
  "id": "checkout_id",
  "status": "PENDING",
  "amount": 10.50,
  "currency": "EUR"
}
```

### GET `/api/sumup/verify?id=checkout_id`
Verifies the payment status of a checkout.

**Response:**
```json
{
  "id": "checkout_id",
  "status": "PAID|FAILED|PENDING",
  "amount": 10.50,
  "currency": "EUR",
  "transactions": [...]
}
```

## File Structure

```
src/
├── app/
│   ├── api/sumup/           # API routes
│   ├── checkout/            # Payment pages
│   └── page.tsx             # Home page
├── types/
│   └── sumup.ts             # TypeScript definitions
└── ...
```

## Security Notes

- ✅ API keys are kept server-side only
- ✅ All payment data is handled by SumUp's PCI-compliant infrastructure
- ✅ Client-side validation with server-side verification
- ✅ HTTPS required for production (handled by SumUp widget)

## Testing

Use SumUp's test card numbers for development:
- **Successful payment**: 4000 0000 0000 0002
- **Failed payment**: 4000 0000 0000 0036
- **3D Secure**: 4000 0000 0000 3220

## Production Deployment

1. Update environment variables for production
2. Ensure HTTPS is enabled
3. Update `NEXT_PUBLIC_BASE_URL` to your production domain
4. Use production SumUp API credentials

## Learn More

- [SumUp Developer Documentation](https://developer.sumup.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SumUp Payment Widget](https://developer.sumup.com/docs/widgets-card-widget)
