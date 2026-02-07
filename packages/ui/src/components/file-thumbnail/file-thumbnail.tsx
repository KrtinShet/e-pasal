'use client';

import { cn } from '../../utils';

import { fileData, fileThumb, fileFormat } from './utils';

type FileThumbnailProps = {
  file: File | string;
  tooltip?: boolean;
  imageView?: boolean;
  onDownload?: VoidFunction;
  className?: string;
  imgClassName?: string;
};

export function FileThumbnail({
  file,
  tooltip,
  imageView,
  onDownload,
  className,
  imgClassName,
}: FileThumbnailProps) {
  const { name = '', path = '', preview = '' } = fileData(file);

  const format = fileFormat(path || preview);

  const renderContent =
    format === 'image' && imageView ? (
      <img
        alt={name}
        src={preview}
        className={cn('w-full h-full shrink-0 object-cover', imgClassName)}
      />
    ) : (
      <img alt={name} src={fileThumb(format)} className={cn('w-8 h-8 shrink-0', className)} />
    );

  if (tooltip) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center w-fit h-inherit relative"
        title={name}
      >
        {renderContent}
        {onDownload && <DownloadButton onDownload={onDownload} />}
      </span>
    );
  }

  return (
    <>
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </>
  );
}

function DownloadButton({ onDownload }: { onDownload: VoidFunction }) {
  return (
    <button
      type="button"
      onClick={onDownload}
      className={cn(
        'absolute inset-0 z-10 flex items-center justify-center',
        'opacity-0 hover:opacity-100 transition-opacity',
        'bg-black/60 text-white rounded-none'
      )}
      aria-label="Download"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </button>
  );
}
