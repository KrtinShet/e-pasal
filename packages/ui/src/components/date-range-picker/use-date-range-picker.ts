'use client';

import { useState, useCallback } from 'react';

import type { DateRangePickerProps } from './types';

function formatDate(date: Date | null): string {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function shortDateLabel(start: Date | null, end: Date | null): string {
  if (!start || !end) return '';

  const isSameYear = start.getFullYear() === end.getFullYear();
  const isSameMonth = isSameYear && start.getMonth() === end.getMonth();

  if (isSameMonth) {
    return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  }

  if (isSameYear) {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }

  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function useDateRangePicker(start: Date | null, end: Date | null): DateRangePickerProps {
  const [open, setOpen] = useState(false);
  const [endDate, setEndDate] = useState(end);
  const [startDate, setStartDate] = useState(start);

  const error =
    startDate && endDate ? new Date(startDate).getTime() > new Date(endDate).getTime() : false;

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);

  const onChangeStartDate = useCallback((newValue: Date | null) => {
    setStartDate(newValue);
  }, []);

  const onChangeEndDate = useCallback(
    (newValue: Date | null) => {
      if (error) setEndDate(null);
      setEndDate(newValue);
    },
    [error]
  );

  const onReset = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  return {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    open,
    onOpen,
    onClose,
    onReset,
    selected: !!startDate && !!endDate,
    error,
    label: `${formatDate(startDate)} - ${formatDate(endDate)}`,
    shortLabel: shortDateLabel(startDate, endDate),
    setStartDate,
    setEndDate,
  };
}
