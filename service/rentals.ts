import { cookies } from "next/headers"
import { unstable_cache } from "next/cache"
import type { ApiPayment, ApiRentalOrder } from "@/lib/types"

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

const fetchMyRentals = unstable_cache(
  async (accessToken: string) => {
    const res = await fetch(`${BACKEND_URL}/api/rentals`, {
      headers: { Cookie: `accessToken=${accessToken}` },
    })
    if (!res.ok) return []

    const body = await res.json()
    const raw = body.data ?? body
    return Array.isArray(raw) ? raw : []
  },
  ["my-rentals-cache"],
  {
    tags: ["my-rentals"],
    revalidate: 60,
  }
)

const fetchMyPayments = unstable_cache(
  async (accessToken: string) => {
    const res = await fetch(`${BACKEND_URL}/api/payments`, {
      headers: { Cookie: `accessToken=${accessToken}` },
    })
    if (!res.ok) return []

    const body = await res.json()
    const raw = body.data ?? body
    return Array.isArray(raw) ? raw : []
  },
  ["my-payments-cache"],
  {
    tags: ["my-payments"],
    revalidate: 60,
  }
)

export const getMyRentals = async (): Promise<ApiRentalOrder[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    return await fetchMyRentals(accessToken)
  } catch {
    return []
  }
}

export const getMyPayments = async (): Promise<ApiPayment[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    return await fetchMyPayments(accessToken)
  } catch {
    return []
  }
}
