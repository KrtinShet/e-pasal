'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--sage)]"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || 'Unknown';
  const total = parseFloat(searchParams.get('total') || '0');

  return (
    <div className="container-main py-12">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircleIcon />
        </div>

        <h1 className="text-heading-1 font-display font-semibold text-[var(--charcoal)] mb-4">
          Thank You for Your Order!
        </h1>

        <p className="text-body-lg text-[var(--graphite)] mb-8">
          Your order has been placed successfully. We&apos;ll send you a confirmation email shortly.
        </p>

        <div className="bg-[var(--cream)] rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-caption text-[var(--slate)] mb-1">Order Number</p>
              <p className="text-body font-semibold text-[var(--charcoal)]">{orderNumber}</p>
            </div>
            <div>
              <p className="text-caption text-[var(--slate)] mb-1">Total Amount</p>
              <p className="text-body font-semibold text-[var(--charcoal)]">{formatPrice(total)}</p>
            </div>
            <div>
              <p className="text-caption text-[var(--slate)] mb-1">Payment Method</p>
              <p className="text-body font-medium text-[var(--charcoal)]">Cash on Delivery</p>
            </div>
            <div>
              <p className="text-caption text-[var(--slate)] mb-1">Status</p>
              <p className="text-body font-medium text-[var(--sage)]">Order Confirmed</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[var(--mist)]/30 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-heading-3 font-medium text-[var(--charcoal)] mb-4">
            What&apos;s Next?
          </h2>
          <ol className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-[var(--coral)] text-white rounded-full text-body-sm font-medium flex-shrink-0">
                1
              </span>
              <span className="text-body text-[var(--graphite)]">
                You&apos;ll receive an order confirmation email with your order details.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-[var(--coral)] text-white rounded-full text-body-sm font-medium flex-shrink-0">
                2
              </span>
              <span className="text-body text-[var(--graphite)]">
                Our team will process your order and prepare it for shipping.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-[var(--coral)] text-white rounded-full text-body-sm font-medium flex-shrink-0">
                3
              </span>
              <span className="text-body text-[var(--graphite)]">
                You&apos;ll receive a notification when your order is out for delivery.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-[var(--coral)] text-white rounded-full text-body-sm font-medium flex-shrink-0">
                4
              </span>
              <span className="text-body text-[var(--graphite)]">
                Pay with cash when your order arrives at your doorstep.
              </span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-primary">
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 border border-[var(--mist)]/30 rounded-lg text-body font-medium text-[var(--charcoal)] hover:bg-[var(--cream)] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="container-main py-12">
          <div className="max-w-lg mx-auto text-center animate-pulse">
            <div className="w-16 h-16 bg-[var(--mist)]/30 rounded-full mx-auto mb-6" />
            <div className="h-8 bg-[var(--mist)]/30 rounded w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-[var(--mist)]/30 rounded w-full mb-8" />
            <div className="h-32 bg-[var(--mist)]/30 rounded" />
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
