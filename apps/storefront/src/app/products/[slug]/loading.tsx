export default function ProductLoading() {
  return (
    <div className="container-main py-8 md:py-12 animate-pulse">
      <div className="h-4 bg-[var(--cream-dark)] rounded w-48 mb-6" />
      <div className="h-4 bg-[var(--cream-dark)] rounded w-32 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-[var(--cream-dark)] rounded-2xl" />

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="h-6 bg-[var(--cream-dark)] rounded-full w-16" />
              <div className="h-6 bg-[var(--cream-dark)] rounded-full w-20" />
            </div>
            <div className="h-10 bg-[var(--cream-dark)] rounded w-3/4" />
            <div className="h-4 bg-[var(--cream-dark)] rounded w-24" />
          </div>

          <div className="flex gap-3">
            <div className="h-12 bg-[var(--cream-dark)] rounded w-32" />
            <div className="h-12 bg-[var(--cream-dark)] rounded w-24" />
          </div>

          <div className="h-6 bg-[var(--cream-dark)] rounded w-28" />

          <div className="space-y-2">
            <div className="h-5 bg-[var(--cream-dark)] rounded w-full" />
            <div className="h-5 bg-[var(--cream-dark)] rounded w-5/6" />
            <div className="h-5 bg-[var(--cream-dark)] rounded w-4/6" />
          </div>

          <div className="pt-4 border-t border-[var(--mist)]/20">
            <div className="h-14 bg-[var(--cream-dark)] rounded-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
