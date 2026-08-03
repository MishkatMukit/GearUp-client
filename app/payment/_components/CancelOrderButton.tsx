/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"
import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cancelOrderAction } from "@/app/payment/_actions/orders"
import type { ApiRentalOrder } from "@/lib/types"

type CancelOrderButtonProps = {
  order: ApiRentalOrder
}

export function CancelOrderButton({ order }: CancelOrderButtonProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [state, formAction, pending] = useActionState(cancelOrderAction, {
    success: false,
    message: "",
  })

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
      setOpen(false)
      router.refresh()
    } else {
      toast.error(state.message)
    }
  }, [state, router])

  return (
    <Dialog open={open} onOpenChange={(v) => !pending && setOpen(v)}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Cancel Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel order?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The order will be moved to a cancelled
            status and no further actions can be taken on it.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="orderId" value={order.id} />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Back
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
