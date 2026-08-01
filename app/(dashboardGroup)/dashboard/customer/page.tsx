import { Suspense } from "react"
import { CustomerOverview } from "@/app/(dashboardGroup)/dashboard/customer/_components/CustomerOverview"
import { StatsCardsSkeleton } from "@/app/(dashboardGroup)/dashboard/customer/_components/StatsCards"

export default function CustomerOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your rental summary, order history, and payments.
        </p>
      </div>
      <Suspense fallback={<StatsCardsSkeleton />}>
        <CustomerOverview />
      </Suspense>
    </div>
  )
}
