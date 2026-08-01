import { Suspense } from "react"
import { getMyRentals } from "@/service/rentals"
import { Card, CardContent } from "@/components/ui/card"
import { OrdersTable, OrdersTableSkeleton } from "@/app/(dashboardGroup)/dashboard/customer/_components/OrdersTable"

async function OrdersList() {
  const rentals = await getMyRentals()

  return (
    <Card>
      <CardContent className="pt-6">
        <OrdersTable rentals={rentals} />
      </CardContent>
    </Card>
  )
}

export default function CustomerOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your rental order history with live status.
        </p>
      </div>
      <Suspense fallback={<OrdersTableSkeleton />}>
        <OrdersList />
      </Suspense>
    </div>
  )
}
