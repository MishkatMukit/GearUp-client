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
      <Suspense fallback={<OrdersTableSkeleton />}>
        <OrdersList />
      </Suspense>
    </div>
  )
}
