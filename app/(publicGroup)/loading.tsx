import { Loader2 } from "lucide-react"

export default function PublicLoading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto size-8 animate-spin text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Loading</p>
        <p className="text-xs text-muted-foreground/70">Please wait a moment</p>
      </div>
    </div>
  )
}
