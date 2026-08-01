import { Suspense } from "react"
import { GearSearchArea } from "@/app/(publicGroup)/gear/_components/GearSearchArea"
import { GearFilters } from "@/app/(publicGroup)/gear/_components/GearFilters"
import { GearGrid } from "@/app/(publicGroup)/gear/_components/GearGrid"
import { MobileFiltersDrawer } from "@/app/(publicGroup)/gear/_components/MobileFiltersDrawer"
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
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="h-3 w-10 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-5 space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 w-12 animate-pulse rounded bg-muted" />
        <div className="h-9 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-9 animate-pulse rounded-lg bg-muted" />
          <div className="h-9 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-3 w-12 animate-pulse rounded bg-muted" />
        <div className="h-9 animate-pulse rounded-lg bg-muted" />
        <div className="h-9 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mt-6 h-9 animate-pulse rounded-lg bg-muted" />
    </div>
  )
}

function GridSkeleton() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card shadow-sm">
            <div className="aspect-16/10 animate-pulse rounded-t-xl bg-muted" />
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
    <section className="pb-16 pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse Gear</h1>
          <p className="mt-1 text-sm text-muted-foreground">Find the right gear for your needs.</p>
        </div>

        <GearSearchArea>
          <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
            <div className="hidden lg:block">
              <Suspense fallback={<FiltersSkeleton />}>
                <GearFilters query={query} />
              </Suspense>
            </div>

            <div className="lg:hidden">
              <MobileFiltersDrawer>
                <Suspense fallback={<FiltersSkeleton />}>
                  <GearFilters query={query} />
                </Suspense>
              </MobileFiltersDrawer>
            </div>

            <Suspense fallback={<GridSkeleton />}>
              <GearGrid query={query} />
            </Suspense>
          </div>
        </GearSearchArea>
      </div>
    </section>
  )
}
