import Link from 'next/link';

function SearchIcon() {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="container-main text-center py-16">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--cream-dark)] mb-8">
          <SearchIcon />
        </div>

        <h1 className="text-display-2 font-display mb-4">Page Not Found</h1>

        <p className="text-body-lg text-[var(--muted)] max-w-md mx-auto mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/products" className="btn-secondary">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
