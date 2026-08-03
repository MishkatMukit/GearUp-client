import { cookies } from "next/headers"
import type { ApiPayment, ApiRentalOrder } from "@/lib/types"

const BACKEND_URL = process.env.BACKEND_API_URL ?? ""

export const getRentalOrderById = async (id: string): Promise<ApiRentalOrder | null> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return null

    const res = await fetch(`${BACKEND_URL}/api/rentals/${id}`, {
      cache: "no-store",
      headers: { Cookie: `accessToken=${accessToken}` },
    })
    if (!res.ok) return null

    const body = await res.json()
    return body.data ?? null
  } catch {
    return null
  }
}

export const getMyRentals = async (): Promise<ApiRentalOrder[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    const res = await fetch(`${BACKEND_URL}/api/rentals`, {
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

export const getMyPayments = async (): Promise<ApiPayment[]> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value
    if (!accessToken) return []

    const res = await fetch(`${BACKEND_URL}/api/payments`, {
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