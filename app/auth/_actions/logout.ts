"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const logoutAction = async () => {
  const cookieStore = await cookies()

  cookieStore.set("accessToken", "", { maxAge: 0 })
  cookieStore.set("refreshToken", "", { maxAge: 0 })

  const { revalidateTag } = await import("next/cache")
  revalidateTag("my-profile", "max")
  revalidateTag("my-rentals", "max")
  revalidateTag("my-payments", "max")

  redirect("/auth/login")
}
