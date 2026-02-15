'use client';

import Link from 'next/link';
import { PageHeader } from '@baazarify/ui';
import { Package, ExternalLink } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import { apiRequest } from '@/lib/api';
import { CodSummaryWidget } from '@/components/shipments/cod-summary-widget';

interface Shipment {
  _id: string;
  orderId: { _id: string; orderNumber: string } | string;
  provider: string;
  consignmentId: string;
  trackingNumber?: string;
  trackingUrl?: string;
  status: string;
  delivery: { recipientName: string; city: string };
  cod: { amount: number; collected: boolean };
  cost?: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  picked_up: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-indigo-100 text-indigo-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  returned: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      if (providerFilter) params.set('provider', providerFilter);

      const res = await apiRequest<{
        success: boolean;
        data: Shipment[];
        pagination: Pagination;
      }>(`/integrations/logistics/shipments?${params}`);

      setShipments(res.data);
      setPagination(res.pagination);
    } catch {
      setShipments([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, providerFilter]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const statuses = [
    'pending',
    'picked_up',
    'in_transit',
    'out_for_delivery',
    'delivered',
    'returned',
    'cancelled',
  ];

  return (
    <div className="animate-rise">
      <PageHeader title="Shipments" description="Track all your shipments across providers" />

      <CodSummaryWidget />

      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-lg border border-[var(--grey-200)]/20 bg-white text-sm text-[var(--grey-900)]"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {formatStatus(s)}
            </option>
          ))}
        </select>

        <select
          value={providerFilter}
          onChange={(e) => {
            setProviderFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-lg border border-[var(--grey-200)]/20 bg-white text-sm text-[var(--grey-900)]"
        >
          <option value="">All Providers</option>
          <option value="pathao">Pathao</option>
          <option value="ncm">NCM</option>
          <option value="dash">Dash</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 skel rounded-lg" />
          ))}
        </div>
      ) : shipments.length === 0 ? (
        <div className="text-center py-16 bzr-card">
          <Package className="w-12 h-12 mx-auto text-[var(--grey-400)] mb-3" />
          <p className="text-[var(--grey-500)]">No shipments found</p>
        </div>
      ) : (
        <div className="bzr-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--grey-200)]/10">
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--grey-400)]">
                  Order
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--grey-400)]">
                  Provider
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--grey-400)]">
                  Recipient
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--grey-400)]">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--grey-400)]">
                  COD
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--grey-400)]">
                  Date
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {shipments.map((s) => {
                const orderNum = typeof s.orderId === 'object' ? s.orderId.orderNumber : s.orderId;
                const orderLink = typeof s.orderId === 'object' ? s.orderId._id : s.orderId;

                return (
                  <tr
                    key={s._id}
                    className="border-b border-[var(--grey-200)]/10 last:border-0 hover:bg-[var(--grey-100)]/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/orders/${orderLink}`}
                        className="text-sm font-medium text-[var(--primary-main)] hover:underline"
                      >
                        {orderNum}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--grey-900)] capitalize">
                      {s.provider}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[var(--grey-900)]">{s.delivery.recipientName}</p>
                      <p className="text-xs text-[var(--grey-400)]">{s.delivery.city}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {formatStatus(s.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      {s.cod.amount > 0 ? (
                        <span
                          className={s.cod.collected ? 'text-green-600' : 'text-[var(--grey-500)]'}
                        >
                          NPR {s.cod.amount.toLocaleString()}
                          {s.cod.collected && ' ✓'}
                        </span>
                      ) : (
                        <span className="text-[var(--grey-400)]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-[var(--grey-500)]">
                      {formatDate(s.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {s.cod.amount > 0 && !s.cod.collected && s.status === 'delivered' && (
                          <button
                            onClick={async () => {
                              await apiRequest(
                                `/integrations/logistics/shipments/${s._id}/cod-collected`,
                                { method: 'POST' }
                              );
                              fetchShipments();
                            }}
                            className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                          >
                            Mark COD
                          </button>
                        )}
                        {s.trackingUrl && (
                          <a
                            href={s.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--grey-400)] hover:text-[var(--primary-main)]"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--grey-200)]/10">
              <p className="text-sm text-[var(--grey-500)]">{pagination.total} shipments</p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-sm rounded border border-[var(--grey-200)]/20 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1 text-sm text-[var(--grey-500)]">
                  {page} / {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages}
                  className="px-3 py-1 text-sm rounded border border-[var(--grey-200)]/20 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
