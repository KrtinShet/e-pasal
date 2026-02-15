'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useCart } from '@/contexts/cart-context';
import { useStore } from '@/contexts/store-context';
import type { CustomerInfo, ShippingAddress } from '@/types/order';

const PAYMENT_METHOD_INFO: Record<
  string,
  { name: string; description: string; color?: string; label?: string }
> = {
  cod: { name: 'Cash on Delivery (COD)', description: 'Pay when your order is delivered' },
  esewa: {
    name: 'eSewa',
    description: 'Pay with your eSewa digital wallet',
    color: '#60BB46',
    label: 'eS',
  },
  khalti: {
    name: 'Khalti',
    description: 'Pay with your Khalti wallet',
    color: '#5C2D91',
    label: 'K',
  },
  fonepay: {
    name: 'Fonepay',
    description: 'Pay via QR code with any banking app',
    color: '#E31B23',
    label: 'FP',
  },
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { store } = useStore();
  const { items, summary, clearCart, isHydrated } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address: '',
    city: '',
    postalCode: '',
    state: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  const [availableMethods, setAvailableMethods] = useState<string[]>(['cod']);

  useEffect(() => {
    if (!store?.subdomain) return;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';
    fetch(`${apiBaseUrl}/storefront/${store.subdomain}/payment-methods`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setAvailableMethods(data.data);
        }
      })
      .catch(() => {});
  }, [store?.subdomain]);

  if (!isHydrated) {
    return (
      <div className="container-main py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-[var(--grey-300)]/30 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-[var(--grey-300)]/30 rounded" />
              <div className="h-64 bg-[var(--grey-300)]/30 rounded" />
            </div>
            <div className="h-96 bg-[var(--grey-300)]/30 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-main py-12">
        <div className="text-center py-16">
          <h1 className="text-heading-1 font-display font-semibold text-[var(--grey-900)] mb-4">
            Your cart is empty
          </h1>
          <p className="text-body text-[var(--grey-700)] mb-8">
            Add some products to your cart before checking out.
          </p>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const subdomain = store?.subdomain;
      if (!subdomain) {
        setError('Store information is not available. Please refresh the page.');
        setIsSubmitting(false);
        return;
      }

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

      const orderPayload = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        customer: {
          name: customerInfo.name,
          email: customerInfo.email || undefined,
          phone: customerInfo.phone,
        },
        shipping: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state || undefined,
          postalCode: shippingAddress.postalCode || undefined,
          notes: notes || undefined,
        },
        paymentMethod,
      };

      const response = await fetch(`${apiBaseUrl}/storefront/${subdomain}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to place order');
      }

      if (paymentMethod !== 'cod' && data.data.paymentUrl) {
        if (data.data.formData) {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = data.data.paymentUrl;
          const formData = data.data.formData as Record<string, string>;
          for (const [key, value] of Object.entries(formData)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
          }
          document.body.appendChild(form);
          form.submit();
        } else {
          window.location.href = data.data.paymentUrl;
        }
        return;
      }

      clearCart();
      router.push(`/checkout/confirmation?order=${data.data.orderNumber}&total=${data.data.total}`);
    } catch {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-main py-8 md:py-12">
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-body-sm text-[var(--grey-600)] hover:text-[var(--grey-900)] transition-colors"
        >
          <ChevronLeftIcon />
          Back to cart
        </Link>
      </div>

      <h1 className="text-heading-1 font-display font-semibold text-[var(--grey-900)] mb-8">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Information */}
            <section className="bg-white rounded-lg border border-[var(--grey-300)]/30 p-6">
              <h2 className="text-heading-3 font-medium text-[var(--grey-900)] mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-body-sm font-medium text-[var(--grey-900)] mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[var(--grey-300)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--store-primary)]/20 focus:border-[var(--store-primary)]"
                    placeholder="Your full name"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-body-sm font-medium text-[var(--grey-900)] mb-1"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[var(--grey-300)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--store-primary)]/20 focus:border-[var(--store-primary)]"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-body-sm font-medium text-[var(--grey-900)] mb-1"
                    >
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[var(--grey-300)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--store-primary)]/20 focus:border-[var(--store-primary)]"
                      placeholder="+977 98XXXXXXXX"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white rounded-lg border border-[var(--grey-300)]/30 p-6">
              <h2 className="text-heading-3 font-medium text-[var(--grey-900)] mb-6">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-body-sm font-medium text-[var(--grey-900)] mb-1"
                  >
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    required
                    value={shippingAddress.address}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, address: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-[var(--grey-300)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--store-primary)]/20 focus:border-[var(--store-primary)]"
                    placeholder="Street address, apartment, etc."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-body-sm font-medium text-[var(--grey-900)] mb-1"
                    >
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      required
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, city: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-[var(--grey-300)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--store-primary)]/20 focus:border-[var(--store-primary)]"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-body-sm font-medium text-[var(--grey-900)] mb-1"
                    >
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={shippingAddress.state || ''}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, state: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-[var(--grey-300)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--store-primary)]/20 focus:border-[var(--store-primary)]"
                      placeholder="State/Province"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-body-sm font-medium text-[var(--grey-900)] mb-1"
                    >
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-[var(--grey-300)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--store-primary)]/20 focus:border-[var(--store-primary)]"
                      placeholder="Postal code"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-lg border border-[var(--grey-300)]/30 p-6">
              <h2 className="text-heading-3 font-medium text-[var(--grey-900)] mb-6">
                Payment Method
              </h2>
              <div className="space-y-3">
                {availableMethods.map((method) => {
                  const info = PAYMENT_METHOD_INFO[method];
                  if (!info) return null;
                  return (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-colors text-left ${
                        paymentMethod === method
                          ? 'bg-[var(--grey-50)] border-[var(--store-primary)]'
                          : 'border-[var(--grey-300)]/30 hover:border-[var(--store-primary)]/50'
                      }`}
                    >
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                        style={{ backgroundColor: info.color || '#f3f4f6' }}
                      >
                        {method === 'cod' ? (
                          <TruckIcon />
                        ) : (
                          <span className="text-white font-bold text-body-sm">{info.label}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--grey-900)]">{info.name}</p>
                        <p className="text-body-sm text-[var(--grey-600)]">{info.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Order Notes */}
            <section className="bg-white rounded-lg border border-[var(--grey-300)]/30 p-6">
              <h2 className="text-heading-3 font-medium text-[var(--grey-900)] mb-6">
                Order Notes (Optional)
              </h2>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-[var(--grey-300)]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--store-primary)]/20 focus:border-[var(--store-primary)] resize-none"
                placeholder="Any special instructions for your order..."
              />
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-[var(--grey-300)]/30 p-6 sticky top-24">
              <h2 className="text-heading-3 font-medium text-[var(--grey-900)] mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.productId}:${item.variantId || 'default'}`}
                    className="flex gap-3"
                  >
                    {item.image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[var(--grey-50)] flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium text-[var(--grey-900)] truncate">
                        {item.name}
                      </p>
                      {item.variantName && (
                        <p className="text-caption text-[var(--grey-600)]">{item.variantName}</p>
                      )}
                      <p className="text-caption text-[var(--grey-600)]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-body-sm font-medium text-[var(--grey-900)]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[var(--grey-300)]/20 pt-4 space-y-2">
                <div className="flex justify-between text-body">
                  <span className="text-[var(--grey-600)]">Subtotal</span>
                  <span className="text-[var(--grey-900)]">{formatPrice(summary.subtotal)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-body">
                    <span className="text-[var(--grey-600)]">Discount</span>
                    <span className="text-[var(--sage)]">-{formatPrice(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-body">
                  <span className="text-[var(--grey-600)]">Shipping</span>
                  <span className="text-[var(--grey-900)]">
                    {summary.subtotal >= 2000 ? 'Free' : formatPrice(150)}
                  </span>
                </div>
                <div className="flex justify-between text-heading-3 font-semibold pt-2 border-t border-[var(--grey-300)]/20">
                  <span className="text-[var(--grey-900)]">Total</span>
                  <span className="text-[var(--grey-900)]">
                    {formatPrice(summary.total + (summary.subtotal >= 2000 ? 0 : 150))}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-body-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="mt-4 text-caption text-[var(--grey-600)] text-center">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
