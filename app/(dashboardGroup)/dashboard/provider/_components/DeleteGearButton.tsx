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
import { deleteGearAction } from "@/app/(dashboardGroup)/dashboard/provider/_actions/gear"

export function DeleteGearButton({ gearId }: { gearId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(deleteGearAction, {
    success: false,
    message: "",
  })

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
      queueMicrotask(() => setOpen(false))
      router.refresh()
      return
    }

    toast.error(state.message)
  }, [state, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this gear item?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The gear will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="gearId" value={gearId} />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}