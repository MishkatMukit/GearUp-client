import { Suspense } from "react"
import Link from "next/link"
import { getRentalOrderById } from "@/service/rentals"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GearThumb } from "@/components/shared/GearThumb"
import { PaymentForm } from "@/app/payment/_components/PaymentForm"
import { formatMoney } from "@/lib/format"
import type { ApiRentalOrder } from "@/lib/types"

function PaymentSummarySkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="size-10 animate-pulse rounded-md bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PaymentSummary({ order }: { order: ApiRentalOrder }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <GearThumb src={order.gearItem?.images?.[0]} alt={order.gearItem?.name ?? "Gear"} />
          <div className="min-w-0">
            <p className="font-medium">{order.gearItem?.name ?? "Gear item"}</p>
            <p className="text-sm text-muted-foreground">
              {order.gearItem?.brand ?? "—"}
            </p>
          </div>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Total</dt>
            <dd className="font-semibold">{formatMoney(order.totalAmount)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}

async function PaymentContent({ orderId }: { orderId: string }) {
  const order = await getRentalOrderById(orderId)

  if (!order) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Order not found.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/customer/orders">View My Orders</Link>
        </Button>
      </div>
    )
  }

  if (order.status !== "CONFIRMED") {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">
          This order can no longer be paid for. Current status: {order.status}.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/customer/orders">View My Orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <PaymentSummary order={order} />
      <PaymentForm order={order} />
    </div>
  )
}

export default function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete your payment to confirm the rental.
        </p>

        <div className="mt-8">
          <Suspense fallback={<PaymentSummarySkeleton />}>
            <PaymentShell searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

async function PaymentShell({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams

  if (!orderId) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">No order selected.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/customer/orders">View My Orders</Link>
        </Button>
      </div>
    )
  }

  return <PaymentContent orderId={orderId} />
}
