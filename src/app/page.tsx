import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              SumUp Checkout Demo
            </h1>
            <p className="text-gray-600">
              Experience secure payment processing with SumUp's card widget
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h2 className="font-semibold text-blue-900 mb-2">Features</h2>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• PCI compliant card processing</li>
                <li>• 3D Secure authentication</li>
                <li>• Real-time payment verification</li>
                <li>• Multiple currency support</li>
              </ul>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Start Payment Process
            </Link>

            <div className="text-xs text-gray-500 mt-4">
              <p>Test environment with demo credentials</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-600">
        <p>Built with Next.js and SumUp Payment API</p>
      </footer>
    </div>
  );
}
