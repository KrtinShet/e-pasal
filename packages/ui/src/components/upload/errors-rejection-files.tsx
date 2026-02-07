'use client';

import type { FileRejection } from 'react-dropzone';

import { fData } from '../../utils';
import { fileData } from '../file-thumbnail';

type Props = {
  fileRejections: FileRejection[];
};

export function RejectionFiles({ fileRejections }: Props) {
  if (!fileRejections.length) {
    return null;
  }

  return (
    <div className="mt-3 py-1 px-2 text-left border border-dashed border-[var(--color-error)] bg-[var(--color-error)]/5 rounded">
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = fileData(file);

        return (
          <div key={path} className="my-1">
            <p className="text-sm font-medium truncate">
              {path} - {size ? fData(size as number) : ''}
            </p>

            {errors.map((error) => (
              <span key={error.code} className="text-xs text-[var(--color-error)]">
                - {error.message}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
