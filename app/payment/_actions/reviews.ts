"use server"

import { cookies } from "next/headers"
import { revalidateTag } from "next/cache"
import { createReviewSchema } from "@/lib/schemas"
import type { MutationState } from "@/lib/types"

export const submitReviewAction = async (
  prevState: MutationState,
  formData: FormData,
): Promise<MutationState> => {
  const parsed = createReviewSchema.safeParse({
    gearItemId: formData.get("gearItemId"),
    rating: formData.get("rating"),
    comment: formData.get("comment") ?? undefined,
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid review" }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    return { success: false, message: "Please log in to continue" }
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(parsed.data),
    })

    const result = await res.json()

    if (res.ok && result.success) {
      revalidateTag("public-gear", { expire: 0 })
      revalidateTag(`gear-${parsed.data.gearItemId}`, { expire: 0 })
      revalidateTag("my-rentals", { expire: 0 })
      return { success: true, message: "Review submitted" }
    }

    return { success: false, message: result.message ?? "Failed to submit review" }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
