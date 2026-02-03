import { createContext } from 'react';

import type { DeepPartial, ThemeTokens } from '../tokens/types';

export interface ThemeContextValue {
  tokens: ThemeTokens;
  setTokens: (tokens: DeepPartial<ThemeTokens>) => void;
  resetTokens: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
