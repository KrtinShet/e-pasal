import type { HTMLAttributes } from 'react';

export interface ScrollbarProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}
