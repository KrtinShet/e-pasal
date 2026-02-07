'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLinkGroup {
  headline: string;
  children: FooterLink[];
}

export interface MainFooterProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  description?: string;
  links?: FooterLinkGroup[];
  socials?: ReactNode;
  bottomText?: string;
  simple?: boolean;
  as?: React.ElementType;
}

export const MainFooter = forwardRef<HTMLElement, MainFooterProps>(
  (
    {
      className,
      logo,
      description,
      links = [],
      socials,
      bottomText = `\u00A9 ${new Date().getFullYear()}. All rights reserved`,
      simple = false,
      as: LinkComponent = 'a',
      ...props
    },
    ref
  ) => {
    if (simple) {
      return (
        <footer
          ref={ref}
          className={cn('py-10 text-center bg-[var(--color-background)]', className)}
          {...props}
        >
          <div className="mx-auto max-w-[1200px] px-4">
            {logo && <div className="mb-2 flex justify-center">{logo}</div>}
            <p className="text-xs text-[var(--color-text-secondary)]">{bottomText}</p>
          </div>
        </footer>
      );
    }

    return (
      <footer ref={ref} className={cn('bg-[var(--color-background)]', className)} {...props}>
        <div className="border-t border-[var(--color-border)]" />

        <div className="mx-auto max-w-[1200px] px-4 pt-16 pb-8">
          {logo && <div className="mb-6">{logo}</div>}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[2fr_3fr]">
            <div className="text-center md:text-left">
              {description && (
                <p className="max-w-[270px] text-sm text-[var(--color-text-secondary)] mx-auto md:mx-0">
                  {description}
                </p>
              )}
              {socials && (
                <div className="mt-4 flex justify-center md:justify-start gap-2">{socials}</div>
              )}
            </div>

            {links.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {links.map((group) => (
                  <div
                    key={group.headline}
                    className="flex flex-col items-center gap-3 md:items-start"
                  >
                    <h6 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                      {group.headline}
                    </h6>
                    {group.children.map((link) => (
                      <LinkComponent
                        key={link.name}
                        href={link.href}
                        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        {link.name}
                      </LinkComponent>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="mt-16 text-sm text-[var(--color-text-secondary)]">{bottomText}</p>
        </div>
      </footer>
    );
  }
);

MainFooter.displayName = 'MainFooter';
