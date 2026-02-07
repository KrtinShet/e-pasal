import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface LoginButtonProps extends HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  as?: React.ElementType;
}

export const LoginButton = forwardRef<HTMLAnchorElement, LoginButtonProps>(
  ({ className, href = '/login', as: Component = 'a', ...props }, ref) => (
    <Component
      ref={ref}
      href={href}
      className={cn(
        'inline-flex items-center justify-center h-9 px-4 rounded-[var(--radius-md)]',
        'border border-[var(--color-text-primary)] text-sm font-medium',
        'text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-background)]',
        'transition-colors duration-[var(--transition-fast)]',
        className
      )}
      {...props}
    >
      Login
    </Component>
  )
);

LoginButton.displayName = 'LoginButton';
