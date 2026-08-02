import Link from "next/link"
import { PackageSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Not() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted">
            <PackageSearch
              className="size-9 text-muted-foreground"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold tracking-tight text-foreground">
            404
          </h1>

          <h2 className="mt-4 text-2xl font-semibold text-foreground">
            Page not 
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or may have
            been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/gear">Browse Gear</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
