'use client';

import { useDropzone } from 'react-dropzone';

import { cn } from '../../utils';

import type { UploadProps } from './types';

export function UploadBox({ placeholder, error, disabled, className, ...other }: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    ...other,
  });

  const hasError = isDragReject || error;

  return (
    <div
      {...getRootProps()}
      className={cn(
        'm-0.5 w-16 h-16 shrink-0 flex items-center justify-center',
        'rounded cursor-pointer',
        'bg-[var(--color-surface)] border border-dashed border-[var(--color-border)]',
        'text-[var(--color-text-muted)]',
        'hover:opacity-70 transition-opacity',
        isDragActive && 'opacity-70',
        disabled && 'opacity-50 pointer-events-none',
        hasError &&
          'text-[var(--color-error)] border-[var(--color-error)] bg-[var(--color-error)]/5',
        className
      )}
    >
      <input {...getInputProps()} />

      {placeholder || (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      )}
    </div>
  );
}
