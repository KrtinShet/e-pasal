'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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

function OrdersIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function CustomersIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
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
        // Silently handle - user may not be authenticated yet
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 bg-[var(--mist)]/20 rounded w-48 mb-2" />
          <div className="h-4 bg-[var(--mist)]/20 rounded w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-[var(--mist)]/20 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-80 bg-[var(--mist)]/20 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--charcoal)]">Dashboard</h1>
        <p className="text-sm text-[var(--slate)] mt-1">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={<RevenueIcon />}
        />
        <KpiCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={<OrdersIcon />}
          change={`${stats?.recentOrdersCount || 0} this week`}
          changeType="neutral"
        />
        <KpiCard title="Customers" value={stats?.totalCustomers || 0} icon={<CustomersIcon />} />
        <KpiCard
          title="Pending Orders"
          value={stats?.pendingOrdersCount || 0}
          icon={<AlertIcon />}
          change={stats?.lowStockCount ? `${stats.lowStockCount} low stock` : undefined}
          changeType={stats?.lowStockCount ? 'negative' : 'neutral'}
        />
      </div>

      <RevenueChart />

      <div className="bg-[var(--ivory)] rounded-3xl border border-[rgba(26,26,26,0.04)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--charcoal)]">Recent Orders</h3>
          <Link
            href="/orders"
            className="text-sm font-medium text-[var(--coral)] hover:text-[var(--coral-dark)] transition-colors"
          >
            View All
          </Link>
        </div>
        <RecentOrdersTable orders={recentOrders} />
      </div>
    </div>
  );
}
