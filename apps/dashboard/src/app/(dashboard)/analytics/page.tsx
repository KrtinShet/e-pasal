'use client';

import { useState, useEffect } from 'react';
import { Users, BarChart3, TrendingUp, DollarSign, ShoppingBag, ShoppingCart } from 'lucide-react';

import { apiRequest } from '@/lib/api';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
}

interface TopProduct {
  productId: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
  image?: string;
}

interface OrderBySource {
  source: string;
  count: number;
  revenue: number;
}

interface OrderByStatus {
  status: string;
  count: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
  }).format(value);
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--warning-main)',
  confirmed: 'var(--info-main)',
  processing: 'var(--secondary-main)',
  shipped: 'var(--primary-main)',
  delivered: 'var(--success-main)',
  cancelled: 'var(--error-main)',
  refunded: 'var(--grey-400)',
};

const SOURCE_COLORS: Record<string, string> = {
  website: 'var(--primary-main)',
  whatsapp: '#25D366',
  instagram: '#E1306C',
  manual: 'var(--grey-500)',
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(0);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [ordersBySource, setOrdersBySource] = useState<OrderBySource[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<OrderByStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, avgRes, productsRes, sourceRes, statusRes] = await Promise.all([
          apiRequest<{ success: boolean; data: DashboardStats }>('/analytics/dashboard'),
          apiRequest<{ success: boolean; data: number }>('/analytics/average-order-value'),
          apiRequest<{ success: boolean; data: TopProduct[] }>('/analytics/top-products'),
          apiRequest<{ success: boolean; data: OrderBySource[] }>('/analytics/orders-by-source'),
          apiRequest<{ success: boolean; data: OrderByStatus[] }>('/analytics/orders-by-status'),
        ]);
        setStats(statsRes.data);
        setAvgOrderValue(avgRes.data || 0);
        setTopProducts(productsRes.data || []);
        setOrdersBySource(sourceRes.data || []);
        setOrdersByStatus(statusRes.data || []);
      } catch {
        // Silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="skel h-10 w-56 mb-3" />
          <div className="skel h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skel h-[140px]" />
          ))}
        </div>
        <div className="skel h-[360px]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="skel h-[300px]" />
          <div className="skel h-[300px]" />
        </div>
      </div>
    );
  }

  const maxSourceRevenue = Math.max(...ordersBySource.map((s) => s.revenue), 1);

  return (
    <div className="space-y-8">
      {/* ── Hero header with warm mesh gradient ── */}
      <div className="animate-rise relative overflow-hidden rounded-2xl warm-mesh px-8 py-8">
        <div className="grid-dots absolute inset-0 opacity-30" />
        <div className="relative">
          <div className="accent-bar">
            <h1 className="font-display text-[2rem] font-bold tracking-[-0.03em] text-[var(--grey-900)] leading-tight">
              Analytics
            </h1>
          </div>
          <p className="text-[0.9375rem] text-[var(--grey-500)] -mt-1">
            Deep dive into your store performance and trends.
          </p>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="animate-rise delay-1">
          <KpiCard
            title="Total Revenue"
            value={formatCurrency(stats?.totalRevenue || 0)}
            icon={<DollarSign size={20} strokeWidth={2.5} />}
            accent="var(--success-main)"
          />
        </div>
        <div className="animate-rise delay-2">
          <KpiCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={<ShoppingCart size={20} strokeWidth={2.5} />}
            accent="var(--info-main)"
          />
        </div>
        <div className="animate-rise delay-3">
          <KpiCard
            title="Avg Order Value"
            value={formatCurrency(avgOrderValue)}
            icon={<TrendingUp size={20} strokeWidth={2.5} />}
            accent="var(--secondary-main)"
          />
        </div>
        <div className="animate-rise delay-4">
          <KpiCard
            title="Total Customers"
            value={stats?.totalCustomers || 0}
            icon={<Users size={20} strokeWidth={2.5} />}
            accent="var(--warning-main)"
          />
        </div>
      </div>

      {/* ── Revenue chart ── */}
      <div className="animate-rise delay-5">
        <RevenueChart />
      </div>

      {/* ── Two-column: Top Products + Order Sources ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Top Products ── */}
        <div className="animate-rise delay-6">
          <div className="bzr-card overflow-hidden">
            <div className="px-7 py-5 border-b border-[var(--grey-100)]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-[var(--grey-400)]" />
                <h3 className="text-[0.9375rem] font-bold text-[var(--grey-900)] tracking-tight">
                  Top Products
                </h3>
              </div>
              <p className="text-[0.75rem] text-[var(--grey-400)] mt-0.5">
                Best sellers by units sold
              </p>
            </div>
            <div className="divide-y divide-[var(--grey-50)]">
              {topProducts.length === 0 ? (
                <div className="px-7 py-10 text-center text-[0.8125rem] text-[var(--grey-400)]">
                  No product data yet
                </div>
              ) : (
                topProducts.slice(0, 8).map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between px-7 py-3.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.8125rem] font-semibold text-[var(--grey-800)] truncate">
                        {product.name}
                      </p>
                      <p className="text-[0.75rem] text-[var(--grey-400)]">
                        {product.totalQuantity} units sold
                      </p>
                    </div>
                    <span className="text-[0.8125rem] font-bold text-[var(--grey-700)] ml-4 whitespace-nowrap">
                      {formatCurrency(product.totalRevenue)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Order Sources ── */}
        <div className="animate-rise delay-7">
          <div className="bzr-card overflow-hidden">
            <div className="px-7 py-5 border-b border-[var(--grey-100)]">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-[var(--grey-400)]" />
                <h3 className="text-[0.9375rem] font-bold text-[var(--grey-900)] tracking-tight">
                  Order Sources
                </h3>
              </div>
              <p className="text-[0.75rem] text-[var(--grey-400)] mt-0.5">
                Where your orders come from
              </p>
            </div>
            <div className="px-7 py-5 space-y-4">
              {ordersBySource.length === 0 ? (
                <div className="py-6 text-center text-[0.8125rem] text-[var(--grey-400)]">
                  No source data yet
                </div>
              ) : (
                ordersBySource.map((source) => (
                  <div key={source.source || 'unknown'}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[0.8125rem] font-semibold text-[var(--grey-700)] capitalize">
                        {source.source || 'Unknown'}
                      </span>
                      <div className="flex items-center gap-3 text-[0.75rem] text-[var(--grey-500)]">
                        <span>{source.count} orders</span>
                        <span className="font-bold text-[var(--grey-700)]">
                          {formatCurrency(source.revenue)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--grey-100)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(source.revenue / maxSourceRevenue) * 100}%`,
                          backgroundColor: SOURCE_COLORS[source.source] || 'var(--grey-400)',
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Orders by Status ── */}
      <div className="animate-rise delay-8">
        <div className="bzr-card overflow-hidden">
          <div className="px-7 py-5 border-b border-[var(--grey-100)]">
            <h3 className="text-[0.9375rem] font-bold text-[var(--grey-900)] tracking-tight">
              Orders by Status
            </h3>
            <p className="text-[0.75rem] text-[var(--grey-400)] mt-0.5">
              Current distribution of order statuses
            </p>
          </div>
          <div className="px-7 py-5 flex flex-wrap gap-3">
            {ordersByStatus.length === 0 ? (
              <span className="text-[0.8125rem] text-[var(--grey-400)]">No order data yet</span>
            ) : (
              ordersByStatus.map((item) => (
                <div
                  key={item.status}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.8125rem] font-semibold"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${STATUS_COLORS[item.status] || 'var(--grey-400)'} 12%, transparent)`,
                    color: STATUS_COLORS[item.status] || 'var(--grey-600)',
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: STATUS_COLORS[item.status] || 'var(--grey-400)',
                    }}
                  />
                  <span className="capitalize">{item.status}</span>
                  <span className="font-bold">{item.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
