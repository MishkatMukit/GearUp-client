"use server"

import { cookies } from "next/headers"
import { createRentalSchema } from "@/lib/schemas"
import type { RentalState } from "@/lib/types"

export const createRentalAction = async (
  prevState: RentalState,
  formData: FormData,
): Promise<RentalState> => {
  const parsed = createRentalSchema.safeParse({
    gearItemId: formData.get("gearItemId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    quantity: formData.get("quantity"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid rental details" }
  }

  if (parsed.data.endDate < parsed.data.startDate) {
    return { success: false, message: "End date must be after the start date" }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    return { success: false, message: "Please log in to rent this gear" }
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/rentals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(parsed.data),
    })

    const result = await res.json()

    if (res.ok && result.success) {
      const { revalidateTag } = await import("next/cache")
      revalidateTag("my-rentals", "max")
      revalidateTag("my-payments", "max")
      return { success: true, message: "Rental order placed successfully", data: result.data }
    }

    return { success: false, message: result.message ?? "Failed to place the rental order" }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
