'use client';

import NextImage from 'next/image';
import { useState, forwardRef } from 'react';

import { cn } from '../../utils';

import type { ImageProps, ImageRatio } from './types';

const ratioMap: Record<ImageRatio, string> = {
  '4/3': 'pt-[75%]',
  '3/4': 'pt-[133.33%]',
  '6/4': 'pt-[66.67%]',
  '4/6': 'pt-[150%]',
  '16/9': 'pt-[56.25%]',
  '9/16': 'pt-[177.78%]',
  '21/9': 'pt-[42.86%]',
  '9/21': 'pt-[233.33%]',
  '1/1': 'pt-[100%]',
};

export const Image = forwardRef<HTMLSpanElement, ImageProps>(
  (
    {
      alt = '',
      ratio,
      overlay,
      disabledEffect = false,
      wrapperClassName,
      wrapperProps,
      className,
      src,
      ...other
    },
    ref
  ) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
      <span
        ref={ref}
        className={cn(
          'relative inline-block overflow-hidden align-bottom',
          ratio && 'w-full',
          wrapperClassName
        )}
        {...wrapperProps}
      >
        {ratio && <span className={cn('block', ratioMap[ratio as ImageRatio])} />}

        <NextImage
          alt={alt}
          src={src ?? ''}
          className={cn(
            'w-full h-full object-cover align-bottom',
            ratio && 'absolute top-0 left-0',
            !disabledEffect && !isLoaded && 'blur-sm',
            !disabledEffect && isLoaded && 'blur-0 transition-[filter] duration-300',
            className
          )}
          fill={!!ratio}
          onLoad={() => setIsLoaded(true)}
          {...other}
        />

        {overlay && <span className="absolute inset-0 z-[1]" style={{ background: overlay }} />}
      </span>
    );
  }
);

Image.displayName = 'Image';
