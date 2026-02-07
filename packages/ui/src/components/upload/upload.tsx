'use client';

import { useDropzone } from 'react-dropzone';

import { cn } from '../../utils';

import type { UploadProps } from './types';
import { MultiFilePreview } from './preview-multi-file';
import { RejectionFiles } from './errors-rejection-files';
import { SingleFilePreview } from './preview-single-file';

export function Upload({
  disabled,
  multiple = false,
  error,
  helperText,
  file,
  onDelete,
  files,
  thumbnail,
  onUpload,
  onRemove,
  onRemoveAll,
  className,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const hasFile = !!file && !multiple;
  const hasFiles = !!files && multiple && !!files.length;
  const hasError = isDragReject || !!error;

  return (
    <div className={cn('w-full relative', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'p-10 outline-none rounded cursor-pointer overflow-hidden relative',
          'bg-[var(--color-surface)] border border-dashed border-[var(--color-border)]',
          'transition-all hover:opacity-70',
          isDragActive && 'opacity-70',
          disabled && 'opacity-50 pointer-events-none',
          hasError &&
            'text-[var(--color-error)] border-[var(--color-error)] bg-[var(--color-error)]/5',
          hasFile && 'py-[24%] px-0'
        )}
      >
        <input {...getInputProps()} />

        {hasFile ? (
          <SingleFilePreview imgUrl={typeof file === 'string' ? file : file?.preview} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 flex-wrap">
            <svg
              className="w-full max-w-[200px] text-[var(--color-text-muted)]"
              viewBox="0 0 480 360"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <rect
                x="120"
                y="80"
                width="240"
                height="200"
                rx="16"
                fill="currentColor"
                opacity="0.08"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
              <path
                d="M200 200l40-50 40 50"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="280" cy="160" r="20" fill="currentColor" opacity="0.15" />
            </svg>
            <div className="text-center">
              <p className="text-lg font-semibold">Drop or select file</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Drop files here or click{' '}
                <span className="text-[var(--color-primary)] underline">browse</span> through your
                machine
              </p>
            </div>
          </div>
        )}
      </div>

      {hasFile && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className={cn(
            'absolute top-4 right-4 z-10 p-1 rounded-full',
            'text-white/80 bg-black/70 hover:bg-black/50',
            'transition-colors'
          )}
          aria-label="Delete file"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      {helperText && helperText}

      <RejectionFiles fileRejections={[...fileRejections]} />

      {hasFiles && (
        <>
          <div className="my-3">
            <MultiFilePreview files={files} thumbnail={thumbnail} onRemove={onRemove} />
          </div>

          <div className="flex justify-end gap-1.5">
            {onRemoveAll && (
              <button
                type="button"
                onClick={onRemoveAll}
                className="px-3 py-1.5 text-sm border border-[var(--color-border)] rounded hover:bg-[var(--color-surface)] transition-colors"
              >
                Remove All
              </button>
            )}

            {onUpload && (
              <button
                type="button"
                onClick={onUpload}
                className="px-3 py-1.5 text-sm text-white bg-[var(--color-primary)] rounded hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-1.5"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                </svg>
                Upload
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
