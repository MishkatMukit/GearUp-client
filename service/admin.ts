import { cookies } from "next/headers"
import { unstable_cache } from "next/cache"
import type { ApiProviderGear, ApiRentalOrder, ApiUser } from "@/lib/types"

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

const fetchAdminUsers = unstable_cache(
  async (accessToken: string) => {
    const res = await fetch(`${BACKEND_URL}/api/admin/users`, {
      headers: { Cookie: `accessToken=${accessToken}` },
    })
    if (!res.ok) return []

    const body = await res.json()
    const raw = body.data ?? body
    return Array.isArray(raw) ? raw : []
  },
  ["admin-users-cache"],
  {
    tags: ["admin-users"],
    revalidate: 60,
  }
)

const fetchAdminGear = unstable_cache(
  async (accessToken: string) => {
    const res = await fetch(`${BACKEND_URL}/api/admin/gear`, {
      headers: { Cookie: `accessToken=${accessToken}` },
    })
    if (!res.ok) return []

    const body = await res.json()
    const raw = body.data ?? body
    return Array.isArray(raw) ? raw : []
  },
  ["admin-gear-cache"],
  {
    tags: ["admin-gear"],
    revalidate: 60,
  }
)

const fetchAdminRentals = unstable_cache(
  async (accessToken: string) => {
    const res = await fetch(`${BACKEND_URL}/api/admin/rentals`, {
      headers: { Cookie: `accessToken=${accessToken}` },
    })
    if (!res.ok) return []

    const body = await res.json()
    const raw = body.data ?? body
    return Array.isArray(raw) ? raw : []
  },
  ["admin-rentals-cache"],
  {
    tags: ["admin-rentals"],
    revalidate: 60,
  }
)

export const getAdminUsers = async (): Promise<ApiUser[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    return await fetchAdminUsers(accessToken)
  } catch {
    return []
  }
}

export const getAdminGear = async (): Promise<ApiProviderGear[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    return await fetchAdminGear(accessToken)
  } catch {
    return []
  }
}

export const getAdminRentals = async (): Promise<ApiRentalOrder[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    return await fetchAdminRentals(accessToken)
  } catch {
    return []
  }
}
