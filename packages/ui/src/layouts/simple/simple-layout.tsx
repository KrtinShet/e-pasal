'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface SimpleLayoutProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
} as const;

export const SimpleLayout = forwardRef<HTMLDivElement, SimpleLayoutProps>(
  ({ className, children, header, footer, maxWidth = 'xl', centered = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('min-h-screen flex flex-col bg-[var(--color-background)]', className)}
      {...props}
    >
      {header}
      <main
        className={cn(
          'flex-1',
          centered && 'flex items-center justify-center',
          maxWidth !== 'full' && 'mx-auto w-full px-4 sm:px-6 lg:px-8',
          maxWidthClasses[maxWidth]
        )}
      >
        {children}
      </main>
      {footer}
    </div>
  )
);

SimpleLayout.displayName = 'SimpleLayout';

export interface SimpleHeaderProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  navigation?: ReactNode;
  actions?: ReactNode;
  sticky?: boolean;
  transparent?: boolean;
}

export const SimpleHeader = forwardRef<HTMLElement, SimpleHeaderProps>(
  (
    { className, logo, navigation, actions, sticky = false, transparent = false, ...props },
    ref
  ) => (
    <header
      ref={ref}
      className={cn(
        'w-full z-40',
        sticky && 'sticky top-0',
        transparent
          ? 'bg-transparent'
          : 'bg-[var(--color-background)] border-b border-[var(--color-border)]',
        className
      )}
      {...props}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {logo && <div className="flex-shrink-0">{logo}</div>}
          {navigation && <nav className="hidden md:flex items-center gap-1">{navigation}</nav>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </header>
  )
);

SimpleHeader.displayName = 'SimpleHeader';

export interface SimpleFooterProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  copyright?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
  socialLinks?: Array<{
    label: string;
    href: string;
    icon: ReactNode;
  }>;
  columns?: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
  as?: React.ElementType;
}

export const SimpleFooter = forwardRef<HTMLElement, SimpleFooterProps>(
  (
    {
      className,
      logo,
      copyright,
      links = [],
      socialLinks = [],
      columns = [],
      as: LinkComponent = 'a',
      ...props
    },
    ref
  ) => {
    const currentYear = new Date().getFullYear();

    return (
      <footer
        ref={ref}
        className={cn(
          'w-full bg-[var(--color-surface)] border-t border-[var(--color-border)]',
          className
        )}
        {...props}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {columns.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {columns.map((column, index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4">
                    {column.title}
                  </h3>
                  <ul className="space-y-3">
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <LinkComponent
                          href={link.href}
                          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                        >
                          {link.label}
                        </LinkComponent>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div
            className={cn(
              'flex flex-col md:flex-row items-center justify-between gap-4',
              columns.length > 0 && 'pt-8 border-t border-[var(--color-border)]'
            )}
          >
            <div className="flex flex-col md:flex-row items-center gap-4">
              {logo && <div>{logo}</div>}
              <p className="text-sm text-[var(--color-text-muted)]">
                {copyright || `${currentYear} All rights reserved.`}
              </p>
            </div>

            <div className="flex items-center gap-6">
              {links.length > 0 && (
                <nav className="flex items-center gap-4">
                  {links.map((link, index) => (
                    <LinkComponent
                      key={index}
                      href={link.href}
                      className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                    >
                      {link.label}
                    </LinkComponent>
                  ))}
                </nav>
              )}

              {socialLinks.length > 0 && (
                <div className="flex items-center gap-2">
                  {socialLinks.map((link, index) => (
                    <LinkComponent
                      key={index}
                      href={link.href}
                      className={cn(
                        'flex items-center justify-center w-9 h-9 rounded-full',
                        'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
                        'hover:bg-[var(--color-background)] transition-colors'
                      )}
                      aria-label={link.label}
                    >
                      {link.icon}
                    </LinkComponent>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    );
  }
);

SimpleFooter.displayName = 'SimpleFooter';

export interface NavLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  active?: boolean;
  as?: React.ElementType;
  href?: string;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, children, active = false, as: Component = 'a', ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        'px-3 py-2 text-sm font-medium rounded-[var(--radius-md)] transition-colors',
        active
          ? 'text-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]'
          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]',
        className
      )}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {children}
    </Component>
  )
);

NavLink.displayName = 'NavLink';

export interface HeroSectionProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  actions?: ReactNode;
  image?: ReactNode;
  imagePosition?: 'left' | 'right' | 'background';
  align?: 'left' | 'center';
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  (
    {
      className,
      title,
      description,
      actions,
      image,
      imagePosition = 'right',
      align = 'center',
      ...props
    },
    ref
  ) => {
    const isBackground = imagePosition === 'background';
    const isSplit = imagePosition === 'left' || imagePosition === 'right';

    return (
      <section
        ref={ref}
        className={cn(
          'relative py-16 lg:py-24',
          isBackground && 'min-h-[600px] flex items-center',
          className
        )}
        {...props}
      >
        {isBackground && image && (
          <div className="absolute inset-0 z-0">
            {image}
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        <div
          className={cn(
            'relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8',
            isSplit && 'flex items-center gap-12'
          )}
        >
          {isSplit && imagePosition === 'left' && image && (
            <div className="hidden lg:block lg:w-1/2">{image}</div>
          )}

          <div
            className={cn(
              isSplit ? 'lg:w-1/2' : 'max-w-3xl',
              align === 'center' && !isSplit && 'mx-auto text-center'
            )}
          >
            <h1
              className={cn(
                'text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight',
                isBackground ? 'text-white' : 'text-[var(--color-text-primary)]'
              )}
            >
              {title}
            </h1>
            {description && (
              <p
                className={cn(
                  'mt-6 text-lg lg:text-xl',
                  isBackground ? 'text-white/80' : 'text-[var(--color-text-secondary)]'
                )}
              >
                {description}
              </p>
            )}
            {actions && (
              <div
                className={cn(
                  'mt-8 flex flex-wrap gap-4',
                  align === 'center' && !isSplit && 'justify-center'
                )}
              >
                {actions}
              </div>
            )}
          </div>

          {isSplit && imagePosition === 'right' && image && (
            <div className="hidden lg:block lg:w-1/2">{image}</div>
          )}
        </div>
      </section>
    );
  }
);

HeroSection.displayName = 'HeroSection';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  centered?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, children, title, description, centered = false, ...props }, ref) => (
    <section ref={ref} className={cn('py-16 lg:py-24', className)} {...props}>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className={cn('mb-12', centered && 'text-center')}>
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-text-primary)]">
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  'mt-4 text-lg text-[var(--color-text-secondary)]',
                  centered && 'max-w-2xl mx-auto'
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
);

Section.displayName = 'Section';
