"use server"

import { cookies } from "next/headers"
import type { PaymentInitState } from "@/lib/types"

export const createPaymentAction = async (
  prevState: PaymentInitState,
  formData: FormData,
): Promise<PaymentInitState> => {
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
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({ rentalOrderId: orderId }),
    })

    const result = await res.json()

    if (res.ok && result.success) {
      const url = result.data?.paymentUrl

      if (!url) {
        return { success: false, message: "Payment gateway URL was not returned" }
      }

      return {
        success: true,
        message: "Redirecting to payment gateway...",
        data: {
          url,
          stripeSessionId: result.data?.stripeSessionId,
        },
      }
    }

    return { success: false, message: result.message ?? "Failed to initiate payment" }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
