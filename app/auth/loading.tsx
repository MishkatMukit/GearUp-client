export default function AuthLoading() {
  return (
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
  )
}
