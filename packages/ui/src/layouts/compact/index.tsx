import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface CompactLayoutProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
}

export const CompactLayout = forwardRef<HTMLDivElement, CompactLayoutProps>(
  ({ className, children, header, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>
      {header}

      <main className="mx-auto max-w-[400px] min-h-screen flex flex-col items-center justify-center text-center py-20 px-4">
        {children}
      </main>
    </div>
  )
);

CompactLayout.displayName = 'CompactLayout';
