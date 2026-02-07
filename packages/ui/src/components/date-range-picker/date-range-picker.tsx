'use client';

import { cn } from '../../utils';
import { Button } from '../button';
import { Modal, ModalBody, ModalHeader, ModalFooter } from '../modal';

import type { DateRangePickerProps } from './types';

export function DateRangePicker({
  title = 'Select date range',
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  open,
  onClose,
  error,
}: DateRangePickerProps) {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChangeStartDate(val ? new Date(val) : null);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChangeEndDate(val ? new Date(val) : null);
  };

  const toInputValue = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>{title}</ModalHeader>

      <ModalBody>
        <div className="flex flex-col gap-4 pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">
              Start date
            </label>
            <input
              type="date"
              value={toInputValue(startDate)}
              onChange={handleStartChange}
              className={cn(
                'w-full h-10 px-3 rounded-[var(--radius-md)] border bg-[var(--color-background)]',
                'text-[var(--color-text-primary)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]',
                'border-[var(--color-border)]'
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">End date</label>
            <input
              type="date"
              value={toInputValue(endDate)}
              onChange={handleEndChange}
              className={cn(
                'w-full h-10 px-3 rounded-[var(--radius-md)] border bg-[var(--color-background)]',
                'text-[var(--color-text-primary)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]',
                'border-[var(--color-border)]'
              )}
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--color-error)]">
              End date must be later than start date
            </p>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={error} onClick={onClose}>
          Apply
        </Button>
      </ModalFooter>
    </Modal>
  );
}
