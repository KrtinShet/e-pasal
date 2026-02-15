import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="container-main py-20 text-center">
      <div className="max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--peach-light)] mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--store-primary)]"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </div>

        <h1 className="text-heading-1 font-display font-semibold text-[var(--grey-900)] mb-4">
          Product Not Found
        </h1>

        <p className="text-body-lg text-[var(--grey-600)] mb-8">
          Sorry, we could not find the product you are looking for. It may have been removed or the
          link may be incorrect.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
          <Link href="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
