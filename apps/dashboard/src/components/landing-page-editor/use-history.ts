import { useRef, useState, useCallback } from 'react';

const MAX_HISTORY = 50;

interface HistoryState<T> {
  current: T;
  canUndo: boolean;
  canRedo: boolean;
  set: (value: T) => void;
  undo: () => void;
  redo: () => void;
  reset: (value: T) => void;
}

export function useHistory<T>(initialValue: T): HistoryState<T> {
  const [current, setCurrent] = useState(initialValue);
  const pastRef = useRef<T[]>([]);
  const futureRef = useRef<T[]>([]);

  const set = useCallback((value: T) => {
    setCurrent((prev) => {
      pastRef.current = [...pastRef.current.slice(-(MAX_HISTORY - 1)), prev];
      futureRef.current = [];
      return value;
    });
  }, []);

  const undo = useCallback(() => {
    setCurrent((prev) => {
      if (pastRef.current.length === 0) return prev;
      const previous = pastRef.current[pastRef.current.length - 1]!;
      pastRef.current = pastRef.current.slice(0, -1);
      futureRef.current = [prev, ...futureRef.current];
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    setCurrent((prev) => {
      if (futureRef.current.length === 0) return prev;
      const next = futureRef.current[0]!;
      futureRef.current = futureRef.current.slice(1);
      pastRef.current = [...pastRef.current, prev];
      return next;
    });
  }, []);

  const reset = useCallback((value: T) => {
    pastRef.current = [];
    futureRef.current = [];
    setCurrent(value);
  }, []);

  return {
    current,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    set,
    undo,
    redo,
    reset,
  };
}
