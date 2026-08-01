"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowUpDown } from "lucide-react"

const SORT_OPTIONS = [
  { value: "createdAt|desc", label: "Newest" },
  { value: "pricePerDay|asc", label: "Price: Low to High" },
  { value: "pricePerDay|desc", label: "Price: High to Low" },
]

type GearSortProps = {
  sortBy: string
  sortOrder: string
}

export function GearSort({ sortBy, sortOrder }: GearSortProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentValue = `${sortBy}|${sortOrder}`

  const handleChange = (value: string) => {
    const [nextSortBy, nextSortOrder] = value.split("|")
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", nextSortBy)
    params.set("sortOrder", nextSortOrder)
    params.delete("page")
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="size-4 shrink-0 text-muted-foreground" />
      <select
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Sort by"
        className="flex h-9 items-center rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
