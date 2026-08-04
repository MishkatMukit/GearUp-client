import { Suspense } from "react"
import { getProviderOrders } from "@/service/provider"
import { Card, CardContent } from "@/components/ui/card"
import {
  ProviderOrdersTable,
  ProviderOrdersTableSkeleton,
} from "@/app/(dashboardGroup)/dashboard/provider/_components/ProviderOrdersTable"

async function OrdersList() {
  const orders = await getProviderOrders()

  return <ProviderOrdersTable orders={orders} />
}

export default function ProviderOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Incoming Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm rentals and track fulfilment.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<ProviderOrdersTableSkeleton />}>
            <OrdersList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
