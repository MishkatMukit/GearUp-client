import Link from "next/link"
import { Filter, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ApiCategory } from "@/lib/types"
import type { GearQuery } from "@/service/gear"

type FilterSidebarProps = {
  categories: ApiCategory[]
  query: GearQuery
}

export function FilterSidebar({ categories, query }: FilterSidebarProps) {
  const buildUrl = (overrides: Partial<GearQuery>) => {
    const params = new URLSearchParams()
    const merged = { ...query, ...overrides }

    if (merged.searchTerm) params.set("searchTerm", merged.searchTerm)
    if (merged.category) params.set("category", merged.category)
    if (merged.brand) params.set("brand", merged.brand)
    if (merged.minPrice) params.set("minPrice", merged.minPrice)
    if (merged.maxPrice) params.set("maxPrice", merged.maxPrice)
    if (merged.page && merged.page !== "1") params.set("page", merged.page)
    if (merged.limit && merged.limit !== "8") params.set("limit", merged.limit)
    if (merged.sortBy && merged.sortBy !== "createdAt") params.set("sortBy", merged.sortBy)
    if (merged.sortOrder && merged.sortOrder !== "desc") params.set("sortOrder", merged.sortOrder)

    const qs = params.toString()
    return qs ? `/gear?${qs}` : "/gear"
  }

  const clearUrl = buildUrl({
    category: undefined,
    brand: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
    page: undefined,
  })

  const hasActiveFilters =
    query.category || query.brand || query.minPrice || query.maxPrice || query.sortBy !== "createdAt" || query.sortOrder !== "desc"

  return (
    <aside className="h-fit rounded-xl border bg-card p-5 shadow-sm lg:sticky lg:top-20">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Filter className="size-4" />
          Filters
        </h2>
        {hasActiveFilters && (
          <Link
            href={clearUrl}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3" />
            Reset
          </Link>
        )}
      </div>

      <div className="mt-5 space-y-6">
        <div>
          <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Category
          </h3>
          <div className="mt-3 space-y-1">
            <Link
              href={buildUrl({ category: undefined, page: undefined })}
              className={cn(
                "block rounded-md px-2 py-1.5 text-sm transition-colors",
                !query.category
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              All Categories
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={buildUrl({ category: category.name, page: undefined })}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm transition-colors",
                  query.category === category.name
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <form action="/gear">
          <input type="hidden" name="searchTerm" value={query.searchTerm ?? ""} />
          <input type="hidden" name="category" value={query.category ?? ""} />
          <input type="hidden" name="page" value={query.page ?? ""} />
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Brand
            </h3>
            <Input
              name="brand"
              placeholder="e.g. Canon"
              defaultValue={query.brand}
              className="mt-3 h-9"
            />
          </div>

          <div className="mt-5">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Price / day
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Input
                name="minPrice"
                type="number"
                min={0}
                placeholder="Min"
                defaultValue={query.minPrice}
                className="h-9"
              />
              <Input
                name="maxPrice"
                type="number"
                min={0}
                placeholder="Max"
                defaultValue={query.maxPrice}
                className="h-9"
              />
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Sort by
            </h3>
            <select
              name="sortBy"
              defaultValue={query.sortBy}
              className="mt-3 flex h-9 w-full items-center rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="createdAt">Newest</option>
              <option value="pricePerDay">Price</option>
              <option value="name">Name</option>
            </select>
            <select
              name="sortOrder"
              defaultValue={query.sortOrder}
              className="mt-2 flex h-9 w-full items-center rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <Button type="submit" className="mt-6 w-full" size="sm">
            Apply Filters
          </Button>
        </form>
      </div>
    </aside>
  )
}
