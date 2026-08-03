export default function PublicLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 h-16 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          <div className="hidden items-center gap-6 md:flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 w-16 animate-pulse rounded bg-muted" />
            ))}
          </div>
          <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="h-10 w-72 animate-pulse rounded bg-muted mx-auto" />
              <div className="mt-4 h-5 w-96 animate-pulse rounded bg-muted mx-auto" />
              <div className="mt-6 flex justify-center gap-4">
                <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
                <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card shadow-sm">
                  <div className="aspect-4/3 animate-pulse rounded-t-xl bg-muted" />
                  <div className="space-y-2 p-4">
                    <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="flex gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 w-16 animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
