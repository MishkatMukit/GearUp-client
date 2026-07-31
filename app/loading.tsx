import { Settings } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8">
      <div className="relative h-28 w-28">
        <Settings className="absolute top-1 left-0 size-16 animate-spin text-primary" />
        <Settings
          className="absolute right-0 bottom-0 size-20 animate-spin text-primary/30"
          style={{ animationDirection: "reverse", animationDuration: "2s" }}
        />
      </div>
      <div className="flex flex-col items-center gap-3">
        <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          GearUp
        </span>
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          Loading
          <span className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </span>
        </span>
      </div>
    </div>
  )
}
