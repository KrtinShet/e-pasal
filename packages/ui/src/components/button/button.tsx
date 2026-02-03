'use client';

import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react';

import { cn } from '../../utils';

import { iconSizes, getButtonStyles, type ButtonSize, type ButtonVariant } from './button.styles';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

function Spinner({ size }: { size: ButtonSize }) {
  return (
    <svg
      className={cn('animate-spin', iconSizes[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          getButtonStyles({ variant, size, fullWidth, loading, disabled: isDisabled }),
          className
        )}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <Spinner size={size} />
        ) : leftIcon ? (
          <span className={cn('flex-shrink-0', iconSizes[size])}>{leftIcon}</span>
        ) : null}
        {children && <span>{children}</span>}
        {rightIcon && !loading && (
          <span className={cn('flex-shrink-0', iconSizes[size])}>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
