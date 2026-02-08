'use client';

import { ThemeProvider, type DeepPartial, type ThemeTokens } from '@baazarify/ui';

interface ThemePreviewProps {
  tokens: DeepPartial<ThemeTokens>;
  device?: 'desktop' | 'tablet' | 'mobile';
}

const deviceClass: Record<NonNullable<ThemePreviewProps['device']>, string> = {
  desktop: 'w-full',
  tablet: 'mx-auto w-[78%]',
  mobile: 'mx-auto w-[360px] max-w-full',
};

export function ThemePreview({ tokens, device = 'desktop' }: ThemePreviewProps) {
  return (
    <ThemeProvider initialTokens={tokens}>
      <div className={`transition-all duration-300 ${deviceClass[device]}`}>
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-sm">
          <div className="flex items-center justify-between bg-[var(--color-primary)] px-4 py-3 text-white">
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80">Storefront</p>
              <h3 className="font-display text-lg font-bold">Theme Preview</h3>
            </div>
            <button className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              Shop now
            </button>
          </div>

          <div className="space-y-4 p-4">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                Hero headline
              </p>
              <h4 className="mt-1 font-display text-2xl font-bold text-[var(--color-text-primary)]">
                Your brand in motion
              </h4>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                Instantly preview colors, typography, radius, and spacing before publishing.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white">
                  Primary CTA
                </button>
                <button className="rounded-md bg-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-white">
                  Secondary CTA
                </button>
                <button className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white">
                  Accent CTA
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
                <p className="text-xs text-[var(--color-text-muted)]">Featured Product</p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">
                  Himalayan Tea Bundle
                </p>
                <p className="mt-2 text-sm text-[var(--color-primary)]">Rs. 1,500</p>
              </div>
              <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
                <p className="text-xs text-[var(--color-text-muted)]">Status palette</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-white">
                  <span className="rounded-full bg-[var(--color-success)] px-2 py-0.5">
                    Success
                  </span>
                  <span className="rounded-full bg-[var(--color-warning)] px-2 py-0.5">
                    Warning
                  </span>
                  <span className="rounded-full bg-[var(--color-error)] px-2 py-0.5">Error</span>
                  <span className="rounded-full bg-[var(--color-info)] px-2 py-0.5">Info</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <p className="text-xs text-[var(--color-text-muted)]">Typography sample</p>
              <h5 className="mt-1 font-display text-xl text-[var(--color-text-primary)]">
                Section Heading
              </h5>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Body copy adapts instantly with your selected fonts and scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
