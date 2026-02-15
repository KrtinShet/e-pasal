'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

interface RecentOrder {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  shipping: { name: string };
  createdAt: string;
}

const statusStyles: Record<string, { dot: string; text: string }> = {
  pending: { dot: 'bg-amber-400', text: 'text-amber-700' },
  confirmed: { dot: 'bg-blue-400', text: 'text-blue-700' },
  processing: { dot: 'bg-indigo-400', text: 'text-indigo-700' },
  ready_for_pickup: { dot: 'bg-violet-400', text: 'text-violet-700' },
  shipped: { dot: 'bg-sky-400', text: 'text-sky-700' },
  delivered: { dot: 'bg-emerald-400', text: 'text-emerald-700' },
  cancelled: { dot: 'bg-red-400', text: 'text-red-600' },
  refunded: { dot: 'bg-gray-400', text: 'text-gray-500' },
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RecentOrdersTable({ orders }: { orders: RecentOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--grey-50)]">
          <ShoppingBag size={22} className="text-[var(--grey-300)]" />
        </div>
        <p className="text-sm font-medium text-[var(--grey-400)]">No orders yet</p>
        <p className="text-xs text-[var(--grey-300)]">
          Orders will appear here once customers start buying
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="data-table w-full">
        <thead>
          <tr>
            <th className="text-left">Order</th>
            <th className="text-left">Customer</th>
            <th className="text-left">Status</th>
            <th className="text-right">Total</th>
            <th className="text-right">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const style = statusStyles[order.status] || statusStyles.pending;
            return (
              <tr key={order._id}>
                <td>
                  <Link
                    href={`/orders/${order._id}`}
                    className="text-[0.875rem] font-bold text-[var(--grey-900)] hover:text-[var(--primary-main)] transition-colors link-underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="text-[var(--grey-600)] font-medium">
                  {order.shipping?.name || 'N/A'}
                </td>
                <td>
                  <span
                    className={`inline-flex items-center gap-1.5 text-[0.75rem] font-semibold ${style.text}`}
                  >
                    <span className={`status-dot ${style.dot}`} />
                    {formatStatus(order.status)}
                  </span>
                </td>
                <td className="text-right font-bold text-[var(--grey-900)] tabular-nums">
                  {formatPrice(order.total)}
                </td>
                <td className="text-right text-[0.75rem] text-[var(--grey-400)] tabular-nums">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
