import Link from "next/link"
import { ArrowRight, Boxes, CalendarClock, Hourglass } from "lucide-react"
import { getProviderGear, getProviderOrders } from "@/service/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ProviderOrdersTable,
  ProviderOrdersTableSkeleton,
} from "@/app/(dashboardGroup)/dashboard/provider/_components/ProviderOrdersTable"
import type { RentalStatus } from "@/lib/types"

const ACTIVE_STATUSES: RentalStatus[] = ["CONFIRMED", "PAID", "PICKED_UP"]

export async function ProviderOverview() {
  const [gear, orders] = await Promise.all([getProviderGear(), getProviderOrders()])

  const activeRentals = orders.filter((order) => ACTIVE_STATUSES.includes(order.status)).length
  const pendingOrders = orders.filter((order) => order.status === "PLACED").length

  const stats = [
    {
      label: "Gear Listed",
      value: String(gear.length),
      icon: Boxes,
      hint: "Items in your inventory",
    },
    {
      label: "Active Rentals",
      value: String(activeRentals),
      icon: CalendarClock,
      hint: "Confirmed, paid or picked up",
    },
    {
      label: "Pending Orders",
      value: String(pendingOrders),
      icon: Hourglass,
      hint: "Awaiting your confirmation",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="truncate text-2xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.hint}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Recent Orders</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/provider/orders" className="gap-1">
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/provider/gear">Manage Gear</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ProviderOrdersTable orders={orders} limit={5} />
        </CardContent>
      </Card>
    </div>
  )
}

export function ProviderOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <div className="flex items-center gap-4">
              <div className="size-11 animate-pulse rounded-lg bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                <div className="h-6 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <ProviderOrdersTableSkeleton />
    </div>
  )
}
