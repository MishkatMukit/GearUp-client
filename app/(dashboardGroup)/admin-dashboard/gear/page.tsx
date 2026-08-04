import { Suspense } from "react"
import { getAdminGear } from "@/service/admin"
import { Card, CardContent } from "@/components/ui/card"
import {
  AdminGearTable,
  AdminGearTableSkeleton,
} from "@/app/(dashboardGroup)/admin-dashboard/_components/AdminGearTable"

async function GearList() {
  const gear = await getAdminGear()

  return <AdminGearTable gear={gear} />
}

export default function AdminGearPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gear</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inspect all gear listings across the platform.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<AdminGearTableSkeleton />}>
            <GearList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
