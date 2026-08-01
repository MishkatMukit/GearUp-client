import type { ApiCategory, ApiGearDetail, ApiGearItem } from "@/lib/types"

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

export type GearQuery = {
  searchTerm?: string
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  page?: string
  limit?: string
  sortBy?: string
  sortOrder?: string
}

export type GearListResult = {
  items: ApiGearItem[]
  meta: { page: number; limit: number; total: number }
}

export const getGearList = async (query: GearQuery): Promise<GearListResult> => {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })

  let items: ApiGearItem[] = []
  let meta = { page: 1, limit: 8, total: 0 }

  try {
    const res = await fetch(`${BACKEND_URL}/api/gear?${params.toString()}`, {
      next: { revalidate: 60, tags: ["public-gear"] },
    })
    if (res.ok) {
      const body = await res.json()
      const raw = body.data ?? body
      items = Array.isArray(raw) ? raw : []
      if (body.meta) meta = body.meta
    }
  } catch {
    items = []
  }

  return { items, meta }
}

export const getGearById = async (id: string): Promise<ApiGearDetail | null> => {
  if (!id) return null

  try {
    const res = await fetch(`${BACKEND_URL}/api/gear/${id}`, {
      next: { revalidate: 60, tags: [`gear-${id}`] },
    })
    if (!res.ok) return null
    const body = await res.json()
    return body.data ?? null
  } catch {
    return null
  }
}

export const getCategories = async (): Promise<ApiCategory[]> => {
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

  return categories
}
