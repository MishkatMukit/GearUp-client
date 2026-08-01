"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Filter, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { ApiCategory } from "@/lib/types"

type FilterSidebarProps = {
  categories: ApiCategory[]
}

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const buildUrl = (overrides: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(overrides).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    if (params.get("page") === "1") params.delete("page")
    if (params.get("limit") === "8") params.delete("limit")
    if (params.get("sortBy") === "createdAt") params.delete("sortBy")
    if (params.get("sortOrder") === "desc") params.delete("sortOrder")

    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  const activeCategory = searchParams.get("category")

  const hasActiveFilters =
    searchParams.get("category") ||
    searchParams.get("brand") ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice") ||
    (searchParams.get("sortBy") ?? "createdAt") !== "createdAt" ||
    (searchParams.get("sortOrder") ?? "desc") !== "desc"

  const clearUrl = buildUrl({
    category: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    sortBy: "createdAt",
    sortOrder: "desc",
    page: null,
  })

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const brand = (formData.get("brand") as string).trim()
    const minPrice = (formData.get("minPrice") as string).trim()
    const maxPrice = (formData.get("maxPrice") as string).trim()
    const sortBy = (formData.get("sortBy") as string) || "createdAt"
    const sortOrder = (formData.get("sortOrder") as string) || "desc"

    router.replace(buildUrl({ brand, minPrice, maxPrice, sortBy, sortOrder, page: null }))
  }

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
              href={buildUrl({ category: null, page: null })}
              className={cn(
                "block rounded-md px-2 py-1.5 text-sm transition-colors",
                !activeCategory
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              All Categories
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={buildUrl({ category: category.name, page: null })}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-sm transition-colors",
                  activeCategory === category.name
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <form onSubmit={handleApply} className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Brand
            </h3>
            <Input
              name="brand"
              placeholder="e.g. Canon"
              defaultValue={searchParams.get("brand") ?? ""}
              className="mt-3 h-9"
            />
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Price / day
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Input
                name="minPrice"
                type="number"
                min={0}
                placeholder="Min"
                defaultValue={searchParams.get("minPrice") ?? ""}
                className="h-9"
              />
              <Input
                name="maxPrice"
                type="number"
                min={0}
                placeholder="Max"
                defaultValue={searchParams.get("maxPrice") ?? ""}
                className="h-9"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Sort by
            </h3>
            <select
              name="sortBy"
              defaultValue={searchParams.get("sortBy") ?? "createdAt"}
              className="mt-3 flex h-9 w-full items-center rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="createdAt">Newest</option>
              <option value="pricePerDay">Price</option>
              <option value="name">Name</option>
            </select>
            <select
              name="sortOrder"
              defaultValue={searchParams.get("sortOrder") ?? "desc"}
              className="mt-2 flex h-9 w-full items-center rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <Button type="submit" className="w-full" size="sm">
            Apply Filters
          </Button>
        </form>
      </div>
    </aside>
  )
}
