'use client';

import { ThemeProvider, type DeepPartial, type ThemeTokens } from '@baazarify/ui';

interface ThemePreviewProps {
  tokens: DeepPartial<ThemeTokens>;
}

export function ThemePreview({ tokens }: ThemePreviewProps) {
  return (
    <ThemeProvider initialTokens={tokens}>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-[var(--color-background)]">
        <div className="bg-[var(--color-primary)] p-4">
          <h3 className="font-display text-lg font-bold text-white">Store Preview</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="rounded-lg bg-[var(--color-surface)] p-3">
            <h4 className="font-semibold text-[var(--color-text-primary)]">Featured Product</h4>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Preview how your store will look with these theme settings.
            </p>
          </div>

          <div className="flex gap-2">
            <button className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white">
              Primary
            </button>
            <button className="rounded-md bg-[var(--color-secondary)] px-4 py-2 text-sm font-medium text-white">
              Secondary
            </button>
            <button className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white">
              Accent
            </button>
          </div>

          <div className="rounded-lg border border-[var(--color-border)] p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-primary)]">Sample Item</span>
              <span className="text-sm font-semibold text-[var(--color-primary)]">Rs. 1,500</span>
            </div>
          </div>

          <div className="flex gap-2">
            <span className="rounded-full bg-[var(--color-success)] px-2 py-0.5 text-xs text-white">
              Success
            </span>
            <span className="rounded-full bg-[var(--color-warning)] px-2 py-0.5 text-xs text-white">
              Warning
            </span>
            <span className="rounded-full bg-[var(--color-error)] px-2 py-0.5 text-xs text-white">
              Error
            </span>
            <span className="rounded-full bg-[var(--color-info)] px-2 py-0.5 text-xs text-white">
              Info
            </span>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
