import { cookies } from "next/headers"
import type { ApiProviderGear, ApiRentalOrder } from "@/lib/types"

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

export const getProviderGear = async (): Promise<ApiProviderGear[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    const res = await fetch(`${BACKEND_URL}/api/provider/gear`, {
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

export const getProviderOrders = async (): Promise<ApiRentalOrder[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    const res = await fetch(`${BACKEND_URL}/api/provider/orders`, {
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