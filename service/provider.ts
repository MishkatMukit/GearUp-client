import { cookies } from "next/headers"
import { unstable_cache } from "next/cache"
import type { ApiProviderGear, ApiRentalOrder } from "@/lib/types"

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

const fetchProviderGear = unstable_cache(
  async (accessToken: string) => {
    const res = await fetch(`${BACKEND_URL}/api/provider/gear`, {
      headers: { Cookie: `accessToken=${accessToken}` },
    })
    if (!res.ok) return []

    const body = await res.json()
    const raw = body.data ?? body
    return Array.isArray(raw) ? raw : []
  },
  ["my-gear-cache"],
  {
    tags: ["my-gear"],
    revalidate: 60,
  }
)

const fetchProviderOrders = unstable_cache(
  async (accessToken: string) => {
    const res = await fetch(`${BACKEND_URL}/api/provider/orders`, {
      headers: { Cookie: `accessToken=${accessToken}` },
    })
    if (!res.ok) return []

    const body = await res.json()
    const raw = body.data ?? body
    return Array.isArray(raw) ? raw : []
  },
  ["provider-orders-cache"],
  {
    tags: ["provider-orders"],
    revalidate: 60,
  }
)

export const getProviderGear = async (): Promise<ApiProviderGear[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    return await fetchProviderGear(accessToken)
  } catch {
    return []
  }
}

export const getProviderOrders = async (): Promise<ApiRentalOrder[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    return await fetchProviderOrders(accessToken)
  } catch {
    return []
  }
}
