'use client';

import { useMemo, useState, useEffect, useCallback, type ReactNode } from 'react';

import { deepMerge } from '../utils/deep-merge';
import { defaultTokens } from '../tokens/defaults';
import type { DeepPartial, ThemeTokens } from '../tokens/types';

import { ThemeContext } from './context';
import { generateCSSObject } from './css-generator';

export interface ThemeProviderProps {
  children: ReactNode;
  initialTokens?: DeepPartial<ThemeTokens>;
  onTokensChange?: (tokens: ThemeTokens) => void;
}

export function ThemeProvider({ children, initialTokens, onTokensChange }: ThemeProviderProps) {
  const [tokens, setTokensState] = useState<ThemeTokens>(() =>
    initialTokens ? deepMerge(defaultTokens, initialTokens) : defaultTokens
  );

  useEffect(() => {
    setTokensState(initialTokens ? deepMerge(defaultTokens, initialTokens) : defaultTokens);
  }, [initialTokens]);

  const setTokens = useCallback(
    (newTokens: DeepPartial<ThemeTokens>) => {
      setTokensState((prev) => {
        const merged = deepMerge(prev, newTokens);
        onTokensChange?.(merged);
        return merged;
      });
    },
    [onTokensChange]
  );

  const resetTokens = useCallback(() => {
    setTokensState(defaultTokens);
    onTokensChange?.(defaultTokens);
  }, [onTokensChange]);

  const cssVars = useMemo(() => generateCSSObject(tokens), [tokens]);

  const contextValue = useMemo(
    () => ({
      tokens,
      setTokens,
      resetTokens,
    }),
    [tokens, setTokens, resetTokens]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <div style={cssVars}>{children}</div>
    </ThemeContext.Provider>
  );
}
