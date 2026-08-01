import { cookies } from "next/headers"
import type { ApiPayment, ApiRentalOrder } from "@/lib/types"

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

const authHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  if (!accessToken) return {}
  return { Cookie: `accessToken=${accessToken}` }
}

export const getMyRentals = async (): Promise<ApiRentalOrder[]> => {
  try {
    const headers = await authHeaders()
    if (!headers.Cookie) return []

    const res = await fetch(`${BACKEND_URL}/api/rentals`, {
      headers,
      cache: "no-store",
    })
    if (!res.ok) return []

    const body = await res.json()
    const raw = body.data ?? body
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

export const getMyPayments = async (): Promise<ApiPayment[]> => {
  try {
    const headers = await authHeaders()
    if (!headers.Cookie) return []

    const res = await fetch(`${BACKEND_URL}/api/payments`, {
      headers,
      cache: "no-store",
    })
    if (!res.ok) return []

    const body = await res.json()
    const raw = body.data ?? body
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}
