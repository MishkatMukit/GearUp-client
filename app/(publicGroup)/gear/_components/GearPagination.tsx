import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { GearQuery } from "@/service/gear"

type GearPaginationProps = {
  total: number
  page: number
  limit: number
  query: GearQuery
}

export function GearPagination({ total, page, limit, query }: GearPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit))

  if (totalPages <= 1) return null

  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams()

    if (query.searchTerm) params.set("searchTerm", query.searchTerm)
    if (query.category) params.set("category", query.category)
    if (query.brand) params.set("brand", query.brand)
    if (query.minPrice) params.set("minPrice", query.minPrice)
    if (query.maxPrice) params.set("maxPrice", query.maxPrice)
    if (query.limit && query.limit !== "8") params.set("limit", query.limit)
    if (query.sortBy && query.sortBy !== "createdAt") params.set("sortBy", query.sortBy)
    if (query.sortOrder && query.sortOrder !== "desc") params.set("sortOrder", query.sortOrder)
    if (targetPage > 1) params.set("page", String(targetPage))

    const qs = params.toString()
    return qs ? `/gear?${qs}` : "/gear"
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="mt-10 flex items-center justify-center gap-1" aria-label="Pagination">
      <Link
        href={buildPageUrl(page - 1)}
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
          href={buildPageUrl(p)}
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
        href={buildPageUrl(page + 1)}
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
