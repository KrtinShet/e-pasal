'use client';

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

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}

function formatPeriod(period: string): string {
  if (period.includes('W')) return period;
  const date = new Date(period);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

function formatCurrency(value: number): string {
  if (value >= 1000) return `NPR ${(value / 1000).toFixed(1)}K`;
  return `NPR ${value}`;
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
    <div className="bg-[var(--color-background)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Revenue</h3>
        <div className="flex gap-1 bg-[var(--grey-200)] rounded-[var(--radius-md)] p-1">
          {rangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setRange(option.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-[var(--radius-sm)] transition-all ${
                range === option.value
                  ? 'bg-[var(--color-background)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-sm text-[var(--color-text-muted)]">
          No revenue data for this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={264}>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grey-300)" opacity={0.5} />
            <XAxis
              dataKey="period"
              tickFormatter={formatPeriod}
              tick={{ fontSize: 12, fill: 'var(--grey-600)' }}
              axisLine={{ stroke: 'var(--grey-300)', opacity: 0.5 }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: 'var(--grey-600)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number | undefined) => [
                `NPR ${(value ?? 0).toLocaleString()}`,
                'Revenue',
              ]}
              labelFormatter={(label) => formatPeriod(String(label))}
              contentStyle={{
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)',
              }}
            />
            <Bar dataKey="revenue" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
