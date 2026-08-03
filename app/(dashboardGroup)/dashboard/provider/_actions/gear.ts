"use server"

import { cookies } from "next/headers"
import { revalidateTag } from "next/cache"
import { createGearSchema, updateGearSchema } from "@/lib/schemas"
import type { MutationState } from "@/lib/types"

const getAccessToken = async () => (await cookies()).get("accessToken")?.value

export const createGearAction = async (
  prevState: MutationState,
  formData: FormData,
): Promise<MutationState> => {
  const parsed = createGearSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    brand: formData.get("brand") || undefined,
    pricePerDay: formData.get("pricePerDay"),
    stock: formData.get("stock"),
    isAvailable: formData.get("isAvailable") === "true",
    images: formData.get("photo") ? [String(formData.get("photo"))] : [],
    categoryId: formData.get("categoryId"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid gear details" }
  }

  const accessToken = await getAccessToken()

  if (!accessToken) {
    return { success: false, message: "Please log in to continue" }
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/gear`, {
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
      return { success: true, message: "Gear added successfully" }
    }

    return { success: false, message: result.message ?? "Failed to add gear" }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}

export const updateGearAction = async (
  prevState: MutationState,
  formData: FormData,
): Promise<MutationState> => {
  const gearId = String(formData.get("gearId") ?? "")

  if (!gearId) {
    return { success: false, message: "Missing gear id" }
  }

  const parsed = updateGearSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    brand: formData.get("brand") || undefined,
    pricePerDay: formData.get("pricePerDay"),
    stock: formData.get("stock"),
    isAvailable: formData.get("isAvailable") === "true",
    images: formData.get("photo") ? [String(formData.get("photo"))] : [],
    categoryId: formData.get("categoryId"),
  })

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid gear details" }
  }

  const accessToken = await getAccessToken()

  if (!accessToken) {
    return { success: false, message: "Please log in to continue" }
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/gear/${gearId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
      body: JSON.stringify(parsed.data),
    })

    const result = await res.json()

    if (res.ok && result.success) {
      revalidateTag("public-gear", { expire: 0 })
      revalidateTag(`gear-${gearId}`, { expire: 0 })
      return { success: true, message: "Gear updated successfully" }
    }

    return { success: false, message: result.message ?? "Failed to update gear" }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}

export const deleteGearAction = async (
  prevState: MutationState,
  formData: FormData,
): Promise<MutationState> => {
  const gearId = String(formData.get("gearId") ?? "")

  if (!gearId) {
    return { success: false, message: "Missing gear id" }
  }

  const accessToken = await getAccessToken()

  if (!accessToken) {
    return { success: false, message: "Please log in to continue" }
  }

  try {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/provider/gear/${gearId}`, {
      method: "DELETE",
      headers: { Cookie: `accessToken=${accessToken}` },
    })

    const result = await res.json()

    if (res.ok && result.success) {
      revalidateTag("public-gear", { expire: 0 })
      return { success: true, message: "Gear deleted" }
    }

    return { success: false, message: result.message ?? "Failed to delete gear" }
  } catch {
    return { success: false, message: "Something went wrong. Please try again." }
  }
}
