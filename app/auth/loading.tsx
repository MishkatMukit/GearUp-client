export default function AuthLoading() {
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

      <main className="flex flex-1 items-center justify-center px-4 pt-16 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 text-center">
              <div className="mx-auto h-5 w-32 animate-pulse rounded bg-muted" />
              <div className="mx-auto mt-2 h-4 w-48 animate-pulse rounded bg-muted" />
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-12 animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
              </div>
              <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
