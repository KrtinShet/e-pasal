import { forwardRef, type HTMLAttributes } from 'react';

import { cn } from '../../utils';

export const HeaderShadow = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'absolute left-0 right-0 bottom-0 mx-auto h-6 -z-10 opacity-50 rounded-[50%]',
        'shadow-[0_8px_16px_0_rgba(0,0,0,0.16)]',
        className
      )}
      style={{ width: 'calc(100% - 48px)' }}
      {...props}
    />
  )
);

HeaderShadow.displayName = 'HeaderShadow';
