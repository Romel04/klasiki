export function ListingSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 md:px-6">
      <div className="mb-8 h-6 w-40 animate-pulse bg-muted" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] animate-pulse bg-muted" />
            <div className="mt-3 h-4 w-3/4 animate-pulse bg-muted" />
            <div className="mt-2 h-4 w-1/3 animate-pulse bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
