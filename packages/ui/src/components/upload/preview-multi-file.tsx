'use client';

import { cn, fData } from '../../utils';
import { fileData, FileThumbnail } from '../file-thumbnail';

import type { UploadProps } from './types';

export function MultiFilePreview({ thumbnail, files, onRemove, className }: UploadProps) {
  return (
    <div className={className}>
      {files?.map((file) => {
        const { key, name = '', size = 0 } = fileData(file);

        const isNotFormatFile = typeof file === 'string';

        if (thumbnail) {
          return (
            <div
              key={key}
              className={cn(
                'inline-flex items-center justify-center m-0.5',
                'w-20 h-20 rounded-lg overflow-hidden relative',
                'border border-[var(--color-border)]'
              )}
            >
              <FileThumbnail
                tooltip
                imageView
                file={file}
                className="absolute"
                imgClassName="absolute"
              />

              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(file)}
                  className={cn(
                    'absolute top-1 right-1 p-0.5 rounded-full',
                    'text-white bg-black/50 hover:bg-black/70',
                    'transition-colors z-10'
                  )}
                  aria-label={`Remove ${name}`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        }

        return (
          <div
            key={key}
            className={cn(
              'flex items-center gap-2 my-1 py-1 px-1.5',
              'rounded border border-[var(--color-border)]'
            )}
          >
            <FileThumbnail file={file} />

            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{isNotFormatFile ? file : name}</p>
              {!isNotFormatFile && (
                <span className="text-xs text-[var(--color-text-muted)]">
                  {fData(size as number)}
                </span>
              )}
            </div>

            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(file)}
                className="p-1 rounded hover:bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                aria-label={`Remove ${name}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
