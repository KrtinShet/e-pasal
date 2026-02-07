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
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-indigo-50 text-indigo-700',
  ready_for_pickup: 'bg-purple-50 text-purple-700',
  shipped: 'bg-sky-50 text-sky-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  refunded: 'bg-gray-50 text-gray-700',
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
      <div className="text-center py-8 text-[var(--slate)]">
        <p className="text-sm">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs font-medium text-[var(--slate)] uppercase tracking-wider">
            <th className="pb-3 pr-4">Order</th>
            <th className="pb-3 pr-4">Customer</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3 pr-4 text-right">Total</th>
            <th className="pb-3 text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--mist)]/20">
          {orders.map((order) => (
            <tr key={order._id} className="group">
              <td className="py-3 pr-4">
                <Link
                  href={`/orders/${order._id}`}
                  className="text-sm font-medium text-[var(--charcoal)] hover:text-[var(--coral)] transition-colors"
                >
                  {order.orderNumber}
                </Link>
              </td>
              <td className="py-3 pr-4 text-sm text-[var(--graphite)]">
                {order.shipping?.name || 'N/A'}
              </td>
              <td className="py-3 pr-4">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-gray-50 text-gray-700'}`}
                >
                  {formatStatus(order.status)}
                </span>
              </td>
              <td className="py-3 pr-4 text-sm font-medium text-[var(--charcoal)] text-right">
                {formatPrice(order.total)}
              </td>
              <td className="py-3 text-sm text-[var(--slate)] text-right">
                {formatDate(order.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
