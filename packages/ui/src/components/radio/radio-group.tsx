'use client';

import { useContext, forwardRef, createContext, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroup() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('useRadioGroup must be used within a RadioGroup');
  }
  return context;
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string | boolean;
  helperText?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      name,
      value,
      onChange,
      label,
      error,
      helperText,
      disabled,
      orientation = 'vertical',
      children,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const errorMessage = typeof error === 'string' ? error : undefined;

    return (
      <RadioGroupContext.Provider value={{ name, value, onChange, disabled }}>
        <div
          ref={ref}
          role="radiogroup"
          aria-labelledby={label ? `${name}-label` : undefined}
          {...props}
        >
          {label && (
            <label
              id={`${name}-label`}
              className="block text-sm font-medium text-[var(--color-text)] mb-2"
            >
              {label}
            </label>
          )}
          <div
            className={cn(
              'flex gap-3',
              orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
              className
            )}
          >
            {children}
          </div>
          {(errorMessage || helperText) && (
            <p
              className={cn(
                'mt-1.5 text-sm',
                hasError ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'
              )}
            >
              {errorMessage || helperText}
            </p>
          )}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps {
  value: string;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function RadioGroupItem({ value, label, disabled, className }: RadioGroupItemProps) {
  const group = useRadioGroup();
  const isDisabled = disabled || group.disabled;
  const isChecked = group.value === value;
  const inputId = `${group.name}-${value}`;

  return (
    <div className={cn('flex items-start gap-2', className)}>
      <div className="relative flex items-center">
        <input
          id={inputId}
          type="radio"
          name={group.name}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={(e) => group.onChange?.(e.target.value)}
          className={cn(
            'peer h-4 w-4 appearance-none rounded-full border-2 transition-colors',
            'border-[var(--color-border)] bg-[var(--color-background)]',
            'checked:border-[var(--color-primary)] checked:bg-[var(--color-primary)]',
            'hover:border-[var(--color-primary-hover)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        />
        <div
          className={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center',
            'opacity-0 peer-checked:opacity-100 transition-opacity'
          )}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
        </div>
      </div>
      <label
        htmlFor={inputId}
        className={cn(
          'text-sm text-[var(--color-text)] cursor-pointer select-none',
          isDisabled && 'cursor-not-allowed opacity-50'
        )}
      >
        {label}
      </label>
    </div>
  );
}
