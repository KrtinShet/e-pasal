import type { HTMLAttributes } from 'react';
import type { ImageProps as NextImageProps } from 'next/image';

export type ImageRatio = '4/3' | '3/4' | '6/4' | '4/6' | '16/9' | '9/16' | '21/9' | '9/21' | '1/1';

export interface ImageProps extends Omit<NextImageProps, 'alt'> {
  alt?: string;
  ratio?: ImageRatio;
  overlay?: string;
  disabledEffect?: boolean;
  wrapperClassName?: string;
  wrapperProps?: HTMLAttributes<HTMLSpanElement>;
}
