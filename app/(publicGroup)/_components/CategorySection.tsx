import Link from "next/link"
import { ArrowRight, Tag } from "lucide-react"
import type { ApiCategory } from "@/lib/types"

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

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
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Find the perfect gear for your activity
            </p>
          </div>
          <Link
            href="/gear"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            View all gear
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ id, name }) => (
            <Link
              key={id}
              href={`/gear?category=${name.toLowerCase().replace(/\s+/g, "-")}`}
              className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <Tag className="size-6" />
              </div>
              <span className="text-sm font-medium">{name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
