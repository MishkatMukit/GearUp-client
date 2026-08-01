import { Suspense } from "react"
import {
  ProviderOverview,
  ProviderOverviewSkeleton,
} from "@/app/(dashboardGroup)/dashboard/provider/_components/ProviderOverview"

export default function ProviderOverviewPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<ProviderOverviewSkeleton />}>
        <ProviderOverview />
      </Suspense>
    </div>
  )
}
