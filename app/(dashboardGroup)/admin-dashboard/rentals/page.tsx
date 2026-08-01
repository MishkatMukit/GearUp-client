import { Suspense } from "react"
import { getAdminRentals } from "@/service/admin"
import { Card, CardContent } from "@/components/ui/card"
import {
  AdminRentalsTable,
  AdminRentalsTableSkeleton,
} from "@/app/(dashboardGroup)/admin-dashboard/_components/AdminRentalsTable"

async function RentalsList() {
  const rentals = await getAdminRentals()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rentals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Inspect all rental orders across the platform.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <AdminRentalsTable rentals={rentals} />
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminRentalsPage() {
  return (
    <Suspense fallback={<AdminRentalsTableSkeleton />}>
      <RentalsList />
    </Suspense>
  )
}
