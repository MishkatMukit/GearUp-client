"use client"

import { useEffect } from "react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { deleteGearAction } from "@/app/(dashboardGroup)/dashboard/provider/_actions/gear"

export function DeleteGearButton({ gearId }: { gearId: string }) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(deleteGearAction, {
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
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!window.confirm("Delete this gear item?")) e.preventDefault()
      }}
    >
      <input type="hidden" name="gearId" value={gearId} />
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "Deleting..." : "Delete"}
      </Button>
    </form>
  )
}
