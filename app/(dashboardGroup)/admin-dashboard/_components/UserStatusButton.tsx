"use client"

import { useEffect } from "react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { updateUserStatusAction } from "@/app/(dashboardGroup)/admin-dashboard/_actions/users"
import type { ApiUser } from "@/lib/types"

export function UserStatusButton({ user }: { user: ApiUser }) {
  const router = useRouter()
  const suspended = user.status === "SUSPENDED"
  const [state, formAction, pending] = useActionState(updateUserStatusAction, {
    success: false,
    message: "",
  })

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
      router.refresh()
      return
    }

    toast.error(state.message)
  }, [state, router])

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={user.id} />
      <input type="hidden" name="status" value={suspended ? "ACTIVE" : "SUSPENDED"} />
      <Button
        type="submit"
        size="sm"
        variant={suspended ? "default" : "destructive"}
        disabled={pending}
      >
        {pending ? "Updating..." : suspended ? "Activate" : "Suspend"}
      </Button>
    </form>
  )
}
