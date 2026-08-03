import { unstable_cache } from "next/cache"
import { cookies } from "next/headers"
import type { ApiProviderGear, ApiRentalOrder, ApiUser } from "@/lib/types"

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

export type AdminUserQuery = {
  searchTerm?: string
  page?: string
  limit?: string
}

export type AdminUserListResult = {
  items: ApiUser[]
  meta: { page: number; limit: number; total: number }
}

const fetchAdminUsersFromDB = async (accessToken: string, query: AdminUserQuery) => {
  const params = new URLSearchParams()
  if (query.searchTerm) params.set("searchTerm", query.searchTerm)
  if (query.page) params.set("page", query.page)
  if (query.limit) params.set("limit", query.limit)

  const qs = params.toString()
  const url = `${BACKEND_URL}/api/admin/users${qs ? `?${qs}` : ""}`

  const res = await fetch(url, {
    headers: { Cookie: `accessToken=${accessToken}` },
  })
  if (!res.ok) return { items: [] as ApiUser[], meta: { page: 1, limit: 10, total: 0 } }

  const body = await res.json()
  const raw = body.data ?? body
  const items = Array.isArray(raw) ? raw : []
  const meta = body.meta ?? { page: Number(query.page) || 1, limit: Number(query.limit) || 10, total: items.length }

  return { items, meta }
}

const fetchAdminUsersCached = unstable_cache(
  (accessToken: string, query: AdminUserQuery) => fetchAdminUsersFromDB(accessToken, query),
  ["admin-users"],
  { tags: ["admin-users"], revalidate: 60 },
)

export const getAdminUsers = async (): Promise<ApiUser[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    const result = await fetchAdminUsersCached(accessToken, {})
    return result.items
  } catch {
    return []
  }
}

export const getAdminUsersList = async (query: AdminUserQuery): Promise<AdminUserListResult> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return { items: [], meta: { page: 1, limit: 10, total: 0 } }

    return await fetchAdminUsersCached(accessToken, query)
  } catch {
    return { items: [], meta: { page: 1, limit: 10, total: 0 } }
  }
}

export const getAdminGear = async (): Promise<ApiProviderGear[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    const res = await fetch(`${BACKEND_URL}/api/admin/gear`, {
      cache: "no-store",
      headers: { Cookie: `accessToken=${accessToken}` },
    })
    if (!res.ok) return []

    const body = await res.json()
    const raw = body.data ?? body
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

export const getAdminRentals = async (): Promise<ApiRentalOrder[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    const res = await fetch(`${BACKEND_URL}/api/admin/rentals`, {
      cache: "no-store",
      headers: { Cookie: `accessToken=${accessToken}` },
    })
    if (!res.ok) return []

    const body = await res.json()
    const raw = body.data ?? body
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}