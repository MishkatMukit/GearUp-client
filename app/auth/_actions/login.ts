"use server"

import jwt, { type JwtPayload } from "jsonwebtoken"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { LoginState } from "@/lib/types"

export const loginAction = async (redirectTo: string, prevState: LoginState, formData: FormData) => {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const result = await res.json()

  if (result.success) {
    const cookieStore = await cookies()

    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    })
    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    })

    const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload

    if (redirectTo && typeof redirectTo === "string" && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
      redirect(redirectTo)
    }

    if (decodedToken.role === "CUSTOMER") {
      redirect("/dashboard")
    } else if (decodedToken.role === "PROVIDER") {
      redirect("/dashboard")
    } else if (decodedToken.role === "ADMIN") {
      redirect("/admin-dashboard")
    }
  }

  return result
}
