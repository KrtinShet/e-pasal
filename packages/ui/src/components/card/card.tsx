'use client';

import { forwardRef, useContext, createContext, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export type CardVariant = 'elevated' | 'outlined' | 'flat';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardContextValue {
  variant: CardVariant;
  padding: CardPadding;
}

const CardContext = createContext<CardContextValue>({
  variant: 'elevated',
  padding: 'md',
});

const useCard = () => useContext(CardContext);

const cardVariants = {
  elevated: 'bg-[var(--color-background)] shadow-[var(--shadow-md)] border-0',
  outlined: 'bg-[var(--color-background)] border border-[var(--color-border)] shadow-none',
  flat: 'bg-[var(--color-surface)] border-0 shadow-none',
} as const;

const cardPaddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
} as const;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'elevated', padding = 'md', children, ...props }, ref) => (
    <CardContext.Provider value={{ variant, padding }}>
      <div
        ref={ref}
        className={cn(
          'rounded-[var(--radius-lg)] overflow-hidden',
          'transition-shadow duration-[var(--transition-normal)]',
          cardVariants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  )
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  action?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, action, ...props }, ref) => {
    const { padding } = useCard();
    const paddingClass = padding === 'none' ? 'p-4' : cardPaddings[padding];

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between gap-4',
          paddingClass,
          'border-b border-[var(--color-border)]',
          className
        )}
        {...props}
      >
        <div className="flex-1 min-w-0">{children}</div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, as: Component = 'h3', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'text-lg font-semibold text-[var(--color-text-primary)] leading-tight',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
);

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-[var(--color-text-secondary)] mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
);

CardDescription.displayName = 'CardDescription';

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, children, ...props }, ref) => {
    const { padding } = useCard();
    const paddingClass = padding === 'none' ? '' : cardPaddings[padding];

    return (
      <div ref={ref} className={cn(paddingClass, className)} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    const { padding } = useCard();
    const paddingClass = padding === 'none' ? 'p-4' : cardPaddings[padding];

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3',
          paddingClass,
          'border-t border-[var(--color-border)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
