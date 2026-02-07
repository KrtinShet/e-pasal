'use client';

import type { ReactNode } from 'react';
import { ThemeProvider as UIThemeProvider } from '@baazarify/ui';

import type { StoreData } from '@/types/store';
import { CartProvider } from '@/contexts/cart-context';
import { StoreProvider } from '@/contexts/store-context';
import { ThemeProvider } from '@/components/theme-provider';

interface ProvidersProps {
  children: ReactNode;
  store: StoreData | null;
}

export function Providers({ children, store }: ProvidersProps) {
  return (
    <UIThemeProvider>
      <StoreProvider store={store}>
        <ThemeProvider theme={store?.settings?.theme}>
          <CartProvider>{children}</CartProvider>
        </ThemeProvider>
      </StoreProvider>
    </UIThemeProvider>
  );
}
