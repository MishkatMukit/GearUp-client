import { Suspense } from "react"
import {
  AdminOverview,
  AdminOverviewSkeleton,
} from "@/app/(dashboardGroup)/admin-dashboard/_components/AdminOverview"

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<AdminOverviewSkeleton />}>
        <AdminOverview />
      </Suspense>
    </div>
  )
}
