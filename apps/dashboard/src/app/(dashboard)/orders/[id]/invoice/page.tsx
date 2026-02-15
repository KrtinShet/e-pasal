'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import { apiRequest } from '@/lib/api';

interface OrderItem {
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  total: number;
}

interface InvoiceOrder {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  shipping: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  createdAt: string;
}

interface StoreInfo {
  name: string;
  subdomain: string;
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function formatPaymentMethod(method: string): string {
  const labels: Record<string, string> = {
    cod: 'Cash on Delivery',
    esewa: 'eSewa',
    khalti: 'Khalti',
    fonepay: 'FonePay',
    bank_transfer: 'Bank Transfer',
  };
  return labels[method] || method;
}

export default function InvoicePage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<InvoiceOrder | null>(null);
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [orderRes, storeRes] = await Promise.all([
        apiRequest<{ success: boolean; data: InvoiceOrder }>(`/orders/${orderId}`),
        apiRequest<{ success: boolean; data: StoreInfo }>('/stores/me'),
      ]);
      setOrder(orderRes.data);
      setStore(storeRes.data);
    } catch {
      // Error handled below
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        #invoice-content, #invoice-content * { visibility: visible; }
        #invoice-content { position: absolute; left: 0; top: 0; width: 100%; padding: 40px; }
        .no-print { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="h-96 w-full skel rounded-lg" />
      </div>
    );
  }

  if (!order || !store) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Failed to load invoice</p>
          <Link
            href={`/orders/${orderId}`}
            className="mt-4 inline-block text-sm text-[var(--primary-main)]"
          >
            Back to Order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="no-print flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/orders/${orderId}`}
            className="text-sm text-[var(--grey-600)] hover:text-[var(--grey-900)] transition-colors"
          >
            Back to Order
          </Link>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 text-sm font-medium text-white bg-[var(--grey-900)] rounded-lg hover:bg-[var(--grey-800)] transition-colors"
        >
          Print Invoice
        </button>
      </div>

      <div
        id="invoice-content"
        className="bg-white rounded-xl border border-[var(--grey-200)]/20 p-8 max-w-3xl mx-auto"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--grey-900)]">{store.name}</h1>
            {store.contact.address && (
              <p className="text-sm text-[var(--grey-600)] mt-1">{store.contact.address}</p>
            )}
            {store.contact.email && (
              <p className="text-sm text-[var(--grey-600)]">{store.contact.email}</p>
            )}
            {store.contact.phone && (
              <p className="text-sm text-[var(--grey-600)]">{store.contact.phone}</p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-[var(--grey-900)]">INVOICE</h2>
            <p className="text-sm text-[var(--grey-600)] mt-1">#{order.orderNumber}</p>
            <p className="text-sm text-[var(--grey-600)]">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="border-t border-[var(--grey-200)]/20 pt-6 mb-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-medium text-[var(--grey-500)] uppercase tracking-wider mb-2">
                Bill To
              </p>
              <p className="text-sm font-medium text-[var(--grey-900)]">{order.shipping.name}</p>
              <p className="text-sm text-[var(--grey-600)]">{order.shipping.address}</p>
              <p className="text-sm text-[var(--grey-600)]">
                {order.shipping.city}
                {order.shipping.state && `, ${order.shipping.state}`}
                {order.shipping.postalCode && ` ${order.shipping.postalCode}`}
              </p>
              <p className="text-sm text-[var(--grey-600)]">{order.shipping.country}</p>
              <p className="text-sm text-[var(--grey-600)] mt-1">{order.shipping.phone}</p>
              {order.shipping.email && (
                <p className="text-sm text-[var(--grey-600)]">{order.shipping.email}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-[var(--grey-500)] uppercase tracking-wider mb-2">
                Payment
              </p>
              <p className="text-sm text-[var(--grey-900)]">
                {formatPaymentMethod(order.paymentMethod)}
              </p>
              <p className="text-sm text-[var(--grey-600)] capitalize">
                Status: {order.paymentStatus}
              </p>
            </div>
          </div>
        </div>

        <table className="w-full mb-6">
          <thead>
            <tr className="border-b-2 border-[var(--grey-900)]">
              <th className="text-left py-2 text-xs font-semibold text-[var(--grey-900)] uppercase">
                Item
              </th>
              <th className="text-center py-2 text-xs font-semibold text-[var(--grey-900)] uppercase">
                Qty
              </th>
              <th className="text-right py-2 text-xs font-semibold text-[var(--grey-900)] uppercase">
                Price
              </th>
              <th className="text-right py-2 text-xs font-semibold text-[var(--grey-900)] uppercase">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i} className="border-b border-[var(--grey-200)]/20">
                <td className="py-3 text-sm text-[var(--grey-900)]">
                  {item.name}
                  {item.sku && (
                    <span className="text-xs text-[var(--grey-500)] ml-2">({item.sku})</span>
                  )}
                </td>
                <td className="py-3 text-sm text-center text-[var(--grey-900)]">{item.quantity}</td>
                <td className="py-3 text-sm text-right text-[var(--grey-600)]">
                  {formatPrice(item.price)}
                </td>
                <td className="py-3 text-sm text-right font-medium text-[var(--grey-900)]">
                  {formatPrice(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--grey-600)]">Subtotal</span>
              <span className="text-[var(--grey-900)]">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--grey-600)]">Discount</span>
                <span className="text-green-600">-{formatPrice(order.discount)}</span>
              </div>
            )}
            {order.shippingCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--grey-600)]">Shipping</span>
                <span className="text-[var(--grey-900)]">{formatPrice(order.shippingCost)}</span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--grey-600)]">Tax</span>
                <span className="text-[var(--grey-900)]">{formatPrice(order.tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t-2 border-[var(--grey-900)]">
              <span className="text-[var(--grey-900)]">Total</span>
              <span className="text-[var(--grey-900)]">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--grey-200)]/20 text-center">
          <p className="text-xs text-[var(--grey-500)]">Thank you for your business!</p>
          <p className="text-xs text-[var(--grey-500)] mt-1">
            {store.name} - {store.subdomain}.baazarify.com
          </p>
        </div>
      </div>
    </div>
  );
}
