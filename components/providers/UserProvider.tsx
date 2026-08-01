"use client"

import { useEffect } from "react"
import { useUserStore } from "@/stores/useUserStore"
import type { User } from "@/service/auth"

type UserProviderProps = {
  user: User | null
  children: React.ReactNode
}

export function UserProvider({ user, children }: UserProviderProps) {
  const setUser = useUserStore((s) => s.setUser)

  useEffect(() => {
    setUser(user)
  }, [user, setUser])

  return <>{children}</>
}
