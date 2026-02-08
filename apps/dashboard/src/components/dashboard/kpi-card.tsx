import type { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  accent?: string;
}

export function KpiCard({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  accent,
}: KpiCardProps) {
  const color = accent || 'var(--primary-main)';

  return (
    <div className="bzr-card group relative overflow-hidden p-6 noise-bg">
      {/* Decorative gradient orb */}
      <div
        className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-[0.07] blur-2xl transition-all duration-700 group-hover:opacity-[0.14] group-hover:scale-125"
        style={{ background: color }}
      />
      <div
        className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full opacity-[0.04] blur-xl"
        style={{ background: color }}
      />

      {/* Icon container with warm glow on hover */}
      <div className="relative mb-5 inline-flex">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-[14px] transition-all duration-300 group-hover:shadow-lg"
          style={{
            background: `color-mix(in srgb, ${color} 12%, white)`,
            color,
            boxShadow: `0 0 0 0 color-mix(in srgb, ${color} 20%, transparent)`,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Value — bold, editorial */}
      <p
        className="text-[2rem] font-bold tracking-[-0.03em] leading-none"
        style={{ color: 'var(--grey-900)' }}
      >
        {value}
      </p>

      {/* Title + change badge row */}
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[0.8125rem] font-medium tracking-wide text-[var(--grey-500)]">{title}</p>
        {change && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.625rem] font-bold tracking-wide uppercase ${
              changeType === 'positive'
                ? 'bg-[var(--success-lighter)] text-[var(--success-dark)]'
                : changeType === 'negative'
                  ? 'bg-[var(--error-lighter)] text-[var(--error-dark)]'
                  : 'bg-[var(--grey-100)] text-[var(--grey-600)]'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
