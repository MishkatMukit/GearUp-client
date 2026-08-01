import { Badge } from "@/components/ui/badge"
import type { PaymentStatus, RentalStatus } from "@/lib/types"

const RENTAL_STATUS_VARIANT: Record<RentalStatus, "amber" | "blue" | "purple" | "green" | "slate" | "red"> = {
  PLACED: "amber",
  CONFIRMED: "blue",
  PAID: "purple",
  PICKED_UP: "green",
  RETURNED: "slate",
  CANCELLED: "red",
}

const PAYMENT_STATUS_VARIANT: Record<PaymentStatus, "amber" | "green" | "red"> = {
  PENDING: "amber",
  COMPLETED: "green",
  FAILED: "red",
}

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  return <Badge variant={RENTAL_STATUS_VARIANT[status] ?? "slate"}>{status}</Badge>
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={PAYMENT_STATUS_VARIANT[status] ?? "slate"}>{status}</Badge>
}
