import Link from "next/link"
import { ArrowRight, Boxes, Receipt, Users } from "lucide-react"
import { getAdminGear, getAdminRentals, getAdminUsers } from "@/service/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AdminRentalsTable,
  AdminRentalsTableSkeleton,
} from "@/app/(dashboardGroup)/admin-dashboard/_components/AdminRentalsTable"
import type { RentalStatus } from "@/lib/types"

const ACTIVE_STATUSES: RentalStatus[] = ["CONFIRMED", "PAID", "PICKED_UP"]

export async function AdminOverview() {
  const [users, gear, rentals] = await Promise.all([
    getAdminUsers(),
    getAdminGear(),
    getAdminRentals(),
  ])

  const activeGear = gear.filter((item) => item.isAvailable).length
  const activeRentals = rentals.filter((rental) => ACTIVE_STATUSES.includes(rental.status)).length

  const stats = [
    {
      label: "Total Users",
      value: String(users.length),
      icon: Users,
      hint: "Registered accounts",
    },
    {
      label: "Active Gear",
      value: String(activeGear),
      icon: Boxes,
      hint: "Available listings",
    },
    {
      label: "Active Rentals",
      value: String(activeRentals),
      icon: Receipt,
      hint: "In progress",
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
          <CardTitle>Recent Rentals</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin-dashboard/rentals" className="gap-1">
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <AdminRentalsTable rentals={rentals} limit={5} />
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminOverviewSkeleton() {
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
      <AdminRentalsTableSkeleton />
    </div>
  )
}
