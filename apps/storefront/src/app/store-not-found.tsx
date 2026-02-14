'use client';

function StoreIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--mist)]"
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
    </svg>
  );
}

export function StoreNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="container-main text-center py-16">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--cream-dark)] mb-8">
          <StoreIcon />
        </div>

        <h1 className="text-display-2 font-display mb-4">Store Not Found</h1>

        <p className="text-body-lg text-[var(--muted)] max-w-md mx-auto mb-8">
          The store you are looking for does not exist or may have been removed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://baazarify.com" className="btn-primary">
            Create Your Store
          </a>
          <button type="button" onClick={() => window.history.back()} className="btn-secondary">
            Go Back
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--mist)]/20">
          <p className="text-caption text-[var(--muted)]">
            Powered by{' '}
            <a
              href="https://baazarify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--store-primary)] hover:underline"
            >
              Baazarify
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
