import Link from "next/link"
import { GearCard } from "@/app/(publicGroup)/_components/GearCard"
import { GearPagination } from "@/app/(publicGroup)/gear/_components/GearPagination"
import { GearSort } from "@/app/(publicGroup)/gear/_components/GearSort"
import { getGearList, type GearQuery } from "@/service/gear"

export async function GearGrid({ query }: { query: GearQuery }) {
  const { items, meta } = await getGearList(query)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{items.length}</span> of{" "}
          <span className="font-medium text-foreground">{meta.total}</span> gear items
        </p>
        <GearSort sortBy={query.sortBy ?? "createdAt"} sortOrder={query.sortOrder ?? "desc"} />
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border bg-card py-16 text-center shadow-sm">
          <h2 className="text-lg font-semibold">No gear found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
          <Link
            href="/gear"
            className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <GearCard
              key={item.id}
              id={item.id}
              name={item.name}
              category={item.category.name}
              brand={item.brand ?? ""}
              pricePerDay={item.pricePerDay}
              image={item.images[0] ?? ""}
              availability={item.isAvailable}
            />
          ))}
        </div>
      )}

      <GearPagination total={meta.total} page={meta.page} limit={meta.limit} query={query} />
    </div>
  )
}
