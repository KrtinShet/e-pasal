'use client';

import { ThemeProvider } from '@baazarify/ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
