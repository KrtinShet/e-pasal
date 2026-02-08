'use client';

import { BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Bar, XAxis, YAxis, Tooltip, BarChart, CartesianGrid, ResponsiveContainer } from 'recharts';

import { apiRequest } from '@/lib/api';

interface RevenueData {
  period: string;
  revenue: number;
  orderCount: number;
}

type DateRange = '7d' | '30d' | '90d';

const rangeOptions: { value: DateRange; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
];

function getDateRange(range: DateRange): { startDate: string; endDate: string } {
  const end = new Date();
  const start = new Date();
  if (range === '7d') start.setDate(end.getDate() - 7);
  else if (range === '30d') start.setDate(end.getDate() - 30);
  else start.setDate(end.getDate() - 90);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

function formatPeriod(period: string): string {
  if (period.includes('W')) return period;
  const date = new Date(period);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

function formatCurrency(value: number): string {
  if (value >= 1000) return `Rs ${(value / 1000).toFixed(1)}K`;
  return `Rs ${value}`;
}

export function RevenueChart() {
  const [range, setRange] = useState<DateRange>('30d');
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoading(true);
      try {
        const { startDate, endDate } = getDateRange(range);
        const response = await apiRequest<{ success: boolean; data: RevenueData[] }>(
          `/analytics/revenue?startDate=${startDate}&endDate=${endDate}`
        );
        setData(response.data || []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, [range]);

  return (
    <div className="bzr-card overflow-hidden">
      <div className="flex items-center justify-between px-7 py-5 border-b border-[var(--grey-100)]">
        <div>
          <h3 className="text-[0.9375rem] font-bold text-[var(--grey-900)] tracking-tight">
            Revenue
          </h3>
          <p className="text-[0.75rem] text-[var(--grey-400)] mt-0.5">
            Sales performance over time
          </p>
        </div>
        <div className="flex rounded-[10px] bg-[var(--grey-50)] p-0.5 border border-[var(--grey-200)]">
          {rangeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRange(opt.value)}
              className={`rounded-lg px-4 py-1.5 text-[0.6875rem] font-bold tracking-wide transition-all duration-200 ${
                range === opt.value
                  ? 'bg-white text-[var(--grey-900)] shadow-sm border border-[var(--grey-200)]'
                  : 'text-[var(--grey-400)] hover:text-[var(--grey-600)] border border-transparent'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-7 py-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-5 w-5 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--grey-50)]">
              <BarChart3 size={24} className="text-[var(--grey-300)]" />
            </div>
            <p className="text-sm font-medium text-[var(--grey-400)]">No revenue data yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 4, right: 0, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary-main)" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="var(--primary-light)" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grey-100)" vertical={false} />
              <XAxis
                dataKey="period"
                tickFormatter={formatPeriod}
                tick={{ fontSize: 11, fill: 'var(--grey-400)', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 11, fill: 'var(--grey-400)', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                dx={-4}
              />
              <Tooltip
                formatter={(value: number | undefined) => [
                  `NPR ${(value ?? 0).toLocaleString()}`,
                  'Revenue',
                ]}
                labelFormatter={(label) => formatPeriod(String(label))}
                contentStyle={{
                  borderRadius: '14px',
                  border: '1px solid var(--grey-200)',
                  boxShadow: 'var(--shadow-dropdown)',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '10px 14px',
                  fontFamily: 'DM Sans',
                }}
                cursor={{ fill: 'rgba(253, 232, 227, 0.3)', radius: 8 }}
              />
              <Bar
                dataKey="revenue"
                fill="url(#barGradient)"
                radius={[10, 10, 2, 2]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
