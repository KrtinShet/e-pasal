'use client';

import { useMemo, useState, useEffect } from 'react';

export function useOffSetTop(top = 0): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setValue(window.scrollY > top);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [top]);

  const memoizedValue = useMemo(() => value, [value]);

  return memoizedValue;
}
