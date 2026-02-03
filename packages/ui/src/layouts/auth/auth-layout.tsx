'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface AuthLayoutProps extends HTMLAttributes<HTMLDivElement> {
  logo?: ReactNode;
  title?: string;
  description?: string;
  illustration?: ReactNode;
  illustrationPosition?: 'left' | 'right';
  footer?: ReactNode;
}

export const AuthLayout = forwardRef<HTMLDivElement, AuthLayoutProps>(
  (
    {
      className,
      children,
      logo,
      title,
      description,
      illustration,
      illustrationPosition = 'left',
      footer,
      ...props
    },
    ref
  ) => {
    const hasIllustration = !!illustration;

    return (
      <div
        ref={ref}
        className={cn('min-h-screen flex bg-[var(--color-surface)]', className)}
        {...props}
      >
        {hasIllustration && illustrationPosition === 'left' && (
          <IllustrationPanel>{illustration}</IllustrationPanel>
        )}

        <div
          className={cn(
            'flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24',
            hasIllustration ? 'lg:w-1/2' : 'lg:max-w-md lg:mx-auto'
          )}
        >
          <div className="mx-auto w-full max-w-sm">
            {logo && <div className="mb-8">{logo}</div>}

            {(title || description) && (
              <div className="mb-8">
                {title && (
                  <h1 className="text-2xl lg:text-3xl font-bold text-[var(--color-text-primary)]">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{description}</p>
                )}
              </div>
            )}

            <div>{children}</div>

            {footer && <div className="mt-8">{footer}</div>}
          </div>
        </div>

        {hasIllustration && illustrationPosition === 'right' && (
          <IllustrationPanel>{illustration}</IllustrationPanel>
        )}
      </div>
    );
  }
);

AuthLayout.displayName = 'AuthLayout';

function IllustrationPanel({ children }: { children: ReactNode }) {
  return (
    <div className="hidden lg:flex lg:w-1/2 lg:items-center lg:justify-center bg-[var(--color-primary)] relative overflow-hidden">
      <div className="relative z-10 p-12 w-full h-full flex items-center justify-center">
        {children}
      </div>
      <div className="absolute inset-0 opacity-10">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
}

export interface AuthCardProps extends HTMLAttributes<HTMLDivElement> {
  logo?: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
}

export const AuthCard = forwardRef<HTMLDivElement, AuthCardProps>(
  ({ className, children, logo, title, description, footer, ...props }, ref) => (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-4 py-12'
      )}
    >
      <div
        ref={ref}
        className={cn(
          'w-full max-w-md p-8',
          'bg-[var(--color-background)] rounded-[var(--radius-xl)] border border-[var(--color-border)]',
          'shadow-[var(--shadow-lg)]',
          className
        )}
        {...props}
      >
        {logo && <div className="flex justify-center mb-8">{logo}</div>}

        {(title || description) && (
          <div className="text-center mb-8">
            {title && (
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{title}</h1>
            )}
            {description && (
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{description}</p>
            )}
          </div>
        )}

        <div>{children}</div>

        {footer && <div className="mt-8 text-center">{footer}</div>}
      </div>
    </div>
  )
);

AuthCard.displayName = 'AuthCard';

export interface SocialButtonProps extends HTMLAttributes<HTMLButtonElement> {
  provider: 'google' | 'facebook' | 'github' | 'apple';
  loading?: boolean;
  disabled?: boolean;
}

const providerConfig = {
  google: {
    label: 'Continue with Google',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  facebook: {
    label: 'Continue with Facebook',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  github: {
    label: 'Continue with GitHub',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  apple: {
    label: 'Continue with Apple',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ),
  },
} as const;

export const SocialButton = forwardRef<HTMLButtonElement, SocialButtonProps>(
  ({ className, provider, loading = false, disabled = false, ...props }, ref) => {
    const config = providerConfig[provider];

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || loading}
        className={cn(
          'flex items-center justify-center gap-3 w-full h-11 px-4',
          'bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-md)]',
          'text-sm font-medium text-[var(--color-text-primary)]',
          'hover:bg-[var(--color-surface)] transition-colors duration-[var(--transition-fast)]',
          'disabled:opacity-50 disabled:pointer-events-none',
          className
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          config.icon
        )}
        <span>{config.label}</span>
      </button>
    );
  }
);

SocialButton.displayName = 'SocialButton';

export interface DividerWithTextProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export const DividerWithText = forwardRef<HTMLDivElement, DividerWithTextProps>(
  ({ className, text = 'or', ...props }, ref) => (
    <div ref={ref} className={cn('relative my-6', className)} {...props}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[var(--color-border)]" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-[var(--color-background)] px-2 text-[var(--color-text-muted)]">
          {text}
        </span>
      </div>
    </div>
  )
);

DividerWithText.displayName = 'DividerWithText';
