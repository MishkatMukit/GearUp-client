"use server"

import { cookies } from "next/headers"
import { updateUserStatusSchema } from "@/lib/schemas"
import type { MutationState } from "@/lib/types"

export const updateUserStatusAction = async (
  prevState: MutationState,
  formData: FormData,
): Promise<MutationState> => {
  const userId = String(formData.get("userId") ?? "")

  if (!userId) {
    return { success: false, message: "Missing user id" }
  }

  const parsed = updateUserStatusSchema.safeParse({ status: formData.get("status") })

  if (!parsed.success) {
    return { success: false, message: "Invalid user status" }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    return { success: false, message: "Please log in to continue" }
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify({ status: parsed.data.status }),
    })

    const result = await res.json()

    if (res.ok && result.success) {
      return { success: true, message: `User ${parsed.data.status.toLowerCase()}` }
    }

    return { success: false, message: result.message ?? "Failed to update user status" }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
