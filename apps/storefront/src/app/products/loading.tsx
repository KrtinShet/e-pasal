export default function ProductsLoading() {
  return (
    <div className="container-main py-8 md:py-12 animate-pulse">
      <header className="mb-8">
        <div className="h-10 bg-[var(--cream-dark)] rounded w-48 mb-3" />
        <div className="h-6 bg-[var(--cream-dark)] rounded w-72" />
      </header>

      <div className="space-y-6">
        <div className="h-12 bg-[var(--cream-dark)] rounded-xl w-full" />

        <div className="flex gap-4">
          <div className="h-10 bg-[var(--cream-dark)] rounded-full w-36" />
          <div className="h-10 bg-[var(--cream-dark)] rounded-full w-40" />
        </div>

        <div className="h-6 bg-[var(--cream-dark)] rounded w-32" />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-square bg-[var(--cream-dark)]" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-[var(--cream-dark)] rounded w-3/4" />
              <div className="h-5 bg-[var(--cream-dark)] rounded w-1/2" />
              <div className="h-6 bg-[var(--cream-dark)] rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
