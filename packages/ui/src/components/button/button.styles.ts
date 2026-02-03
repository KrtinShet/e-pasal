import { cn } from '../../utils';

export const buttonVariants = {
  primary:
    'bg-[var(--color-primary)] text-white hover:opacity-90 focus-visible:ring-[var(--color-primary)]/50',
  secondary:
    'bg-[var(--color-secondary)] text-white hover:opacity-90 focus-visible:ring-[var(--color-secondary)]/50',
  outline:
    'border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)]/10 focus-visible:ring-[var(--color-primary)]/50',
  ghost:
    'text-[var(--color-text-primary)] bg-transparent hover:bg-[var(--color-surface)] focus-visible:ring-[var(--color-border)]',
  destructive:
    'bg-[var(--color-error)] text-white hover:opacity-90 focus-visible:ring-[var(--color-error)]/50',
} as const;

export const buttonSizes = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-base gap-2',
  lg: 'h-12 px-6 text-lg gap-2.5',
} as const;

export const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export function getButtonStyles({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
}: ButtonStyleProps = {}) {
  return cn(
    'inline-flex items-center justify-center font-medium transition-all duration-[var(--transition-normal)]',
    'rounded-[var(--radius-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    buttonVariants[variant],
    buttonSizes[size],
    fullWidth && 'w-full',
    loading && 'cursor-wait',
    disabled && 'cursor-not-allowed'
  );
}
