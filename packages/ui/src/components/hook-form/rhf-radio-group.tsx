'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { cn } from '../../utils';
import { Radio } from '../radio';

type RHFRadioGroupProps = {
  name: string;
  options: { label: string; value: string }[];
  label?: string;
  row?: boolean;
  helperText?: React.ReactNode;
  className?: string;
};

export function RHFRadioGroup({
  name,
  options,
  label,
  row,
  helperText,
  className,
}: RHFRadioGroupProps) {
  const { control } = useFormContext();

  const labelledby = label ? `${name}-${label}` : '';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <fieldset className={className}>
          {label && (
            <legend
              id={labelledby}
              className="text-sm font-medium text-[var(--color-text-primary)] mb-2"
            >
              {label}
            </legend>
          )}

          <div
            className={cn('flex gap-3', row ? 'flex-row flex-wrap' : 'flex-col')}
            role="radiogroup"
            aria-labelledby={labelledby}
          >
            {options.map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                value={option.value}
                checked={field.value === option.value}
                onChange={() => field.onChange(option.value)}
                error={!!error}
              />
            ))}
          </div>

          {(error || helperText) && (
            <p
              className={cn(
                'text-sm mt-1',
                error ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'
              )}
            >
              {error ? error.message : helperText}
            </p>
          )}
        </fieldset>
      )}
    />
  );
}
