'use client';

import { useDropzone } from 'react-dropzone';

import { cn } from '../../utils';

import type { UploadProps } from './types';
import { RejectionFiles } from './errors-rejection-files';

export function UploadAvatar({
  error,
  file,
  disabled,
  helperText,
  className,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    disabled,
    accept: { 'image/*': [] },
    ...other,
  });

  const hasFile = !!file;
  const hasError = isDragReject || !!error;
  const imgUrl = typeof file === 'string' ? file : file?.preview;

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          'w-36 h-36 mx-auto p-1 cursor-pointer overflow-hidden rounded-full',
          'border border-dashed border-[var(--color-border)]',
          isDragActive && 'opacity-70',
          disabled && 'opacity-50 pointer-events-none',
          hasError && 'border-[var(--color-error)]',
          className
        )}
      >
        <input {...getInputProps()} />

        <div className="relative w-full h-full overflow-hidden rounded-full">
          {hasFile && (
            <img alt="avatar" src={imgUrl} className="w-full h-full rounded-full object-cover" />
          )}

          <div
            className={cn(
              'absolute inset-0 flex flex-col items-center justify-center gap-1',
              'rounded-full transition-opacity',
              'bg-black/5 text-[var(--color-text-muted)]',
              hasError && 'text-[var(--color-error)] bg-[var(--color-error)]/5',
              hasFile && 'opacity-0 hover:opacity-100 text-white bg-black/60'
            )}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span className="text-xs">{file ? 'Update photo' : 'Upload photo'}</span>
          </div>
        </div>
      </div>

      {helperText && helperText}

      <RejectionFiles fileRejections={[...fileRejections]} />
    </>
  );
}
