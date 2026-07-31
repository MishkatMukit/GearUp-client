import { getCategories } from "@/service/gear"
import { FilterSidebar } from "@/app/(publicGroup)/gear/_components/FilterSidebar"
import type { GearQuery } from "@/service/gear"

export async function GearFilters({ query }: { query: GearQuery }) {
  const categories = await getCategories()

  return <FilterSidebar categories={categories} query={query} />
}
