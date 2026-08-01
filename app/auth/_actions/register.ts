"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { RegisterState } from "@/lib/types"

export const registerAction = async (prevState: RegisterState, formData: FormData) => {
  const name = formData.get("name") as string
  const email = (formData.get("email") as string).toLowerCase()
  const password = formData.get("password") as string
  const role = formData.get("role") as "CUSTOMER" | "PROVIDER"

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  })

  const result = await res.json()

  if (!result.success) {
    return result
  }

  const loginRes = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const loginResult = await loginRes.json()

  if (loginResult.success) {
    const cookieStore = await cookies()

    cookieStore.set("accessToken", loginResult.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    })
    cookieStore.set("refreshToken", loginResult.data.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    })

    const { revalidateTag } = await import("next/cache")
    revalidateTag("my-profile", "max")
    revalidateTag("my-rentals", "max")
    revalidateTag("my-payments", "max")
    revalidateTag("my-gear", "max")
    revalidateTag("provider-orders", "max")
    revalidateTag("admin-users", "max")
    revalidateTag("admin-gear", "max")
    revalidateTag("admin-rentals", "max")

    redirect("/dashboard")
  }

  return loginResult
}
