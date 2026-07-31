"use client"

import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function GearSearchBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const debouncedReference = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (value: string) => {
    if (debouncedReference.current) {
      clearTimeout(debouncedReference.current)
    }

    debouncedReference.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set("searchTerm", value)
      } else {
        params.delete("searchTerm")
      }

      params.delete("page")

      router.replace(`${pathname}?${params.toString()}`)
    }, 500)
  }

  return (
    <div className="relative w-full">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        key={searchParams.get("searchTerm") ?? ""}
        defaultValue={searchParams.get("searchTerm") ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search by name or brand..."
        className="h-12 pl-10"
      />
    </div>
  )
}
