import { Package, CalendarClock, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ApiPayment, ApiRentalOrder, RentalStatus } from "@/lib/types"

const ACTIVE_STATUSES: RentalStatus[] = ["CONFIRMED", "PAID", "PICKED_UP"]

type StatsCardsProps = {
  rentals: ApiRentalOrder[]
  payments: ApiPayment[]
}

export function StatsCards({ rentals, payments }: StatsCardsProps) {
  const activeCount = rentals.filter((rental) => ACTIVE_STATUSES.includes(rental.status)).length
  const totalSpent = payments
    .filter((payment) => payment.status === "COMPLETED")
    .reduce((sum, payment) => sum + payment.amount, 0)

  const stats = [
    {
      label: "Total Rentals",
      value: String(rentals.length),
      icon: Package,
      hint: "All-time orders",
    },
    {
      label: "Active & Upcoming",
      value: String(activeCount),
      icon: CalendarClock,
      hint: "Confirmed, paid or picked up",
    },
    {
      label: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: DollarSign,
      hint: "Completed payments",
    },
  ]

  return (
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
  )
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-5 shadow-sm">
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
  )
}
