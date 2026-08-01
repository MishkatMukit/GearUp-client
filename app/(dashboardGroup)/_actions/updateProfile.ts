"use server"

import { cookies } from "next/headers"
import { revalidateTag } from "next/cache"
import { updateProfileSchema } from "@/lib/schemas"
import type { ProfileState } from "@/lib/types"

export const updateProfileAction = async (
  prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> => {
  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") ?? undefined,
    profilePhoto: formData.get("profilePhoto") ?? undefined,
    bio: formData.get("bio") ?? undefined,
    address: formData.get("address") ?? undefined,
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid profile details" }
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  if (!accessToken) {
    return { success: false, message: "Please log in to update your profile" }
  }

  const payload: Record<string, string> = {}
  payload.name = parsed.data.name.trim()
  if (parsed.data.phone?.trim()) payload.phone = parsed.data.phone.trim()
  if (parsed.data.profilePhoto?.trim()) payload.profilePhoto = parsed.data.profilePhoto.trim()
  payload.bio = parsed.data.bio?.trim() ?? ""
  payload.address = parsed.data.address?.trim() ?? ""

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    const result = await res.json()

    if (res.ok && result.success) {
      revalidateTag("my-profile", { expire: 0 })
      return { success: true, message: "Profile updated successfully", user: result.data }
    }

    return { success: false, message: result.message ?? "Failed to update profile" }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
