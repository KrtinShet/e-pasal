'use client';

import Link from 'next/link';

interface RecentOrder {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  shipping: { name: string };
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-[var(--warning-lighter)] text-[var(--warning-dark)]',
  confirmed: 'bg-[var(--info-lighter)] text-[var(--info-dark)]',
  processing: 'bg-[var(--secondary-lighter)] text-[var(--secondary-dark)]',
  ready_for_pickup: 'bg-[var(--secondary-lighter)] text-[var(--secondary-dark)]',
  shipped: 'bg-[var(--info-lighter)] text-[var(--info-dark)]',
  delivered: 'bg-[var(--success-lighter)] text-[var(--success-dark)]',
  cancelled: 'bg-[var(--error-lighter)] text-[var(--error-dark)]',
  refunded: 'bg-[var(--grey-200)] text-[var(--color-text-secondary)]',
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
      <div className="text-center py-8 text-[var(--color-text-muted)]">
        <p className="text-sm">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
            <th className="pb-3 pr-4">Order</th>
            <th className="pb-3 pr-4">Customer</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3 pr-4 text-right">Total</th>
            <th className="pb-3 text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {orders.map((order) => (
            <tr key={order._id} className="group">
              <td className="py-3 pr-4">
                <Link
                  href={`/orders/${order._id}`}
                  className="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {order.orderNumber}
                </Link>
              </td>
              <td className="py-3 pr-4 text-sm text-[var(--color-text-secondary)]">
                {order.shipping?.name || 'N/A'}
              </td>
              <td className="py-3 pr-4">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-[var(--grey-200)] text-[var(--color-text-secondary)]'}`}
                >
                  {formatStatus(order.status)}
                </span>
              </td>
              <td className="py-3 pr-4 text-sm font-medium text-[var(--color-text-primary)] text-right">
                {formatPrice(order.total)}
              </td>
              <td className="py-3 text-sm text-[var(--color-text-muted)] text-right">
                {formatDate(order.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
