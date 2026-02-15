'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { X, Search, Filter, Calendar, ChevronLeft, ShoppingBag, ChevronRight } from 'lucide-react';

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

  const hasActiveFilters = !!(search || status || paymentStatus || dateFrom || dateTo);

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

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setPaymentStatus('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="space-y-8">
      {/* ── Hero header ── */}
      <div className="animate-rise relative overflow-hidden rounded-2xl warm-mesh px-8 py-8">
        <div className="grid-dots absolute inset-0 opacity-30" />
        <div className="relative">
          <div className="accent-bar">
            <h1 className="font-display text-[2rem] font-bold tracking-[-0.03em] text-[var(--grey-900)] leading-tight">
              Orders
            </h1>
          </div>
          <p className="text-[0.9375rem] text-[var(--grey-500)] -mt-1">
            {pagination
              ? `${pagination.total} total orders`
              : 'Track, manage, and fulfill every transaction.'}
          </p>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="animate-rise delay-1">
        <div className="bzr-card p-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--grey-400)]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by order number or customer..."
                  className="w-full rounded-[12px] border border-[var(--grey-200)] bg-[var(--grey-50)] py-2.5 pl-10 pr-4 text-[0.875rem] text-[var(--grey-900)] placeholder:text-[var(--grey-400)] transition-all focus:border-[var(--color-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative min-w-[160px]">
                  <Filter
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--grey-400)] pointer-events-none"
                  />
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full appearance-none rounded-[12px] border border-[var(--grey-200)] bg-[var(--grey-50)] py-2.5 pl-9 pr-8 text-[0.875rem] text-[var(--grey-700)] transition-all focus:border-[var(--color-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                  >
                    {orderStatuses.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative min-w-[160px]">
                  <Filter
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--grey-400)] pointer-events-none"
                  />
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full appearance-none rounded-[12px] border border-[var(--grey-200)] bg-[var(--grey-50)] py-2.5 pl-9 pr-8 text-[0.875rem] text-[var(--grey-700)] transition-all focus:border-[var(--color-primary)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                  >
                    {paymentStatuses.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[var(--grey-400)] flex-shrink-0" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="rounded-[10px] border border-[var(--grey-200)] bg-[var(--grey-50)] px-3 py-1.5 text-[0.75rem] text-[var(--grey-700)] transition-all focus:border-[var(--color-primary)] focus:outline-none"
                />
                <span className="text-[0.75rem] text-[var(--grey-400)] font-medium">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="rounded-[10px] border border-[var(--grey-200)] bg-[var(--grey-50)] px-3 py-1.5 text-[0.75rem] text-[var(--grey-700)] transition-all focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[0.75rem] font-semibold text-[var(--grey-500)] transition-all hover:bg-[var(--grey-100)] hover:text-[var(--grey-700)]"
                >
                  <X size={12} />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Orders table ── */}
      <div className="animate-rise delay-2">
        <div className="bzr-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-5 w-5 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--grey-50)]">
                <ShoppingBag size={22} className="text-[var(--grey-300)]" />
              </div>
              <p className="text-sm font-medium text-[var(--grey-400)]">No orders found</p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[0.75rem] font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Order</th>
                    <th className="text-left">Customer</th>
                    <th className="text-left">Status</th>
                    <th className="text-left hidden sm:table-cell">Payment</th>
                    <th className="text-left hidden md:table-cell">Method</th>
                    <th className="text-right">Total</th>
                    <th className="text-right hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <Link
                          href={`/orders/${order._id}`}
                          className="text-[0.875rem] font-bold text-[var(--grey-900)] hover:text-[var(--color-primary)] transition-colors link-underline"
                        >
                          {order.orderNumber}
                        </Link>
                        <p className="text-[0.6875rem] text-[var(--grey-400)] mt-0.5">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </td>
                      <td>
                        <p className="text-[0.875rem] font-medium text-[var(--grey-800)]">
                          {order.shipping.name}
                        </p>
                        <p className="text-[0.6875rem] text-[var(--grey-400)]">
                          {order.shipping.city}
                        </p>
                      </td>
                      <td>
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="hidden sm:table-cell">
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="hidden md:table-cell">
                        <span className="inline-flex items-center rounded-full bg-[var(--grey-100)] px-2.5 py-1 text-[0.6875rem] font-semibold text-[var(--grey-600)]">
                          {formatPaymentMethod(order.paymentMethod)}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="text-[0.875rem] font-bold text-[var(--grey-900)] tabular-nums">
                          {formatPrice(order.total)}
                        </span>
                      </td>
                      <td className="text-right hidden sm:table-cell">
                        <span className="text-[0.75rem] text-[var(--grey-400)] tabular-nums">
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
            <div className="flex items-center justify-between border-t border-[var(--grey-100)] px-7 py-4">
              <p className="text-[0.75rem] font-semibold text-[var(--grey-400)]">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[10px] border border-[var(--grey-200)] text-[var(--grey-600)] transition-all hover:bg-[var(--grey-50)] hover:border-[var(--grey-300)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page >= pagination.pages}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[10px] border border-[var(--grey-200)] text-[var(--grey-600)] transition-all hover:bg-[var(--grey-50)] hover:border-[var(--grey-300)] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
