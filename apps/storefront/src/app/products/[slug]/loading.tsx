export default function ProductLoading() {
  return (
    <div className="container-main py-8 md:py-12 animate-pulse">
      <div className="h-4 bg-[var(--grey-100)] rounded w-48 mb-6" />
      <div className="h-4 bg-[var(--grey-100)] rounded w-32 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square bg-[var(--grey-100)] rounded-2xl" />

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="h-6 bg-[var(--grey-100)] rounded-full w-16" />
              <div className="h-6 bg-[var(--grey-100)] rounded-full w-20" />
            </div>
            <div className="h-10 bg-[var(--grey-100)] rounded w-3/4" />
            <div className="h-4 bg-[var(--grey-100)] rounded w-24" />
          </div>

          <div className="flex gap-3">
            <div className="h-12 bg-[var(--grey-100)] rounded w-32" />
            <div className="h-12 bg-[var(--grey-100)] rounded w-24" />
          </div>

          <div className="h-6 bg-[var(--grey-100)] rounded w-28" />

          <div className="space-y-2">
            <div className="h-5 bg-[var(--grey-100)] rounded w-full" />
            <div className="h-5 bg-[var(--grey-100)] rounded w-5/6" />
            <div className="h-5 bg-[var(--grey-100)] rounded w-4/6" />
          </div>

          <div className="pt-4 border-t border-[var(--grey-300)]/20">
            <div className="h-14 bg-[var(--grey-100)] rounded-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
