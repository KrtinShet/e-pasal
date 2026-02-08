'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Users, DollarSign, ArrowRight, ShoppingCart, AlertTriangle } from 'lucide-react';

import { apiRequest } from '@/lib/api';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { RecentOrdersTable } from '@/components/dashboard/recent-orders-table';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrdersCount: number;
  pendingOrdersCount: number;
  lowStockCount: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
  }).format(value);
}

export default function DashboardHomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          apiRequest<{ success: boolean; data: DashboardStats }>('/analytics/dashboard'),
          apiRequest<{ success: boolean; data: any[] }>('/analytics/recent-orders'),
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data || []);
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
        <div className="skel h-[300px]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Hero header with warm mesh gradient ── */}
      <div className="animate-rise relative overflow-hidden rounded-2xl warm-mesh px-8 py-8">
        <div className="grid-dots absolute inset-0 opacity-30" />
        <div className="relative">
          <div className="accent-bar">
            <h1 className="font-display text-[2rem] font-bold tracking-[-0.03em] text-[var(--grey-900)] leading-tight">
              Dashboard
            </h1>
          </div>
          <p className="text-[0.9375rem] text-[var(--grey-500)] -mt-1">
            Your store at a glance — performance, orders, revenue.
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
            change={`${stats?.recentOrdersCount || 0} this week`}
            changeType="neutral"
            accent="var(--info-main)"
          />
        </div>
        <div className="animate-rise delay-3">
          <KpiCard
            title="Customers"
            value={stats?.totalCustomers || 0}
            icon={<Users size={20} strokeWidth={2.5} />}
            accent="var(--secondary-main)"
          />
        </div>
        <div className="animate-rise delay-4">
          <KpiCard
            title="Pending Orders"
            value={stats?.pendingOrdersCount || 0}
            icon={<AlertTriangle size={20} strokeWidth={2.5} />}
            change={stats?.lowStockCount ? `${stats.lowStockCount} low stock` : undefined}
            changeType={stats?.lowStockCount ? 'negative' : 'neutral'}
            accent="var(--warning-main)"
          />
        </div>
      </div>

      {/* ── Revenue chart ── */}
      <div className="animate-rise delay-5">
        <RevenueChart />
      </div>

      {/* ── Recent Orders ── */}
      <div className="animate-rise delay-6">
        <div className="bzr-card overflow-hidden">
          <div className="flex items-center justify-between px-7 py-5 border-b border-[var(--grey-100)]">
            <div>
              <h3 className="text-[0.9375rem] font-bold text-[var(--grey-900)] tracking-tight">
                Recent Orders
              </h3>
              <p className="text-[0.75rem] text-[var(--grey-400)] mt-0.5">
                Latest transactions across your store
              </p>
            </div>
            <Link
              href="/orders"
              className="group inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-[var(--color-primary)] transition-all hover:gap-2.5"
            >
              View All
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="px-3">
            <RecentOrdersTable orders={recentOrders} />
          </div>
        </div>
      </div>
    </div>
  );
}
