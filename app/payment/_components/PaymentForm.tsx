"use client"

import { useEffect } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createPaymentAction } from "@/app/payment/_actions/payments"
import { formatDate, formatMoney } from "@/lib/format"
import type { ApiRentalOrder } from "@/lib/types"

type PaymentFormProps = {
  order: ApiRentalOrder
}

export function PaymentForm({ order }: PaymentFormProps) {
  const [state, formAction, pending] = useActionState(createPaymentAction, {
    success: false,
    message: "",
  })

  useEffect(() => {
    if (state.success && state.data?.url) {
      window.location.href = state.data.url
    }
  }, [state])

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction}>
          <input type="hidden" name="orderId" value={order.id} />

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rental period</span>
              <span>
                {formatDate(order.startDate)} – {formatDate(order.endDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Days</span>
              <span>{order.days}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity</span>
              <span>{order.quantity}</span>
            </div>
            <div className="flex justify-between border-t pt-3 font-semibold">
              <span>Total</span>
              <span>{formatMoney(order.totalAmount)}</span>
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full" disabled={pending}>
            {pending ? "Redirecting to payment..." : "Pay with Stripe"}
          </Button>

          {!state.success && state.message && (
            <p className="mt-3 text-xs text-destructive">{state.message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
