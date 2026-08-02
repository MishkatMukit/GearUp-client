"use server"

import { cookies } from "next/headers"
import { revalidateTag } from "next/cache"
import type { MutationState } from "@/lib/types"

export const cancelOrderAction = async (
  prevState: MutationState,
  formData: FormData,
): Promise<MutationState> => {
  const orderId = String(formData.get("orderId") ?? "")

  if (!orderId) {
    return { success: false, message: "Missing order id" }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    return { success: false, message: "Please log in to continue" }
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals/${orderId}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
    })

    const result = await res.json()

    if (res.ok && result.success) {
      revalidateTag("my-rentals", { expire: 0 })
      revalidateTag("my-payments", { expire: 0 })
      return { success: true, message: "Order cancelled" }
    }

    return { success: false, message: result.message ?? "Failed to cancel order" }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
