import type { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function KpiCard({ title, value, icon, change, changeType = 'neutral' }: KpiCardProps) {
  return (
    <div className="bg-[var(--ivory)] rounded-3xl border border-[rgba(26,26,26,0.04)] p-6 transition-all hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--peach-light)] text-[var(--coral)] flex items-center justify-center">
          {icon}
        </div>
        {change && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              changeType === 'positive'
                ? 'bg-green-50 text-green-600'
                : changeType === 'negative'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-[var(--cream-dark)] text-[var(--slate)]'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[var(--charcoal)]">{value}</p>
      <p className="text-sm text-[var(--slate)] mt-1">{title}</p>
    </div>
  );
}
