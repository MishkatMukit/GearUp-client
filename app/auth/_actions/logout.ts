"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const logoutAction = async () => {
  const cookieStore = await cookies()

  cookieStore.set("accessToken", "", { maxAge: 0 })
  cookieStore.set("refreshToken", "", { maxAge: 0 })

  redirect("/auth/login")
}
