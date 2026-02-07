import type { ReactElement, HTMLAttributes } from 'react';

export type LabelColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type LabelVariant = 'filled' | 'outlined' | 'soft';

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  startIcon?: ReactElement | null;
  endIcon?: ReactElement | null;
  color?: LabelColor;
  variant?: LabelVariant;
}
