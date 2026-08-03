import { cookies } from "next/headers"

export type User = {
  id: string
  name: string
  email: string
  phone?: string
  role: "CUSTOMER" | "PROVIDER" | "ADMIN"
  status?: string
  createdAt?: string
  updatedAt?: string
  profile?: {
    profilePhoto?: string
    bio?: string
    address?: string
  }
}

export const getMe = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    if (!accessToken) return null

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
      cache: "no-store",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    })

    if (!res.ok) return null

    const body = await res.json()
    return body.data ?? null
  } catch {
    return null
  }
}