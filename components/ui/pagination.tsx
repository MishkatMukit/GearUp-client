import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type PaginationProps = {
  page: number
  totalPages: number
  buildUrl: (page: number) => string
}

export function Pagination({ page, totalPages, buildUrl }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="mt-6 flex items-center justify-center gap-1" aria-label="Pagination">
      <Link
        href={buildUrl(page - 1)}
        aria-disabled={page === 1}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-lg border text-sm transition-colors",
          page === 1
            ? "pointer-events-none border-input text-muted-foreground/50"
            : "border-input bg-card text-foreground hover:bg-muted",
        )}
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">Previous page</span>
      </Link>

      {pages.map((p) => (
        <Link
          key={p}
          href={buildUrl(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-lg border text-sm transition-colors",
            p === page
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-card text-foreground hover:bg-muted",
          )}
        >
          {p}
        </Link>
      ))}

      <Link
        href={buildUrl(page + 1)}
        aria-disabled={page === totalPages}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-lg border text-sm transition-colors",
          page === totalPages
            ? "pointer-events-none border-input text-muted-foreground/50"
            : "border-input bg-card text-foreground hover:bg-muted",
        )}
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Next page</span>
      </Link>
    </nav>
  )
}
