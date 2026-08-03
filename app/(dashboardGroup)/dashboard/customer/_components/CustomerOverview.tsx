import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getMyPayments, getMyRentals } from "@/service/rentals"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCards } from "@/app/(dashboardGroup)/dashboard/customer/_components/StatsCards"
import { OrdersTable } from "@/app/(dashboardGroup)/dashboard/customer/_components/OrdersTable"
import { PaymentsTable } from "@/app/(dashboardGroup)/dashboard/customer/_components/PaymentsTable"
import { StatsCardsSkeleton } from "@/app/(dashboardGroup)/dashboard/customer/_components/StatsCards"
import { OrdersTableSkeleton } from "@/app/(dashboardGroup)/dashboard/customer/_components/OrdersTable"
import { PaymentsTableSkeleton } from "@/app/(dashboardGroup)/dashboard/customer/_components/PaymentsTable"

export async function CustomerOverview() {
  const [rentals, payments] = await Promise.all([getMyRentals(), getMyPayments()])

  return (
    <div className="space-y-6">
      <StatsCards rentals={rentals} payments={payments} />

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/customer/orders" className="gap-1">
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <OrdersTable rentals={rentals} limit={5} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Payments</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/customer/payments" className="gap-1">
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <PaymentsTable payments={payments} limit={5} />
        </CardContent>
      </Card>
    </div>
  )
}

export function CustomerOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <StatsCardsSkeleton />
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <OrdersTableSkeleton />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <PaymentsTableSkeleton />
        </CardContent>
      </Card>
    </div>
  )
}
