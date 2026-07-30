import { cookies } from "next/headers"

export type User = {
  id: string
  name: string
  email: string
  role: "CUSTOMER" | "PROVIDER" | "ADMIN"
  profile?: {
    profilePhoto?: string
  }
}

export const getMe = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    if (!accessToken) return null

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
      next: { tags: ["my-profile"] },
    })

    if (!res.ok) return null

    const body = await res.json()
    return body.data ?? null
  } catch {
    return null
  }
}
