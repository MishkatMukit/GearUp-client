import { GearCard } from "./GearCard"
import type { ApiGearItem } from "@/lib/types"

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

export async function FeaturedGear() {
  let items: ApiGearItem[] = []

  try {
    const res = await fetch(`${BACKEND_URL}/api/gear?limit=8`, {
      next: { revalidate: 60, tags: ["public-gear"] },
    })
    if (res.ok) {
      const body = await res.json()
      const raw = body.data ?? body
      items = Array.isArray(raw) ? raw : []
    }
  } catch {
    items = []
  }

  if (items.length === 0) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight">Featured Gear</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No gear available right now. Check back later.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured Gear</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Top picks for your next adventure
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.slice(0, 8).map((item) => (
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
      </div>
    </section>
  )
}
