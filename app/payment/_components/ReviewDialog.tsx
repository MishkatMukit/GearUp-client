"use client"

import { useState } from "react"
import { Pen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ReviewForm } from "@/app/payment/_components/ReviewForm"
import type { ApiRentalOrder } from "@/lib/types"

type ReviewDialogProps = {
  order: ApiRentalOrder
}

export function ReviewDialog({ order }: ReviewDialogProps) {
  const [open, setOpen] = useState(false)
  const gearName = order.gearItem?.name ?? "this gear"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-green-600 text-green-700 hover:bg-green-50 hover:text-green-700"
        >
          <Pen className="size-4" />
          Leave Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {gearName}</DialogTitle>
          <DialogDescription>Share your experience with this gear.</DialogDescription>
        </DialogHeader>
        <ReviewForm order={order} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
