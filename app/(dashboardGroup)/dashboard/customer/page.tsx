import { Suspense } from "react"
import { CustomerOverview, CustomerOverviewSkeleton } from "@/app/(dashboardGroup)/dashboard/customer/_components/CustomerOverview"

export default function CustomerOverviewPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<CustomerOverviewSkeleton />}>
        <CustomerOverview />
      </Suspense>
    </div>
  )
}
