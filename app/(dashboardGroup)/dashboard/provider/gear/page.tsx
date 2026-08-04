import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getProviderGear } from "@/service/provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GearTable, GearTableSkeleton } from "@/app/(dashboardGroup)/dashboard/provider/_components/GearTable"

async function GearList() {
  const gear = await getProviderGear()

  return <GearTable gear={gear} />
}

export default function ProviderGearPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Gear</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your inventory and availability.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/provider/gear/new">
            <Plus />
            Add Gear
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<GearTableSkeleton />}>
            <GearList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
