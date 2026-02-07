'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

import { apiRequest } from '@/lib/api';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { PaymentStatusBadge } from '@/components/orders/payment-status-badge';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  items: OrderItem[];
  shipping: {
    name: string;
    phone: string;
    city: string;
  };
  source: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const orderStatuses = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'ready_for_pickup', label: 'Ready for Pickup' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

const paymentStatuses = [
  { value: '', label: 'All Payments' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

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

function formatPaymentMethod(method: string): string {
  const labels: Record<string, string> = {
    cod: 'COD',
    esewa: 'eSewa',
    khalti: 'Khalti',
    fonepay: 'FonePay',
    bank_transfer: 'Bank Transfer',
  };
  return labels[method] || method;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (paymentStatus) params.set('paymentStatus', paymentStatus);
      if (dateFrom) params.set('dateFrom', new Date(dateFrom).toISOString());
      if (dateTo) params.set('dateTo', new Date(dateTo).toISOString());

      const response = await apiRequest<{
        success: boolean;
        data: Order[];
        pagination: Pagination;
      }>(`/orders?${params.toString()}`);
      setOrders(response.data || []);
      setPagination(response.pagination);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, paymentStatus, dateFrom, dateTo]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPage(1);
  }, [search, status, paymentStatus, dateFrom, dateTo]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--charcoal)]">Orders</h1>
          <p className="text-sm text-[var(--slate)] mt-1">
            {pagination ? `${pagination.total} total orders` : 'Manage your orders'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--mist)]/20 mb-6">
        <div className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders by number or customer..."
              className="flex-1 h-10 rounded-lg border border-[var(--mist)]/30 bg-white px-3 text-sm text-[var(--charcoal)] placeholder:text-[var(--stone)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 focus:border-[var(--coral)] transition-all"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 rounded-lg border border-[var(--mist)]/30 bg-white px-3 text-sm text-[var(--charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 appearance-none cursor-pointer min-w-[160px]"
            >
              {orderStatuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="h-10 rounded-lg border border-[var(--mist)]/30 bg-white px-3 text-sm text-[var(--charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30 appearance-none cursor-pointer min-w-[160px]"
            >
              {paymentStatuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-[var(--stone)]">From:</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 rounded-lg border border-[var(--mist)]/30 bg-white px-3 text-sm text-[var(--charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-[var(--stone)]">To:</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 rounded-lg border border-[var(--mist)]/30 bg-white px-3 text-sm text-[var(--charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--coral)]/30"
              />
            </div>
            {(search || status || paymentStatus || dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatus('');
                  setPaymentStatus('');
                  setDateFrom('');
                  setDateTo('');
                }}
                className="text-xs font-medium text-[var(--coral)] hover:text-[var(--coral-dark)] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--mist)]/20 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-[var(--coral)] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-[var(--slate)]">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--mist)]/20">
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--stone)] uppercase tracking-wider">
                    Order
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--stone)] uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--stone)] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--stone)] uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--stone)] uppercase tracking-wider">
                    Method
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[var(--stone)] uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[var(--stone)] uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-[var(--mist)]/10 hover:bg-[var(--cream)]/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/orders/${order._id}`}
                        className="text-sm font-medium text-[var(--coral)] hover:text-[var(--coral-dark)] transition-colors"
                      >
                        {order.orderNumber}
                      </Link>
                      <p className="text-xs text-[var(--stone)] mt-0.5">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[var(--charcoal)]">{order.shipping.name}</p>
                      <p className="text-xs text-[var(--stone)]">{order.shipping.city}</p>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[var(--slate)]">
                        {formatPaymentMethod(order.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-[var(--charcoal)]">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[var(--slate)]">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--mist)]/20">
            <p className="text-xs text-[var(--stone)]">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs font-medium text-[var(--charcoal)] bg-[var(--cream-dark)] rounded-lg hover:bg-[var(--mist)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="px-3 py-1.5 text-xs font-medium text-[var(--charcoal)] bg-[var(--cream-dark)] rounded-lg hover:bg-[var(--mist)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
