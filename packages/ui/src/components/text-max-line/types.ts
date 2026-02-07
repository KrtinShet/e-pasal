import type { ReactNode, HTMLAttributes } from 'react';

export interface TextMaxLineProps extends HTMLAttributes<HTMLElement> {
  line?: number;
  asLink?: boolean;
  persistent?: boolean;
  children: ReactNode;
  href?: string;
}
