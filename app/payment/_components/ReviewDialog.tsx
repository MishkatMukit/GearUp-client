"use client"

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
  const gearName = order.gearItem?.name ?? "this gear"

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pen className="size-4" />
          Leave Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {gearName}</DialogTitle>
          <DialogDescription>Share your experience with this gear.</DialogDescription>
        </DialogHeader>
        <ReviewForm order={order} />
      </DialogContent>
    </Dialog>
  )
}
