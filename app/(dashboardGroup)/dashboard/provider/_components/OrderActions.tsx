"use client"

import { useEffect } from "react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { updateOrderStatusAction } from "@/app/(dashboardGroup)/dashboard/provider/_actions/orders"
import type { ApiRentalOrder, RentalStatus } from "@/lib/types"

const NEXT_ACTION: Partial<Record<RentalStatus, { label: string; status: RentalStatus }>> = {
  PLACED: { label: "Confirm", status: "CONFIRMED" },
  PAID: { label: "Mark Picked Up", status: "PICKED_UP" },
  PICKED_UP: { label: "Mark Returned", status: "RETURNED" },
}

export function OrderActions({ order }: { order: ApiRentalOrder }) {
  const router = useRouter()
  const action = NEXT_ACTION[order.status]
  const [state, formAction, pending] = useActionState(updateOrderStatusAction, {
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

  if (!action) {
    return <span className="text-xs text-muted-foreground">—</span>
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="orderId" value={order.id} />
      <input type="hidden" name="status" value={action.status} />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Updating..." : action.label}
      </Button>
    </form>
  )
}
