import { Suspense } from "react"
import { CustomerOverview } from "@/app/(dashboardGroup)/dashboard/customer/_components/CustomerOverview"
import { StatsCardsSkeleton } from "@/app/(dashboardGroup)/dashboard/customer/_components/StatsCards"

export default function CustomerOverviewPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<StatsCardsSkeleton />}>
        <CustomerOverview />
      </Suspense>
    </div>
  )
}
