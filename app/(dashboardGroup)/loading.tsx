export default function DashboardLoading() {
  return (
    <div className="min-h-screen">
      <aside className="fixed top-16 bottom-0 left-0 z-40 hidden w-64 border-r bg-card lg:block">
        <nav className="flex flex-col gap-1 p-4">
          <span className="mb-4 flex items-center gap-2 px-2">
            <span className="text-xl font-bold tracking-tight">Dashboard</span>
          </span>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-lg bg-muted" />
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-16 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-pulse rounded bg-muted lg:hidden" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl border bg-card shadow-sm" />
              ))}
            </div>
            <div className="h-64 animate-pulse rounded-xl border bg-card shadow-sm" />
          </div>
        </main>
      </div>
    </div>
  )
}
