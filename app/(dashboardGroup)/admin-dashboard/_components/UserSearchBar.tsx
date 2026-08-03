"use client"

import { useRef, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function UserSearchBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [, startTransition] = useTransition()

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = (value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set("searchTerm", value)
      } else {
        params.delete("searchTerm")
      }

      params.delete("page")

      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`)
      })
    }, 500)
  }

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        defaultValue={searchParams.get("searchTerm") ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search by name or email..."
        className="h-10 pl-9"
      />
    </div>
  )
}
