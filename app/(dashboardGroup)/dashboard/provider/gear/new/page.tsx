import { getCategories } from "@/service/gear"
import { GearForm } from "@/app/(dashboardGroup)/dashboard/provider/_components/GearForm"

export default async function NewGearPage() {
  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Add Gear</h1>
      <p className="mt-1 text-sm text-muted-foreground">List a new item for rent.</p>
      <div className="mt-6">
        <GearForm categories={categories} />
      </div>
    </div>
  )
}
