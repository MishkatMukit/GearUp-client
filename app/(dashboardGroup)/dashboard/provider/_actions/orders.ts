"use server"

import { cookies } from "next/headers"
import { revalidateTag } from "next/cache"
import { updateRentalStatusSchema } from "@/lib/schemas"
import type { MutationState } from "@/lib/types"

export const updateOrderStatusAction = async (
  prevState: MutationState,
  formData: FormData,
): Promise<MutationState> => {
  const orderId = String(formData.get("orderId") ?? "")

  if (!orderId) {
    return { success: false, message: "Missing order id" }
  }

  const parsed = updateRentalStatusSchema.safeParse({ status: formData.get("status") })

  if (!parsed.success) {
    return { success: false, message: "Invalid order status" }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    return { success: false, message: "Please log in to continue" }
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({ status: parsed.data.status }),
    })

    const result = await res.json()

    if (res.ok && result.success) {
      revalidateTag("provider-orders", { expire: 0 })
      revalidateTag("my-rentals", { expire: 0 })
      return { success: true, message: `Order marked as ${parsed.data.status}` }
    }

    return { success: false, message: result.message ?? "Failed to update order status" }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
