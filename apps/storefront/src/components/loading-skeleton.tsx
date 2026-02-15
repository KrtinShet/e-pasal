'use client';

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--grey-300)]/20">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--grey-300)]/30 animate-pulse" />
            <div className="hidden sm:block w-24 h-5 rounded bg-[var(--grey-300)]/30 animate-pulse" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="w-12 h-4 rounded bg-[var(--grey-300)]/30 animate-pulse" />
            <div className="w-16 h-4 rounded bg-[var(--grey-300)]/30 animate-pulse" />
            <div className="w-10 h-4 rounded bg-[var(--grey-300)]/30 animate-pulse" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[var(--grey-300)]/30 animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function FooterSkeleton() {
  return (
    <footer className="bg-[var(--grey-100)] border-t border-[var(--grey-300)]/20">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="space-y-4">
            <div className="w-32 h-6 rounded bg-[var(--grey-300)]/30 animate-pulse" />
            <div className="w-full h-12 rounded bg-[var(--grey-300)]/30 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="w-24 h-5 rounded bg-[var(--grey-300)]/30 animate-pulse" />
            <div className="space-y-2">
              <div className="w-16 h-4 rounded bg-[var(--grey-300)]/30 animate-pulse" />
              <div className="w-20 h-4 rounded bg-[var(--grey-300)]/30 animate-pulse" />
              <div className="w-12 h-4 rounded bg-[var(--grey-300)]/30 animate-pulse" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="w-24 h-5 rounded bg-[var(--grey-300)]/30 animate-pulse" />
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--grey-300)]/30 animate-pulse" />
              <div className="w-10 h-10 rounded-full bg-[var(--grey-300)]/30 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function PageSkeleton() {
  return (
    <div className="py-16 md:py-24">
      <div className="container-main">
        <div className="text-center mb-12 md:mb-16">
          <div className="w-24 h-6 rounded-full bg-[var(--grey-300)]/30 animate-pulse mx-auto mb-6" />
          <div className="w-64 h-12 rounded bg-[var(--grey-300)]/30 animate-pulse mx-auto mb-6" />
          <div className="w-96 max-w-full h-6 rounded bg-[var(--grey-300)]/30 animate-pulse mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-8">
              <div className="w-12 h-12 rounded-full bg-[var(--grey-300)]/30 animate-pulse mx-auto mb-4" />
              <div className="w-32 h-6 rounded bg-[var(--grey-300)]/30 animate-pulse mx-auto mb-2" />
              <div className="w-full h-12 rounded bg-[var(--grey-300)]/30 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square bg-[var(--grey-300)]/30 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="w-3/4 h-5 rounded bg-[var(--grey-300)]/30 animate-pulse" />
        <div className="w-1/2 h-4 rounded bg-[var(--grey-300)]/30 animate-pulse" />
        <div className="w-1/3 h-6 rounded bg-[var(--grey-300)]/30 animate-pulse" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StorefrontLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderSkeleton />
      <main className="flex-1">
        <PageSkeleton />
      </main>
      <FooterSkeleton />
    </div>
  );
}
