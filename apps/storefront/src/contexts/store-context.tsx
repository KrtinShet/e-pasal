'use client';

import { useContext, createContext, type ReactNode } from 'react';

import type { StoreData } from '@/types/store';

interface StoreContextValue {
  store: StoreData | null;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

interface StoreProviderProps {
  children: ReactNode;
  store: StoreData | null;
}

export function StoreProvider({ children, store }: StoreProviderProps) {
  return (
    <StoreContext.Provider value={{ store, isLoading: false }}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

export function useStoreRequired() {
  const { store, isLoading } = useStore();
  if (isLoading) {
    throw new Error('Store is still loading');
  }
  if (!store) {
    throw new Error('Store not found');
  }
  return store;
}
