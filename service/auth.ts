import { cookies } from "next/headers"
import { unstable_cache } from "next/cache"

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

const fetchMe = unstable_cache(
  async (accessToken: string) => {
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/me`, {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    })

    if (!res.ok) return null

    const body = await res.json()
    return body.data ?? null
  },
  ["my-profile-cache"],
  {
    tags: ["my-profile"],
    revalidate: 60,
  }
)

export const getMe = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("accessToken")?.value

    if (!accessToken) return null

    return await fetchMe(accessToken)
  } catch {
    return null
  }
}
