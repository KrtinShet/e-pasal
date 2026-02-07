import type { HTMLAttributes } from 'react';

import { cn } from '../../utils';

export interface SearchNotFoundProps extends HTMLAttributes<HTMLDivElement> {
  query?: string;
}

export function SearchNotFound({ query, className, ...other }: SearchNotFoundProps) {
  return query ? (
    <div className={cn('bg-transparent text-center', className)} {...other}>
      <h6 className="mb-2 text-lg font-semibold">Not Found</h6>
      <p className="text-sm text-[var(--color-text-secondary)]">
        No results found for &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> Try checking for typos or using complete words.
      </p>
    </div>
  ) : (
    <p className={cn('text-sm text-[var(--color-text-secondary)]', className)} {...other}>
      Please enter keywords
    </p>
  );
}
