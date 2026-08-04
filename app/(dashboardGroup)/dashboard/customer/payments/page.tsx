import { Suspense } from "react"
import { getMyPayments } from "@/service/rentals"
import { Card, CardContent } from "@/components/ui/card"
import {
  PaymentsTable,
  PaymentsTableSkeleton,
} from "@/app/(dashboardGroup)/dashboard/customer/_components/PaymentsTable"

async function PaymentsList() {
  const payments = await getMyPayments()

  return <PaymentsTable payments={payments} />
}

export default function CustomerPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your payment history and receipts.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<PaymentsTableSkeleton />}>
            <PaymentsList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
