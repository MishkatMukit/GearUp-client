import Link from "next/link"
import { Tag } from "lucide-react"

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

type ApiCategory = {
  id: string
  name: string
  _count?: { gearItems: number }
}

export async function CategorySection() {
  let categories: ApiCategory[] = []

  try {
    const res = await fetch(`${BACKEND_URL}/api/categories`, {
      next: { revalidate: 300, tags: ["categories"] },
    })
    if (res.ok) {
      const body = await res.json()
      const raw = body.data ?? body
      categories = Array.isArray(raw) ? raw : []
    }
  } catch {
    categories = []
  }

  if (categories.length === 0) return null

  return (
    <section className="border-t bg-muted/50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Find the perfect gear for your activity
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ id, name }) => (
            <Link
              key={id}
              href={`/gear?category=${name.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
            >
              <Tag className="size-8 text-muted-foreground" />
              <span className="text-sm font-medium">{name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
