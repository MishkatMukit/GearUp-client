import { Suspense } from "react"
import { getMyPayments } from "@/service/rentals"
import { Card, CardContent } from "@/components/ui/card"
import {
  PaymentsTable,
  PaymentsTableSkeleton,
} from "@/app/(dashboardGroup)/dashboard/customer/_components/PaymentsTable"

async function PaymentsList() {
  const payments = await getMyPayments()

  return (
    <Card>
      <CardContent className="pt-6">
        <PaymentsTable payments={payments} />
      </CardContent>
    </Card>
  )
}

export default function CustomerPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your payment history for past rentals.
        </p>
      </div>
      <Suspense fallback={<PaymentsTableSkeleton />}>
        <PaymentsList />
      </Suspense>
    </div>
  )
}
