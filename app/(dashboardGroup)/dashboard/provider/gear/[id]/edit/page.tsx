import { notFound } from "next/navigation"
import { getGearById, getCategories } from "@/service/gear"
import { GearForm } from "@/app/(dashboardGroup)/dashboard/provider/_components/GearForm"

type EditGearPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditGearPage({ params }: EditGearPageProps) {
  const { id } = await params
  const [gear, categories] = await Promise.all([getGearById(id), getCategories()])

  if (!gear) notFound()

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Edit Gear</h1>
      <p className="mt-1 text-sm text-muted-foreground">Update your listing details.</p>
      <div className="mt-6">
        <GearForm categories={categories} gear={gear} />
      </div>
    </div>
  )
}
