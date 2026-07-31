import { Suspense } from "react"
import { GearSearchArea } from "@/app/(publicGroup)/gear/_components/GearSearchArea"
import { GearFilters } from "@/app/(publicGroup)/gear/_components/GearFilters"
import { GearGrid } from "@/app/(publicGroup)/gear/_components/GearGrid"
import type { GearQuery } from "@/service/gear"

export const dynamic = "force-dynamic"

type GearPageProps = {
  searchParams: Promise<{
    searchTerm?: string
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    page?: string
    limit?: string
    sortBy?: string
    sortOrder?: string
  }>
}

function FiltersSkeleton() {
  return (
    <div className="h-fit rounded-xl border bg-card p-5 shadow-sm">
      <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  )
}

function GridSkeleton() {
  return (
    <div>
      <div className="mb-4 h-4 w-40 animate-pulse rounded bg-muted" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card shadow-sm">
            <div className="aspect-4/3 animate-pulse rounded-t-xl bg-muted" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-20 animate-pulse rounded bg-muted" />
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function GearPage({ searchParams }: GearPageProps) {
  const params = await searchParams
  const query: GearQuery = {
    searchTerm: params.searchTerm,
    category: params.category,
    brand: params.brand,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    page: params.page,
    limit: params.limit ?? "8",
    sortBy: params.sortBy ?? "createdAt",
    sortOrder: params.sortOrder ?? "desc",
  }

  return (
    <section className="py-12 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Browse Gear</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Find the perfect gear for your next adventure
          </p>
        </div>

        <GearSearchArea>
          <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
            <Suspense fallback={<FiltersSkeleton />}>
              <GearFilters query={query} />
            </Suspense>

            <Suspense fallback={<GridSkeleton />}>
              <GearGrid query={query} />
            </Suspense>
          </div>
        </GearSearchArea>
      </div>
    </section>
  )
}
