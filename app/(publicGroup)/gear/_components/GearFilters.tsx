import { getCategories } from "@/service/gear"
import { FilterSidebar } from "@/app/(publicGroup)/gear/_components/FilterSidebar"

export async function GearFilters() {
  const categories = await getCategories()

  return <FilterSidebar categories={categories} />
}
