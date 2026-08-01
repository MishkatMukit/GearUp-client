export default function GearDetailLoading() {
  return (
    <section className="pb-16 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-4 w-28 animate-pulse rounded bg-muted" />

        <div className="mt-6 grid gap-10 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <div className="aspect-4/3 animate-pulse rounded-xl bg-muted" />
            <div className="mt-4 grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-4/3 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
            <div className="mt-8 space-y-4">
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-3 w-full animate-pulse rounded bg-muted" />
                ))}
              </div>
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-9 w-full animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border bg-card p-6">
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="h-10 animate-pulse rounded-lg bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    </section>
  )
}
