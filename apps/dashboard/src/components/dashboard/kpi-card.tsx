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
    <div className="bg-[var(--color-background)] rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 transition-shadow hover:shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--primary-lighter)] text-[var(--color-primary)] flex items-center justify-center">
          {icon}
        </div>
        {change && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              changeType === 'positive'
                ? 'bg-[var(--success-lighter)] text-[var(--success-dark)]'
                : changeType === 'negative'
                  ? 'bg-[var(--error-lighter)] text-[var(--error-dark)]'
                  : 'bg-[var(--grey-200)] text-[var(--color-text-secondary)]'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</p>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1">{title}</p>
    </div>
  );
}
